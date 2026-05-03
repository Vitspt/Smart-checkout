// routes/admin.js
const router = require('express').Router();
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const c = require('../controllers/adminController');

router.use(auth);
router.use(adminAuth);

router.get('/users', c.getAllUsers);
router.delete('/users/:id', c.deleteUser);

module.exports = router;
