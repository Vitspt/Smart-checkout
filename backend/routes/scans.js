// routes/scans.js
const router = require('express').Router();
const auth = require('../middleware/auth');
const c    = require('../controllers/scansController');

router.use(auth);

router.post('/',       c.scan);
router.get('/',        c.getHistory);
router.delete('/',     c.clearHistory);

module.exports = router;
