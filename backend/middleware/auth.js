const jwt = require('jsonwebtoken');
const { supabase } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'smart_checkout_secret_2026_!@#$';

module.exports = async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token  = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ success: false, message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded.id) {
      const keys = Object.keys(decoded).join(', ');
      return res.status(401).json({ success: false, message: `Invalid token payload (Found keys: ${keys})` });
    }

    const { data: user, error } = await supabase.from('users').select('*').eq('id', decoded.id).single();
    
    if (error || !user) {
      console.error('Auth Error: User not found for ID', decoded.id, error);
      return res.status(401).json({ success: false, message: `User session not found in database (ID: ${decoded.id.slice(0,5)}...)` });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error('JWT Error:', err.message);
    res.status(401).json({ success: false, message: 'Session expired or invalid token: ' + err.message });
  }
};

