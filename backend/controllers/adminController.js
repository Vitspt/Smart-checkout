// controllers/adminController.js
const { supabase } = require('../config/db');

// GET /api/admin/users
exports.getAllUsers = async (req, res, next) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, name, email, phone, joined, points, role')
      .order('joined', { ascending: false });

    if (error) throw error;
    res.json({ success: true, data: users });
  } catch (e) { next(e); }
};

// DELETE /api/admin/users/:id
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if user exists
    const { data: user } = await supabase.from('users').select('email').eq('id', id).single();
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const email = user.email;

    // Delete user and related data
    await supabase.from('users').delete().eq('id', id);
    await supabase.from('cart_items').delete().eq('user_id', id);
    await supabase.from('orders').delete().eq('user_id', id);
    await supabase.from('activity_log').delete().eq('user_email', email);

    res.json({ success: true, message: `User ${email} and all related records deleted successfully` });
  } catch (e) { next(e); }
};

// GET /api/admin/orders — for revenue and stats
exports.getAllOrders = async (req, res, next) => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, data: orders });
  } catch (e) { next(e); }
};

// POST /api/admin/verify
exports.verifyOrder = async (req, res, next) => {
  try {
    const { order_id, status, notes, incident_type } = req.body;
    if (!order_id) return res.status(400).json({ success: false, message: 'order_id is required' });

    // 1. Fetch official order data
    const { data: order, error: oErr } = await supabase.from('orders').select('*').eq('id', order_id).single();
    if (oErr || !order) return res.status(404).json({ success: false, message: 'Order not found' });

    // 2. Prevent duplicate exit
    if (order.status === 'exited') {
      return res.status(400).json({ 
        success: false, 
        message: 'CRITICAL: This QR code has already been used to exit!',
        exited_at: order.exited_at
      });
    }

    const isHighValue = order.total > 5000;

    // 3. Mark order as exited
    const now = new Date().toISOString();
    await supabase.from('orders').update({ status: 'exited', exited_at: now }).eq('id', order_id);

    // 4. Log the security verification
    const verification = {
      order_id,
      staff_id: req.user.id,
      status: status || 'verified',
      total_amount: order.total,
      is_high_value: isHighValue,
      incident_type: incident_type || null,
      notes: notes || null
    };

    const { error: vErr } = await supabase.from('security_verifications').insert([verification]);
    if (vErr) console.error('Verification Log Error:', vErr);

    res.json({ 
      success: true, 
      message: status === 'flagged' ? 'Incident Reported' : 'Verification Successful',
      order,
      is_high_value: isHighValue
    });
  } catch (e) { next(e); }
};

// GET /api/admin/verifications
exports.getVerifications = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('security_verifications')
      .select('*, orders(id, method)')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;
    res.json({ success: true, data });
  } catch (e) { next(e); }
};
