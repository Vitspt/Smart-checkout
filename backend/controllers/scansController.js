// controllers/scansController.js
const { v4: uuidv4 } = require('uuid');
const { db }         = require('../config/db');
const { PRODUCTS }   = require('../data/mockData');

// POST /api/scans  { barcode }  — scan a product by barcode
exports.scan = (req, res) => {
  const { barcode } = req.body;
  if (!barcode) return res.status(400).json({ success: false, message: 'barcode is required' });

  const product = PRODUCTS.find(p => p.id === barcode || p.barcode === barcode);
  if (!product) return res.status(404).json({ success: false, message: `No product found for barcode: ${barcode}` });

  const entry = {
    id: uuidv4(),
    user_id: req.user.id,
    product_id: product.id,
    product_name: product.name,
    brand: product.brand,
    emoji: product.emoji,
    price: product.price,
    scanned_at: new Date().toISOString()
  };
  db.scan_history.push(entry);

  res.status(201).json({ success: true, product, scan_entry: entry });
};

// GET /api/scans  — get logged-in user's scan history
exports.getHistory = (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 50, 100);
  const history = db.scan_history
    .filter(s => s.user_id === req.user.id)
    .sort((a, b) => new Date(b.scanned_at) - new Date(a.scanned_at))
    .slice(0, limit);
  res.json({ success: true, count: history.length, data: history });
};

// DELETE /api/scans  — clear scan history
exports.clearHistory = (req, res) => {
  const before = db.scan_history.length;
  db.scan_history = db.scan_history.filter(s => s.user_id !== req.user.id);
  res.json({ success: true, message: `Cleared ${before - db.scan_history.length} scan records` });
};
