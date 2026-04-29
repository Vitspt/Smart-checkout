// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/db');

const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'dev_secret', {
  expiresIn: process.env.JWT_EXPIRES_IN || '7d'
});

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: 'name, email and password are required' });

    if (db.users.find(u => u.email === email))
      return res.status(409).json({ success: false, message: 'Email already registered' });

    const user = {
      id: uuidv4(),
      name,
      email,
      phone: phone || '',
      password_hash: await bcrypt.hash(password, 10),
      joined: new Date().toISOString().split('T')[0],
      points: 0,
      role: 'user',
      created_at: new Date().toISOString()
    };
    db.users.push(user);

    const { password_hash, ...safe } = user;
    res.status(201).json({ success: true, token: sign(user.id), user: safe });
  } catch (e) { next(e); }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'email and password are required' });

    const user = db.users.find(u => u.email === email);
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const { password_hash, ...safe } = user;
    res.json({ success: true, token: sign(user.id), user: safe });
  } catch (e) { next(e); }
};

// GET /api/auth/me  (protected)
exports.me = (req, res) => {
  const { password_hash, ...safe } = req.user;
  res.json({ success: true, user: safe });
};

// POST /api/auth/logout  (client discards token; nothing to invalidate server-side in JWT)
exports.logout = (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
};
