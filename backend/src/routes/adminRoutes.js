const express = require('express')
const { adminRequired } = require('../middleware/authMiddleware')
const { generateKodlar, listKodlar, listUsers, dashboard } = require('../controllers/adminController')
const { listOrders, getOrder } = require('../controllers/orderController')

const router = express.Router()

router.use(adminRequired)

router.get('/dashboard',        dashboard)
router.get('/orders',           listOrders)
router.get('/orders/:orderId',  getOrder)
router.post('/kodlar/uret',     generateKodlar)
router.get('/kodlar',           listKodlar)
router.get('/users',            listUsers)

module.exports = router
