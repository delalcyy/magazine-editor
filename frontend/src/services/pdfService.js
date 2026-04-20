const PDF_API_URL = '/api/generate-pdf'

/**
 * formData'yı backend'e gönderir, PDF URL'ini döner.
 *
 * @param {Object} formData — { category, title, subtitle, answers, images }
 * @returns {Promise<{ fileName: string, fileUrl: string }>}
 */
export async function requestPDF(formData) {
  const response = await fetch(PDF_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  })

  const data = await response.json()

  if (!response.ok || !data.success) {
    const message = data?.error?.message || 'PDF oluşturulamadı.'
    throw new Error(message)
  }

  return { fileName: data.fileName, fileUrl: data.fileUrl }
}
