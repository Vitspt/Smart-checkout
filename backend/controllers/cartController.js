// controllers/cartController.js
const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/db');
const { PRODUCTS } = require('../data/mockData');

const TAX_RATE = 0.05;

const userCart  = (uid) => db.cart_items.filter(i => i.user_id === uid);
const findItem  = (uid, pid) => db.cart_items.find(i => i.user_id === uid && i.product_id === pid);
const calcTotal = (items) => {
  const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const mrp      = items.reduce((s, i) => s + i.product.mrp   * i.qty, 0);
  const tax      = Math.round(subtotal * TAX_RATE);
  return { subtotal, mrp, discount: mrp - subtotal, tax, total: subtotal + tax };
};

// GET /api/cart
exports.getCart = (req, res) => {
  const items = userCart(req.user.id).map(i => ({
    ...i,
    product: PRODUCTS.find(p => p.id === i.product_id)
  })).filter(i => i.product);

  res.json({ success: true, count: items.length, items, totals: calcTotal(items) });
};

// POST /api/cart  { product_id, qty }
exports.addItem = (req, res) => {
  const { product_id, qty = 1 } = req.body;
  if (!product_id) return res.status(400).json({ success: false, message: 'product_id required' });

  const product = PRODUCTS.find(p => p.id === product_id);
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

  let item = findItem(req.user.id, product_id);
  if (item) {
    item.qty += Number(qty);
  } else {
    item = { id: uuidv4(), user_id: req.user.id, product_id, qty: Number(qty), added_at: new Date().toISOString() };
    db.cart_items.push(item);
  }
  res.status(201).json({ success: true, message: `${product.name} added to cart`, item });
};

// PATCH /api/cart/:product_id  { qty }
exports.updateItem = (req, res) => {
  const item = findItem(req.user.id, req.params.product_id);
  if (!item) return res.status(404).json({ success: false, message: 'Item not in cart' });

  const qty = Number(req.body.qty);
  if (qty <= 0) {
    const idx = db.cart_items.indexOf(item);
    db.cart_items.splice(idx, 1);
    return res.json({ success: true, message: 'Item removed' });
  }
  item.qty = qty;
  res.json({ success: true, message: 'Quantity updated', item });
};

// DELETE /api/cart/:product_id
exports.removeItem = (req, res) => {
  const idx = db.cart_items.findIndex(i => i.user_id === req.user.id && i.product_id === req.params.product_id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Item not in cart' });
  db.cart_items.splice(idx, 1);
  res.json({ success: true, message: 'Item removed' });
};

// DELETE /api/cart
exports.clearCart = (req, res) => {
  const before = db.cart_items.length;
  db.cart_items = db.cart_items.filter(i => i.user_id !== req.user.id);
  res.json({ success: true, message: `Cart cleared (${before - db.cart_items.length} items removed)` });
};

// GET /api/cart/summary
exports.getSummary = (req, res) => {
  const items = userCart(req.user.id).map(i => ({
    ...i, product: PRODUCTS.find(p => p.id === i.product_id)
  })).filter(i => i.product);
  res.json({ success: true, item_count: items.reduce((s, i) => s + i.qty, 0), totals: calcTotal(items) });
};
