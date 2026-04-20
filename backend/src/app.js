const express    = require('express')
const path       = require('path')
const cors       = require('cors')
const corsOptions    = require('./middleware/corsOptions')
const errorHandler   = require('./middleware/errorHandler')
const notFound       = require('./middleware/notFound')
const healthRoutes   = require('./routes/healthRoutes')
const orderRoutes    = require('./routes/orderRoutes')
const adminRoutes    = require('./routes/adminRoutes')
const authRoutes     = require('./routes/authRoutes')
const abonelikRoutes = require('./routes/abonelikRoutes')
const kapakRoutes    = require('./routes/kapakRoutes')

const app = express()

// ── Middleware ─────────────────────────────────────────────────
app.use(cors(corsOptions))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true }))

// ── Static: üretilen PDF'ler ───────────────────────────────────
app.use('/pdfs', express.static(path.join(__dirname, '../uploads/pdfs')))

// ── Routes ────────────────────────────────────────────────────
app.use('/api',           healthRoutes)
app.use('/api/auth',      authRoutes)
app.use('/api/abonelik',  abonelikRoutes)
app.use('/api/orders',    orderRoutes)
app.use('/api/kapak',     kapakRoutes)
app.use('/api/admin',     adminRoutes)

// ── Hata yakalama ──────────────────────────────────────────────
app.use(notFound)
app.use(errorHandler)

module.exports = app
