const express = require('express')
const { generateQuestionsHandler } = require('../controllers/questionController')

const router = express.Router()

router.post('/generate-questions', generateQuestionsHandler)

module.exports = router
