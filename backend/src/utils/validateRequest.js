const SUPPORTED_CATEGORIES = [
  'Doğum Günü',
  'Evlilik',
  'Kariyer',
  'Bebek',
  'Mezuniyet',
]

const SUPPORTED_TONES = [
  'samimi',
  'resmi',
  'ilham verici',
  'nostaljik',
]

const MIN_QUESTION_COUNT = 1
const MAX_QUESTION_COUNT = 10
const DEFAULT_QUESTION_COUNT = 6
const DEFAULT_TONE = 'samimi'

/**
 * generate-questions isteğini doğrular ve
 * normalize edilmiş değerleri döner.
 *
 * @param {Object} body - req.body
 * @returns {{ valid: boolean, error?: string, data?: Object }}
 */
function validateGenerateRequest(body) {
  const { category, tone, questionCount } = body

  // category zorunlu
  if (!category || typeof category !== 'string' || category.trim() === '') {
    return { valid: false, error: "'category' alanı zorunludur." }
  }

  const trimmedCategory = category.trim()

  if (!SUPPORTED_CATEGORIES.includes(trimmedCategory)) {
    return {
      valid: false,
      error: `Desteklenmeyen kategori: '${trimmedCategory}'. Geçerli kategoriler: ${SUPPORTED_CATEGORIES.join(', ')}.`,
    }
  }

  // tone opsiyonel, geldiyse kontrol et
  let resolvedTone = DEFAULT_TONE
  if (tone !== undefined) {
    if (typeof tone !== 'string' || tone.trim() === '') {
      return { valid: false, error: "'tone' string bir değer olmalıdır." }
    }
    const trimmedTone = tone.trim()
    if (!SUPPORTED_TONES.includes(trimmedTone)) {
      return {
        valid: false,
        error: `Desteklenmeyen ton: '${trimmedTone}'. Geçerli tonlar: ${SUPPORTED_TONES.join(', ')}.`,
      }
    }
    resolvedTone = trimmedTone
  }

  // questionCount opsiyonel, geldiyse kontrol et
  let resolvedCount = DEFAULT_QUESTION_COUNT
  if (questionCount !== undefined) {
    const parsed = parseInt(questionCount, 10)
    if (isNaN(parsed)) {
      return { valid: false, error: "'questionCount' sayısal bir değer olmalıdır." }
    }
    if (parsed < MIN_QUESTION_COUNT || parsed > MAX_QUESTION_COUNT) {
      return {
        valid: false,
        error: `'questionCount' ${MIN_QUESTION_COUNT} ile ${MAX_QUESTION_COUNT} arasında olmalıdır.`,
      }
    }
    resolvedCount = parsed
  }

  return {
    valid: true,
    data: {
      category: trimmedCategory,
      tone: resolvedTone,
      questionCount: resolvedCount,
    },
  }
}

module.exports = { validateGenerateRequest, SUPPORTED_CATEGORIES }
