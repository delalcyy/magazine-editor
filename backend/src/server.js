require('dotenv').config()
const app = require('./app')

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`[SERVER] Ortam   : ${process.env.NODE_ENV || 'development'}`)
  console.log(`[SERVER] Port    : ${PORT}`)
  console.log(`[SERVER] Health  : http://localhost:${PORT}/api/health`)
})
