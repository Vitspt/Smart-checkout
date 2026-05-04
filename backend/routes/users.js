// routes/users.js
const router = require('express').Router();
const auth = require('../middleware/auth');
const c    = require('../controllers/usersController');

router.use(auth);

router.get('/me/profile',      c.getProfile);
router.patch('/me',            c.updateProfile);
router.patch('/me/password',   c.changePassword);
router.get('/me/points',       c.getPoints);
router.get('/me/wallet',       c.getWallet);
router.post('/me/wallet/topup', c.topUpWallet);
router.delete('/me',           c.deleteAccount);

module.exports = router;
