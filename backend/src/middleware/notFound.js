/**
 * Tanımlı hiçbir route ile eşleşmeyen istekler için 404 döner.
 */
function notFound(req, res) {
  res.status(404).json({
    success: false,
    error: {
      message: `'${req.method} ${req.originalUrl}' endpoint'i bulunamadı.`,
    },
  })
}

module.exports = notFound
