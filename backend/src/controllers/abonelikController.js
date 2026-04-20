const db = require('../db')

/* ── Abonelik oluştur / güncelle ─────────────────────────────── */
async function createAbonelik(req, res, next) {
  try {
    const { ad, soyad, il, ilce, adres } = req.body
    const userId = req.user.id

    if (!il || !ilce || !adres) {
      return res.status(400).json({ success: false, error: { message: 'İl, ilçe ve adres zorunludur.' } })
    }

    // Kullanıcı adını güncelle
    if (ad && soyad) {
      await db.query('UPDATE users SET ad=?, soyad=? WHERE id=?', [ad.trim(), soyad.trim(), userId])
    }

    const bitis = new Date(); bitis.setFullYear(bitis.getFullYear() + 1)

    const [existing] = await db.query('SELECT id FROM user_abonelik WHERE user_id=?', [userId])
    if (existing.length) {
      await db.query(
        'UPDATE user_abonelik SET aktif=1, il=?, ilce=?, adres=?, baslangic_tarihi=NOW(), bitis_tarihi=? WHERE user_id=?',
        [il.trim(), ilce.trim(), adres.trim(), bitis, userId]
      )
    } else {
      await db.query(
        'INSERT INTO user_abonelik (user_id, aktif, il, ilce, adres, baslangic_tarihi, bitis_tarihi) VALUES (?,1,?,?,?,NOW(),?)',
        [userId, il.trim(), ilce.trim(), adres.trim(), bitis]
      )
    }

    return res.json({ success: true, message: 'Aboneliğiniz aktifleştirildi.' })
  } catch (err) { next(err) }
}

/* ── Abonelik durumu ─────────────────────────────────────────── */
async function getAbonelik(req, res, next) {
  try {
    const [rows] = await db.query(
      'SELECT aktif, il, ilce, adres, baslangic_tarihi, bitis_tarihi FROM user_abonelik WHERE user_id=?',
      [req.user.id]
    )
    return res.json({ success: true, abonelik: rows[0] || null })
  } catch (err) { next(err) }
}

/* ── Seri numarası doğrula ve abonelik aktifleştir ───────────── */
async function dogrulaKod(req, res, next) {
  try {
    const { seri_no } = req.body
    const userId = req.user.id

    if (!seri_no) {
      return res.status(400).json({ success: false, error: { message: 'Seri numarası zorunludur.' } })
    }

    const [kodRows] = await db.query(
      'SELECT * FROM unique_kodlar WHERE kod = ?',
      [seri_no.trim()]
    )

    if (!kodRows.length) {
      return res.status(400).json({ success: false, error: { message: 'Geçersiz seri numarası.' } })
    }

    const kodRow = kodRows[0]

    if (kodRow.kullanildi && kodRow.user_id !== userId) {
      return res.status(400).json({ success: false, error: { message: 'Bu seri numarası zaten kullanılmış.' } })
    }

    const bitis = new Date(); bitis.setFullYear(bitis.getFullYear() + 1)

    await db.query('UPDATE unique_kodlar SET kullanildi=1, user_id=? WHERE id=?', [userId, kodRow.id])

    const [existing] = await db.query('SELECT id FROM user_abonelik WHERE user_id=?', [userId])
    if (existing.length) {
      await db.query(
        'UPDATE user_abonelik SET aktif=1, baslangic_tarihi=NOW(), bitis_tarihi=? WHERE user_id=?',
        [bitis, userId]
      )
    } else {
      await db.query(
        'INSERT INTO user_abonelik (user_id, aktif, baslangic_tarihi, bitis_tarihi) VALUES (?,1,NOW(),?)',
        [userId, bitis]
      )
    }

    return res.json({ success: true, message: 'Aboneliğiniz aktifleştirildi.' })
  } catch (err) { next(err) }
}

module.exports = { createAbonelik, getAbonelik, dogrulaKod }
