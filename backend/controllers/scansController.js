const { supabase } = require('../config/db');

// POST /api/scans  { barcode }  — scan a product by barcode
exports.scan = async (req, res, next) => {
  try {
    const { barcode } = req.body;
    if (!barcode) return res.status(400).json({ success: false, message: 'barcode is required' });

    // Fetch product
    const { data: product, error: pError } = await supabase
      .from('products')
      .select('*')
      .or(`id.eq.${barcode},barcode.eq.${barcode}`)
      .single();

    if (pError || !product) return res.status(404).json({ success: false, message: `No product found for barcode: ${barcode}` });

    // Log the scan to Supabase activity_log
    const logData = {
      user_email: req.user.email,
      type: 'SCAN',
      msg: `Scanned ${product.name} (₹${product.price})`
      // created_at is automatic in Supabase
    };
    await supabase.from('activity_log').insert([logData]);

    res.status(201).json({ success: true, product });
  } catch (e) { next(e); }
};

// GET /api/scans  — get logged-in user's scan history from logs
exports.getHistory = async (req, res, next) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 100);
    const { data: history, error } = await supabase
      .from('activity_log')
      .select('*')
      .eq('user_email', req.user.email)
      .eq('type', 'SCAN')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    res.json({ success: true, count: history.length, data: history });
  } catch (e) { next(e); }
};

// DELETE /api/scans  — clear scan history
exports.clearHistory = async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('activity_log')
      .delete()
      .eq('user_email', req.user.email)
      .eq('type', 'SCAN');
    
    if (error) throw error;
    res.json({ success: true, message: 'Scan history cleared' });
  } catch (e) { next(e); }
};

