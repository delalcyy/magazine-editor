const API_URL = '/api/generate-questions'

/**
 * Backend'e POST atarak kategoriye uygun sorular üretir.
 * Vite proxy sayesinde /api → localhost:3001/api yönlenir.
 *
 * @param {Object} params
 * @param {string} params.category
 * @param {string} params.tone
 * @param {number} params.questionCount
 * @returns {Promise<string[]>}
 */
export async function generateQuestions({ category, tone, questionCount }) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ category, tone, questionCount }),
  })

  const data = await response.json()

  if (!response.ok || !data.success) {
    const message = data?.error?.message || 'Sunucudan hata yanıtı alındı.'
    throw new Error(message)
  }

  return data.questions
}
