/**
 * GET /api/health
 * Sunucunun ayakta olduğunu ve ortam bilgisini döner.
 */
function getHealth(req, res) {
  res.status(200).json({
    success: true,
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  })
}

module.exports = { getHealth }
