// controllers/productsController.js
const { PRODUCTS, CATEGORIES } = require('../data/mockData');

// GET /api/products
exports.getAll = (req, res) => {
  let list = [...PRODUCTS];
  const { category, q, sort, min, max } = req.query;

  if (category && category !== 'All')
    list = list.filter(p => p.category === category);

  if (q) {
    const s = q.toLowerCase();
    list = list.filter(p =>
      p.name.toLowerCase().includes(s) ||
      p.brand.toLowerCase().includes(s) ||
      p.category.toLowerCase().includes(s)
    );
  }

  if (min) list = list.filter(p => p.price >= Number(min));
  if (max) list = list.filter(p => p.price <= Number(max));

  if (sort === 'price_asc')  list.sort((a, b) => a.price - b.price);
  else if (sort === 'price_desc') list.sort((a, b) => b.price - a.price);
  else list.sort((a, b) => b.rating - a.rating); // default: popular

  res.json({ success: true, count: list.length, data: list });
};

// GET /api/products/categories
exports.getCategories = (req, res) => {
  res.json({ success: true, data: CATEGORIES });
};

// GET /api/products/:id
exports.getById = (req, res) => {
  const p = PRODUCTS.find(p => p.id === req.params.id || p.barcode === req.params.id);
  if (!p) return res.status(404).json({ success: false, message: 'Product not found' });
  res.json({ success: true, data: p });
};

// GET /api/products/:id/location
exports.getLocation = (req, res) => {
  const p = PRODUCTS.find(p => p.id === req.params.id);
  if (!p) return res.status(404).json({ success: false, message: 'Product not found' });
  if (!p.location) return res.status(404).json({ success: false, message: 'Location data not available' });
  res.json({ success: true, product: p.name, location: p.location });
};

// GET /api/products/search?q=
exports.search = (req, res) => {
  const { q } = req.query;
  if (!q) return res.json({ success: true, count: 0, data: [] });
  const s = q.toLowerCase();
  const results = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(s) ||
    p.brand.toLowerCase().includes(s) ||
    p.category.toLowerCase().includes(s)
  );
  res.json({ success: true, count: results.length, data: results });
};
