const { supabase } = require('../config/db');

const TAX_RATE = 0.05;

const calcTotal = (items) => {
  const subtotal = items.reduce((s, i) => s + i.products.price * i.qty, 0);
  const mrp      = items.reduce((s, i) => s + i.products.mrp   * i.qty, 0);
  const tax      = Math.round(subtotal * TAX_RATE);
  return { subtotal, mrp, discount: mrp - subtotal, tax, total: subtotal + tax };
};

// GET /api/cart
exports.getCart = async (req, res, next) => {
  try {
    const { data: items, error } = await supabase
      .from('cart_items')
      .select('*, products(*)')
      .eq('user_id', req.user.id);
    
    if (error) throw error;

    res.json({ success: true, count: items.length, items, totals: calcTotal(items) });
  } catch (e) { next(e); }
};

// POST /api/cart  { product_id, qty }
exports.addItem = async (req, res, next) => {
  try {
    const { product_id, qty = 1 } = req.body;
    if (!product_id) return res.status(400).json({ success: false, message: 'product_id required' });

    // Check if product exists
    const { data: product } = await supabase.from('products').select('name').eq('id', product_id).single();
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    // Check if item already in cart
    const { data: existing } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('product_id', product_id)
      .single();

    if (existing) {
      const { data, error } = await supabase
        .from('cart_items')
        .update({ qty: existing.qty + Number(qty) })
        .eq('id', existing.id)
        .select()
        .single();
      if (error) throw error;
      res.json({ success: true, message: `${product.name} updated in cart`, item: data });
    } else {
      const { data, error } = await supabase
        .from('cart_items')
        .insert([{ user_id: req.user.id, product_id, qty: Number(qty) }])
        .select()
        .single();
      if (error) throw error;
      res.status(201).json({ success: true, message: `${product.name} added to cart`, item: data });
    }
  } catch (e) { next(e); }
};

// PATCH /api/cart/:product_id  { qty }
exports.updateItem = async (req, res, next) => {
  try {
    const { product_id } = req.params;
    const qty = Number(req.body.qty);

    if (qty <= 0) {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', req.user.id)
        .eq('product_id', product_id);
      if (error) throw error;
      return res.json({ success: true, message: 'Item removed' });
    }

    const { data, error } = await supabase
      .from('cart_items')
      .update({ qty })
      .eq('user_id', req.user.id)
      .eq('product_id', product_id)
      .select()
      .single();
    
    if (error) return res.status(404).json({ success: false, message: 'Item not in cart' });
    res.json({ success: true, message: 'Quantity updated', item: data });
  } catch (e) { next(e); }
};

// DELETE /api/cart/:product_id
exports.removeItem = async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', req.user.id)
      .eq('product_id', req.params.product_id);
    
    if (error) throw error;
    res.json({ success: true, message: 'Item removed' });
  } catch (e) { next(e); }
};

// DELETE /api/cart
exports.clearCart = async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', req.user.id);
    
    if (error) throw error;
    res.json({ success: true, message: 'Cart cleared' });
  } catch (e) { next(e); }
};

// GET /api/cart/summary
exports.getSummary = async (req, res, next) => {
  try {
    const { data: items, error } = await supabase
      .from('cart_items')
      .select('qty, products(price, mrp)')
      .eq('user_id', req.user.id);
    
    if (error) throw error;
    res.json({ success: true, item_count: items.reduce((s, i) => s + i.qty, 0), totals: calcTotal(items) });
  } catch (e) { next(e); }
};

