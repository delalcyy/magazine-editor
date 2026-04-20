const db = require('../db')

/* ── 100 adet 9 haneli benzersiz kod üret ────────────────────── */
async function generateKodlar(req, res, next) {
  try {
    const codes = new Set()
    while (codes.size < 100) {
      const kod = String(Math.floor(100000000 + Math.random() * 900000000))
      codes.add(kod)
    }

    // Mevcut kodları al (çakışma önlemi)
    const [existing] = await db.query('SELECT kod FROM unique_kodlar')
    const existingSet = new Set(existing.map(r => r.kod))

    const newCodes = [...codes].filter(k => !existingSet.has(k))
    if (!newCodes.length) {
      return res.status(409).json({ success: false, error: { message: 'Tüm üretilen kodlar zaten mevcut, tekrar deneyin.' } })
    }

    const values = newCodes.map(k => [k])
    await db.query('INSERT IGNORE INTO unique_kodlar (kod) VALUES ?', [values])

    return res.json({ success: true, count: newCodes.length, message: `${newCodes.length} kod üretildi.` })
  } catch (err) { next(err) }
}

/* ── Kodları listele ─────────────────────────────────────────── */
async function listKodlar(req, res, next) {
  try {
    const [rows] = await db.query(
      `SELECT k.id, k.kod, k.kullanildi, k.created_at AS olusturulma,
              u.ad, u.soyad, u.email
       FROM unique_kodlar k
       LEFT JOIN users u ON u.id = k.user_id
       ORDER BY k.created_at DESC`
    )
    return res.json({ success: true, count: rows.length, kodlar: rows })
  } catch (err) { next(err) }
}

/* ── Kullanıcıları listele ───────────────────────────────────── */
async function listUsers(req, res, next) {
  try {
    const [rows] = await db.query(
      `SELECT u.id, u.ad, u.soyad, u.email, u.telefon, u.role, u.created_at,
              a.aktif, a.bitis_tarihi
       FROM users u
       LEFT JOIN user_abonelik a ON a.user_id = u.id
       ORDER BY u.created_at DESC`
    )
    return res.json({ success: true, count: rows.length, users: rows })
  } catch (err) { next(err) }
}

/* ── Dashboard istatistik ────────────────────────────────────── */
async function dashboard(req, res, next) {
  try {
    const [[{ toplamKullanici }]] = await db.query('SELECT COUNT(*) AS toplamKullanici FROM users WHERE role="user"')
    const [[{ aktifAbonelik }]]   = await db.query('SELECT COUNT(*) AS aktifAbonelik FROM user_abonelik WHERE aktif=1')
    const [[{ toplamSiparis }]]   = await db.query('SELECT COUNT(*) AS toplamSiparis FROM siparisler')
    const [[{ kullanilanKod }]]   = await db.query('SELECT COUNT(*) AS kullanilanKod FROM unique_kodlar WHERE kullanildi=1')
    const [[{ bekleyenKod }]]     = await db.query('SELECT COUNT(*) AS bekleyenKod FROM unique_kodlar WHERE kullanildi=0')

    return res.json({
      success: true,
      stats: { toplamKullanici, aktifAbonelik, toplamSiparis, kullanilanKod, bekleyenKod }
    })
  } catch (err) { next(err) }
}

module.exports = { generateKodlar, listKodlar, listUsers, dashboard }
