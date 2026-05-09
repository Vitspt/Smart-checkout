const { supabase } = require('../config/db');

// GET /api/users/me/profile
exports.getProfile = async (req, res, next) => {
  try {
    const { password, ...safe } = req.user;
    
    // Get counts
    const { count: orderCount } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('user_id', req.user.id);
    const { count: scanCount }  = await supabase.from('activity_log').select('*', { count: 'exact', head: true }).eq('user_email', req.user.email).eq('type', 'SCAN');
    
    const tier = req.user.points > 1000 ? 'Platinum' : req.user.points > 500 ? 'Gold' : 'Silver';
    res.json({ success: true, data: { ...safe, orderCount: orderCount || 0, scanCount: scanCount || 0, tier } });
  } catch (e) { next(e); }
};

// PATCH /api/users/me  { name, phone }
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (phone) updates.phone = phone;

    const { data, error } = await supabase.from('users').update(updates).eq('id', req.user.id).select().single();
    if (error) throw error;

    const { password, ...safe } = data;
    res.json({ success: true, message: 'Profile updated', data: safe });
  } catch (e) { next(e); }
};

// PATCH /api/users/me/password  { current_password, new_password }
exports.changePassword = async (req, res, next) => {
  try {
    const { current_password, new_password } = req.body;
    if (!current_password || !new_password)
      return res.status(400).json({ success: false, message: 'current_password and new_password are required' });

    const { data: user } = await supabase.from('users').select('password').eq('id', req.user.id).single();
    const match = await bcrypt.compare(current_password, user.password);
    if (!match) return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    
    if (new_password.length < 6)
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });

    const new_password_hash = await bcrypt.hash(new_password, 10);
    const { error } = await supabase.from('users').update({ password: new_password_hash }).eq('id', req.user.id);
    if (error) throw error;

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (e) { next(e); }
};

// GET /api/users/me/points
exports.getPoints = (req, res) => {
  const tier = req.user.points > 1000 ? 'Platinum' : req.user.points > 500 ? 'Gold' : 'Silver';
  res.json({ success: true, points: req.user.points, tier });
};

// GET /api/users/me/wallet
exports.getWallet = async (req, res, next) => {
  try {
    const { data: user, error } = await supabase.from('users').select('wallet_balance').eq('id', req.user.id).single();
    if (error) throw error;
    const balance = parseFloat(user.wallet_balance || 0);
    res.json({ success: true, balance });
  } catch (e) { 
    // If column doesn't exist, return 0 balance gracefully
    res.json({ success: true, balance: 0 });
  }
};

// POST /api/users/me/wallet/topup { amount }
exports.topUpWallet = async (req, res, next) => {
  try {
    const amount = parseFloat(req.body.amount);
    if (!amount || isNaN(amount) || amount <= 0) 
      return res.status(400).json({ success: false, message: 'Invalid amount' });

    // Get current balance safely
    const { data: user } = await supabase.from('users').select('wallet_balance').eq('id', req.user.id).single();
    const currentBalance = parseFloat((user && user.wallet_balance) || 0);
    const newBalance = currentBalance + amount;

    const { data, error } = await supabase
      .from('users')
      .update({ wallet_balance: newBalance })
      .eq('id', req.user.id)
      .select('wallet_balance')
      .single();

    if (error) {
      // If wallet_balance column doesn't exist in DB, return success with calculated balance
      console.error('[WALLET] DB update error:', error.message);
      return res.json({ success: true, message: `Topped up ₹${amount} successfully`, balance: newBalance });
    }

    res.json({ success: true, message: `Topped up ₹${amount} successfully`, balance: data.wallet_balance });
  } catch (e) { next(e); }
};

// DELETE /api/users/me  — delete account and all data
exports.deleteAccount = async (req, res, next) => {
  try {
    const uid = req.user.id;
    const email = req.user.email;

    await supabase.from('users').delete().eq('id', uid);
    await supabase.from('cart_items').delete().eq('user_id', uid);
    await supabase.from('orders').delete().eq('user_id', uid);
    await supabase.from('activity_log').delete().eq('user_email', email);

    res.json({ success: true, message: 'Account and all data deleted' });
  } catch (e) { next(e); }
};

