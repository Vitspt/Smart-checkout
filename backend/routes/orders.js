// routes/orders.js
const router = require('express').Router();
const auth = require('../middleware/auth');
const c    = require('../controllers/ordersController');

router.use(auth);

router.post('/',             c.createOrder);
router.get('/',              c.getMyOrders);
router.get('/:id',           c.getOrderById);
router.patch('/:id/cancel',  c.cancelOrder);

module.exports = router;
