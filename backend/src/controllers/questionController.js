const { validateGenerateRequest } = require('../utils/validateRequest')
const { generateQuestions } = require('../services/questionService')

/**
 * POST /api/generate-questions
 *
 * Body:
 *   category     {string} zorunlu
 *   tone         {string} opsiyonel
 *   questionCount {number} opsiyonel
 */
async function generateQuestionsHandler(req, res, next) {
  try {
    // 1. Validation
    const validation = validateGenerateRequest(req.body)

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: { message: validation.error },
      })
    }

    const { category, tone, questionCount } = validation.data

    // 2. Servis çağrısı
    const questions = await generateQuestions({ category, tone, questionCount })

    // 3. Başarılı response
    return res.status(200).json({
      success: true,
      category,
      tone,
      questionCount: questions.length,
      questions,
    })
  } catch (err) {
    // Beklenmeyen hatalar merkezi errorHandler'a gider
    next(err)
  }
}

module.exports = { generateQuestionsHandler }
