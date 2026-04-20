const jwt = require('jsonwebtoken')

function authRequired(req, res, next) {
  const header = req.headers['authorization'] || ''
  const token  = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    return res.status(401).json({ success: false, error: { message: 'Giriş yapmanız gerekiyor.' } })
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'maison_secret_2026')
    next()
  } catch {
    return res.status(401).json({ success: false, error: { message: 'Geçersiz veya süresi dolmuş oturum.' } })
  }
}

function adminRequired(req, res, next) {
  authRequired(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: { message: 'Admin yetkisi gerekiyor.' } })
    }
    next()
  })
}

module.exports = { authRequired, adminRequired }
