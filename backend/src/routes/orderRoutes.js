const express  = require('express')
const upload   = require('../middleware/upload')
const { submitOrder, myOrders } = require('../controllers/orderController')
const { authRequired } = require('../middleware/authMiddleware')

const router = express.Router()

// 2 görsel: image1 ve image2 field adları
router.post(
  '/submit',
  authRequired,
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
  ]),
  submitOrder
)

router.get('/my-orders', authRequired, myOrders)

module.exports = router
