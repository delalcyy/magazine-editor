const { generatePDF }  = require('../services/pdfService')
const { QUESTIONS }    = require('../data/questions')

/**
 * POST /api/generate-pdf
 *
 * Body: formData { category, title, subtitle, answers, images }
 */
async function generatePDFHandler(req, res, next) {
  try {
    const { category, title, subtitle, answers, images } = req.body

    // Temel validasyon
    if (!category || typeof category !== 'string' || category.trim() === '') {
      return res.status(400).json({
        success: false,
        error: { message: "'category' alanı zorunludur." },
      })
    }

    const questions = QUESTIONS[category.trim()]
    if (!questions) {
      return res.status(400).json({
        success: false,
        error: { message: `Desteklenmeyen kategori: '${category}'.` },
      })
    }

    // Soru listesini formData'ya ekle — template ihtiyaç duyar
    const formData = {
      category: category.trim(),
      title:    title    || '',
      subtitle: subtitle || '',
      answers:  answers  || {},
      images:   images   || {},
      questions,
    }

    const { fileName } = await generatePDF(formData)

    // Static serve URL'i oluştur
    const fileUrl = `${req.protocol}://${req.get('host')}/pdfs/${fileName}`

    return res.status(200).json({
      success:  true,
      fileName,
      fileUrl,
    })

  } catch (err) {
    console.error('[PDF Controller] Hata:', err.message)
    next(err)
  }
}

module.exports = { generatePDFHandler }
