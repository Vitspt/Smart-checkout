// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const { supabase } = require('../config/db');

const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'smart_checkout_secret_2026_!@#$', {
  expiresIn: '7d'
});

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into Supabase users table
    const newUser = {
      name,
      email,
      phone: phone || '',
      password: hashedPassword,
      joined: new Date().toISOString(),
      points: 0,
      wallet_balance: 0,
      role: 'user'
    };

    const { data, error } = await supabase.from('users').insert([newUser]).select().single();
    
    if (error) {
      if (error.code === '23505') return res.status(400).json({ success: false, message: 'Email already exists' });
      throw error;
    }

    const { password: _, ...safeUser } = data;
    res.status(201).json({
      success: true,
      token: sign(data.id),
      user: safeUser
    });
  } catch (e) { 
    console.error('Signup Error:', e);
    next(e); 
  }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password are required' });

    const { data: user, error } = await supabase.from('users').select('*').eq('email', email).single();
    if (error || !user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const { password: _, ...safeUser } = user;
    res.json({
      success: true,
      token: sign(user.id),
      user: safeUser
    });
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
