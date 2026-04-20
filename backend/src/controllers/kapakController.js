const db                  = require('../db')
const { generateKapakPDF } = require('../services/kapakPdfService')

async function saveKapak(req, res, next) {
  try {
    const { head, sub, imageBase64 } = req.body
    const userId = req.user?.id

    const { fileName } = await generateKapakPDF({
      imageBase64: imageBase64 || null,
      head: head || '',
      sub:  sub  || '',
    })

    // Kullanıcının mevcut kapak kaydını güncelle ya da yenisini oluştur
    if (userId) {
      await db.query(
        `UPDATE siparisler SET kapak_pdf = ?
         WHERE user_id = ? AND kapak_pdf IS NOT NULL
         ORDER BY created_at DESC LIMIT 1`,
        [fileName, userId]
      )
    }

    return res.status(200).json({ success: true, kapakPdf: fileName })
  } catch (err) {
    console.error('[KAPAK] Hata:', err.message)
    next(err)
  }
}

module.exports = { saveKapak }
