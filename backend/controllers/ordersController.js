// controllers/ordersController.js
const { v4: uuidv4 } = require('uuid');
const { db }         = require('../config/db');
const { PRODUCTS }   = require('../data/mockData');

const TAX_RATE = 0.05;
const VALID_METHODS = ['upi', 'card', 'wallet', 'cash'];

// POST /api/orders  — checkout: builds order from current cart
exports.createOrder = (req, res) => {
  const { payment_method = 'upi', coupon_discount = 0 } = req.body;
  if (!VALID_METHODS.includes(payment_method))
    return res.status(400).json({ success: false, message: `payment_method must be one of: ${VALID_METHODS.join(', ')}` });

  const cartItems = db.cart_items
    .filter(i => i.user_id === req.user.id)
    .map(i => ({ ...i, product: PRODUCTS.find(p => p.id === i.product_id) }))
    .filter(i => i.product);

  if (!cartItems.length)
    return res.status(400).json({ success: false, message: 'Cart is empty' });

  const subtotal = cartItems.reduce((s, i) => s + i.product.price * i.qty, 0);
  const mrp      = cartItems.reduce((s, i) => s + i.product.mrp   * i.qty, 0);
  const tax      = Math.round(subtotal * TAX_RATE);
  const total    = subtotal + tax - Number(coupon_discount);

  const order = {
    id: 'ORD' + Date.now(),
    user_id: req.user.id,
    items: cartItems.map(i => ({
      product_id: i.product_id,
      name: i.product.name,
      brand: i.product.brand,
      emoji: i.product.emoji,
      price: i.product.price,
      mrp: i.product.mrp,
      qty: i.qty,
      line_total: i.product.price * i.qty
    })),
    subtotal,
    mrp,
    discount: mrp - subtotal,
    coupon_discount: Number(coupon_discount),
    tax,
    total,
    payment_method,
    status: 'paid',
    created_at: new Date().toISOString()
  };

  db.orders.push(order);

  // Clear cart
  db.cart_items = db.cart_items.filter(i => i.user_id !== req.user.id);

  // Award points (1 point per ₹10 spent)
  const user = db.users.find(u => u.id === req.user.id);
  if (user) user.points += Math.floor(total / 10);

  res.status(201).json({ success: true, message: 'Order placed successfully', order });
};

// GET /api/orders  — get logged-in user's orders
exports.getMyOrders = (req, res) => {
  const orders = db.orders
    .filter(o => o.user_id === req.user.id)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  res.json({ success: true, count: orders.length, data: orders });
};

// GET /api/orders/:id
exports.getOrderById = (req, res) => {
  const order = db.orders.find(o => o.id === req.params.id && o.user_id === req.user.id);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  res.json({ success: true, data: order });
};

// PATCH /api/orders/:id/cancel
exports.cancelOrder = (req, res) => {
  const order = db.orders.find(o => o.id === req.params.id && o.user_id === req.user.id);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  if (order.status !== 'paid')
    return res.status(400).json({ success: false, message: `Cannot cancel order with status: ${order.status}` });
  order.status = 'cancelled';
  res.json({ success: true, message: 'Order cancelled', order });
};

// POST /api/orders/:id/verify  — Staff action: verify QR at exit
exports.verifyOrder = (req, res) => {
  const order = db.orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  
  if (order.status === 'exited') {
    return res.status(400).json({ 
      success: false, 
      message: 'ALERT: This QR has already been used for exit!',
      exited_at: order.exited_at 
    });
  }

  if (order.status !== 'paid') {
    return res.status(400).json({ 
      success: false, 
      message: `Invalid order status: ${order.status}` 
    });
  }

  // Mark as exited
  order.status = 'exited';
  order.exited_at = new Date().toISOString();
  
  res.json({ 
    success: true, 
    message: 'Verification successful. Customer may exit.',
    order_id: order.id,
    purchased_at: order.created_at,
    exited_at: order.exited_at
  });
};
