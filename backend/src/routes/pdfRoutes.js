const express = require('express')
const { generatePDFHandler } = require('../controllers/pdfController')

const router = express.Router()

router.post('/generate-pdf', generatePDFHandler)

module.exports = router
