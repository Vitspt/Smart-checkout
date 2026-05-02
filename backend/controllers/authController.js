// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { supabase } = require('../config/db');

const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'dev_secret', {
  expiresIn: process.env.JWT_EXPIRES_IN || '7d'
});

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: 'name, email and password are required' });

    // Check if user exists
    const { data: existing } = await supabase.from('users').select('id').eq('email', email).single();
    if (existing)
      return res.status(409).json({ success: false, message: 'Email already registered' });

    const password_hash = await bcrypt.hash(password, 10);
    const user = {
      name,
      email,
      phone: phone || '',
      password: password_hash, // matching table column 'password'
      joined: new Date().toISOString().split('T')[0],
      points: 0,
      role: 'user'
    };

    const { data, error } = await supabase.from('users').insert([user]).select().single();
    if (error) throw error;

    const { password: _, ...safe } = data;
    res.status(201).json({ success: true, token: sign(data.id), user: safe });
  } catch (e) { next(e); }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'email and password are required' });

    const { data: user, error } = await supabase.from('users').select('*').eq('email', email).single();
    if (error || !user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const { password: _, ...safe } = user;
    res.json({ success: true, token: sign(user.id), user: safe });
  } catch (e) { next(e); }
};

// GET /api/auth/me  (protected)
exports.me = (req, res) => {
  const { password, ...safe } = req.user;
  res.json({ success: true, user: safe });
};

// POST /api/auth/logout
exports.logout = (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
};

