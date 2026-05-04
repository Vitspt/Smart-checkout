const { supabase } = require('../config/db');

const TAX_RATE = 0.05;
const VALID_METHODS = ['upi', 'card', 'wallet', 'cash'];

// POST /api/orders  — checkout: builds order from current cart
exports.createOrder = async (req, res, next) => {
  try {
    const { payment_method = 'upi', coupon_discount = 0 } = req.body;
    if (!VALID_METHODS.includes(payment_method))
      return res.status(400).json({ success: false, message: `payment_method must be one of: ${VALID_METHODS.join(', ')}` });

    let cartItems = [];
    const { data: dbItems } = await supabase
      .from('cart_items')
      .select('*, products(*)')
      .eq('user_id', req.user.id);
    
    if (dbItems && dbItems.length > 0) {
      cartItems = dbItems.map(i => ({
        product_id: i.product_id,
        name: i.products.name,
        brand: i.products.brand,
        emoji: i.products.emoji,
        price: i.products.price,
        mrp: i.products.mrp,
        qty: i.qty,
        line_total: i.products.price * i.qty
      }));
    } else if (req.body.items && req.body.items.length > 0) {
      // Use items from request body if DB cart is empty
      cartItems = req.body.items.map(i => ({
        product_id: i.id || i.product_id,
        name: i.name,
        brand: i.brand || '',
        emoji: i.emoji || '🛒',
        price: i.price,
        mrp: i.mrp || i.price,
        qty: i.qty,
        line_total: i.price * i.qty
      }));
    }

    if (!cartItems.length)
      return res.status(400).json({ success: false, message: 'Cart is empty' });

    const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
    const tax      = Math.round(subtotal * TAX_RATE);
    const total    = subtotal + tax - Number(coupon_discount);

    // Handle Wallet Deduction (Cloud Sync)
    if (payment_method === 'wallet') {
      if (Number(req.user.wallet_balance) < total) {
        return res.status(400).json({ success: false, message: `Insufficient balance (Required: ₹${total}, Current: ₹${req.user.wallet_balance})` });
      }
      const newBalance = Number(req.user.wallet_balance) - total;
      await supabase.from('users').update({ wallet_balance: newBalance }).eq('id', req.user.id);
    }

    const orderData = {
      user_id: req.user.id,
      items: cartItems,
      total,
      method: payment_method,
      status: 'paid'
    };

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single();

    if (orderError) throw orderError;

    // Clear cart
    await supabase.from('cart_items').delete().eq('user_id', req.user.id);

    // Award points (1 point per ₹10 spent)
    const pointsToAdd = Math.floor(total / 10);
    const { data: userData } = await supabase.from('users').select('points').eq('id', req.user.id).single();
    if (userData) {
      await supabase.from('users').update({ points: userData.points + pointsToAdd }).eq('id', req.user.id);
    }

    res.status(201).json({ success: true, message: 'Order placed successfully', order });
  } catch (e) { next(e); }
};

// GET /api/orders  — get logged-in user's orders
exports.getMyOrders = async (req, res, next) => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json({ success: true, count: orders.length, data: orders });
  } catch (e) { next(e); }
};

// GET /api/orders/:id
exports.getOrderById = async (req, res, next) => {
  try {
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();
    
    if (error || !order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: order });
  } catch (e) { next(e); }
};

// PATCH /api/orders/:id/cancel
exports.cancelOrder = async (req, res, next) => {
  try {
    const { data: order, error } = await supabase
      .from('orders')
      .update({ status: 'cancelled' })
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .eq('status', 'paid')
      .select()
      .single();
    
    if (error || !order) return res.status(400).json({ success: false, message: 'Could not cancel order' });
    res.json({ success: true, message: 'Order cancelled', order });
  } catch (e) { next(e); }
};

// POST /api/orders/:id/verify  — Staff action: verify QR at exit
exports.verifyOrder = async (req, res, next) => {
  try {
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !order) return res.status(404).json({ success: false, message: 'Order not found' });
    
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
    const now = new Date().toISOString();
    const { data: updated, error: updateError } = await supabase
      .from('orders')
      .update({ status: 'exited', exited_at: now })
      .eq('id', req.params.id)
      .select()
      .single();
    
    if (updateError) throw updateError;
    
    res.json({ 
      success: true, 
      message: 'Verification successful. Customer may exit.',
      order_id: updated.id,
      purchased_at: updated.created_at,
      exited_at: updated.exited_at
    });
  } catch (e) { next(e); }
};

