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
