// routes/cart.js
const router = require('express').Router();
const auth = require('../middleware/auth');
const c    = require('../controllers/cartController');

router.use(auth); // All cart routes require login

router.get('/summary',         c.getSummary);
router.get('/',                c.getCart);
router.post('/',               c.addItem);
router.patch('/:product_id',   c.updateItem);
router.delete('/:product_id',  c.removeItem);
router.delete('/',             c.clearCart);

module.exports = router;
