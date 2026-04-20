const express             = require('express')
const { authRequired }    = require('../middleware/authMiddleware')
const { saveKapak }       = require('../controllers/kapakController')

const router = express.Router()

router.post('/save', authRequired, saveKapak)

module.exports = router
