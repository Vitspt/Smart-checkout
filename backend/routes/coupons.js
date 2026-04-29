// routes/coupons.js
const router = require('express').Router();
const auth = require('../middleware/auth');
const c    = require('../controllers/couponsController');

router.get('/',               c.getActiveCoupons);
router.post('/validate', auth, c.validateCoupon); // Require login to validate

module.exports = router;
