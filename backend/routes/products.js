// routes/products.js
const router = require('express').Router();
const c = require('../controllers/productsController');

router.get('/search',      c.search);
router.get('/categories',  c.getCategories);
router.get('/',            c.getAll);
router.get('/:id',         c.getById);
router.get('/:id/location', c.getLocation);

module.exports = router;
