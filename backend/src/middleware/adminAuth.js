/**
 * Admin endpoint'leri için API key doğrulaması.
 * İsteklerde x-admin-key header'ı ADMIN_API_KEY env değişkeniyle eşleşmeli.
 */
function adminAuth(req, res, next) {
  const key = req.headers['x-admin-key']
  const expected = process.env.ADMIN_API_KEY

  if (!expected) {
    console.warn('[ADMIN] ADMIN_API_KEY tanımlı değil — admin erişimi devre dışı.')
    return res.status(503).json({ success: false, error: { message: 'Admin erişimi yapılandırılmamış.' } })
  }

  if (!key || key !== expected) {
    return res.status(401).json({ success: false, error: { message: 'Yetkisiz erişim.' } })
  }

  next()
}

module.exports = adminAuth
