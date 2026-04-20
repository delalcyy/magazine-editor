const express = require('express')
const { createAbonelik, getAbonelik, dogrulaKod } = require('../controllers/abonelikController')
const { authRequired } = require('../middleware/authMiddleware')

const router = express.Router()

router.use(authRequired)
router.post('/',             createAbonelik)
router.get('/status',        getAbonelik)
router.post('/kod-dogrula',  dogrulaKod)

module.exports = router
