const bcrypt = require('bcryptjs')
const jwt    = require('jsonwebtoken')
const db     = require('../db')

const SECRET = process.env.JWT_SECRET || 'maison_secret_2026'

function makeToken(user) {
  return jwt.sign(
   { id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name },
    SECRET,
    { expiresIn: '7d' }
  )
}

/* ── Kayıt ───────────────────────────────────────────────────── */
async function register(req, res, next) {
  try {
    const { ad, soyad, telefon, email, sifre } = req.body
    if (!ad || !soyad || !email || !sifre) {
      return res.status(400).json({ success: false, error: { message: 'Ad, soyad, e-posta ve şifre zorunludur.' } })
    }

    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email])
    if (existing.length) {
      return res.status(409).json({ success: false, error: { message: 'Bu e-posta zaten kayıtlı.' } })
    }

    const hash = await bcrypt.hash(sifre, 10)
  const [result] = await db.query(
  'INSERT INTO users (first_name, last_name, phone, email, password) VALUES (?,?,?,?,?)',
  [ad.trim(), soyad.trim(), telefon || null, email.toLowerCase().trim(), hash]
)
    const userId = result.insertId

    // Boş abonelik kaydı oluştur
    await db.query('INSERT INTO user_abonelik (user_id, aktif) VALUES (?,0)', [userId])

    const [rows] = await db.query(
  'SELECT id, first_name, last_name, email FROM users WHERE id = ?',
  [userId]
)

return res.status(201).json({
  success: true,
  token: makeToken(rows[0]),
  user: rows[0]
})
  } catch (err) { next(err) }
}


/* ── Giriş ───────────────────────────────────────────────────── */
async function login(req, res, next) {
  try {
    const { email, sifre, kod } = req.body

    // ── Benzersiz kod ile giriş ──
    if (kod && !email) {
      const [kodRows] = await db.query('SELECT * FROM unique_kodlar WHERE kod = ?', [kod.trim()])
      if (!kodRows.length) {
        return res.status(400).json({ success: false, error: { message: 'Geçersiz kod.' } })
      }
      const kodRow = kodRows[0]
      if (kodRow.kullanildi && kodRow.user_id) {
        // Kod daha önce kullanılmış — direkt giriş
const [userRows] = await db.query('SELECT id, first_name, last_name, email FROM users WHERE id=?', [kodRow.user_id])
        if (!userRows.length) return res.status(404).json({ success: false, error: { message: 'Kullanıcı bulunamadı.' } })
        return res.json({ success: true, token: makeToken(userRows[0]), user: userRows[0] })
      }
      // Kod henüz kullanılmamış — e-posta iste
      return res.json({ success: true, kodOnay: true, message: 'Kodu doğrulamak için e-postanızı girin.' })
    }

    // ── Benzersiz kod + e-posta ile kayıt/giriş ──
    if (kod && email) {
      const [kodRows] = await db.query('SELECT * FROM unique_kodlar WHERE kod = ?', [kod.trim()])
      if (!kodRows.length) {
        return res.status(400).json({ success: false, error: { message: 'Geçersiz kod.' } })
      }
      const kodRow = kodRows[0]
      if (kodRow.kullanildi && kodRow.user_id) {
        return res.status(409).json({ success: false, error: { message: 'Bu kod zaten kullanılmış.' } })
      }

      // Kullanıcı var mı?
      let [userRows] = await db.query('SELECT id, first_name, last_name, email FROM users WHERE email=?', [email.toLowerCase().trim()])
      let userId

      if (!userRows.length) {
        // Yeni kullanıcı oluştur
      const [ins] = await db.query(
  'INSERT INTO users (first_name, last_name, email) VALUES (?,?,?)',
  ['', '', email.toLowerCase().trim()]
)
        userId = ins.insertId
        await db.query('INSERT INTO user_abonelik (user_id, aktif) VALUES (?,0)', [userId])
        ;[userRows] = await db.query('SELECT id, first_name, last_name, email FROM users WHERE id=?', [userId])
      } else {
        userId = userRows[0].id
      }

      // Kodu kullanıcıya ata + abonelik aktifleştir
      await db.query('UPDATE unique_kodlar SET kullanildi=1, user_id=? WHERE id=?', [userId, kodRow.id])
      const bitis = new Date(); bitis.setFullYear(bitis.getFullYear() + 1)
      await db.query(
        'UPDATE user_abonelik SET aktif=1, baslangic_tarihi=NOW(), bitis_tarihi=? WHERE user_id=?',
        [bitis, userId]
      )

      return res.json({ success: true, token: makeToken(userRows[0]), user: userRows[0] })
    }

    // ── E-posta + şifre ile giriş ──
    if (!email || !sifre) {
      return res.status(400).json({ success: false, error: { message: 'E-posta ve şifre zorunludur.' } })
    }

    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()])
    if (!rows.length) {
      return res.status(401).json({ success: false, error: { message: 'E-posta veya şifre hatalı.' } })
    }

    const user = rows[0]
    if (!user.password) {
      return res.status(401).json({ success: false, error: { message: 'Bu hesap şifresiz oluşturulmuş, kod ile giriş yapın.' } })
    }

    const ok = await bcrypt.compare(sifre, user.password)
    if (!ok) {
      return res.status(401).json({ success: false, error: { message: 'E-posta veya şifre hatalı.' } })
    }

    const { password: _, ...safeUser } = user
    return res.json({ success: true, token: makeToken(safeUser), user: safeUser })
  } catch (err) { next(err) }
}



/* ── Mevcut kullanıcı ────────────────────────────────────────── */
async function me(req, res, next) {
  try {
    const [rows] = await db.query(
`SELECT u.id, u.first_name, u.last_name, u.email, u.phone,
              a.aktif, a.baslangic_tarihi, a.bitis_tarihi,
              a.il, a.ilce, a.adres
       FROM users u
       LEFT JOIN user_abonelik a ON a.user_id = u.id
       WHERE u.id = ?`,
      [req.user.id]
    )
    if (!rows.length) return res.status(404).json({ success: false, error: { message: 'Kullanıcı bulunamadı.' } })
    return res.json({ success: true, user: rows[0] })
  } catch (err) { next(err) }
}

module.exports = { register, login, me }
