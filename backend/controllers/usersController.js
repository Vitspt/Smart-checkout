// controllers/usersController.js
const bcrypt = require('bcryptjs');
const { db } = require('../config/db');

// GET /api/users/me/profile
exports.getProfile = (req, res) => {
  const { password_hash, ...safe } = req.user;
  const orderCount = db.orders.filter(o => o.user_id === req.user.id).length;
  const scanCount  = db.scan_history.filter(s => s.user_id === req.user.id).length;
  const tier = req.user.points > 1000 ? 'Platinum' : req.user.points > 500 ? 'Gold' : 'Silver';
  res.json({ success: true, data: { ...safe, orderCount, scanCount, tier } });
};

// PATCH /api/users/me  { name, phone }
exports.updateProfile = (req, res) => {
  const { name, phone } = req.body;
  const user = db.users.find(u => u.id === req.user.id);
  if (name)  user.name  = name;
  if (phone) user.phone = phone;
  const { password_hash, ...safe } = user;
  res.json({ success: true, message: 'Profile updated', data: safe });
};

// PATCH /api/users/me/password  { current_password, new_password }
exports.changePassword = async (req, res) => {
  const { current_password, new_password } = req.body;
  if (!current_password || !new_password)
    return res.status(400).json({ success: false, message: 'current_password and new_password are required' });

  const user = db.users.find(u => u.id === req.user.id);
  const match = await bcrypt.compare(current_password, user.password_hash);
  if (!match) return res.status(401).json({ success: false, message: 'Current password is incorrect' });
  if (new_password.length < 6)
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });

  user.password_hash = await bcrypt.hash(new_password, 10);
  res.json({ success: true, message: 'Password changed successfully' });
};

// GET /api/users/me/points
exports.getPoints = (req, res) => {
  const tier = req.user.points > 1000 ? 'Platinum' : req.user.points > 500 ? 'Gold' : 'Silver';
  res.json({ success: true, points: req.user.points, tier });
};

// DELETE /api/users/me  — delete account and all data
exports.deleteAccount = (req, res) => {
  const uid = req.user.id;
  db.users        = db.users.filter(u => u.id !== uid);
  db.cart_items   = db.cart_items.filter(i => i.user_id !== uid);
  db.orders       = db.orders.filter(o => o.user_id !== uid);
  db.scan_history = db.scan_history.filter(s => s.user_id !== uid);
  res.json({ success: true, message: 'Account and all data deleted' });
};
