/**
 * Express merkezi hata yakalama middleware'i.
 * Tüm next(err) çağrıları buraya düşer.
 */
function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500
  const message = err.message || 'Beklenmeyen bir hata oluştu.'

  // Geliştirme ortamında stack trace'i logla
  if (process.env.NODE_ENV === 'development') {
    console.error(`[ERROR] ${status} – ${message}`)
    console.error(err.stack)
  } else {
    console.error(`[ERROR] ${status} – ${message}`)
  }

  res.status(status).json({
    success: false,
    error: {
      message,
      // Production'da stack trace gönderme
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  })
}

module.exports = errorHandler
