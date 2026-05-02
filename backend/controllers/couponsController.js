const { supabase } = require('../config/db');

// GET /api/coupons  — get all active coupons
exports.getActiveCoupons = async (req, res, next) => {
  try {
    const { data: coupons, error } = await supabase.from('coupons').select('*').eq('active', true);
    if (error) throw error;
    res.json({ success: true, count: coupons.length, data: coupons });
  } catch (e) { next(e); }
};

// POST /api/coupons/validate  { code, order_amount }
exports.validateCoupon = async (req, res, next) => {
  try {
    const { code, order_amount } = req.body;
    
    if (!code) return res.status(400).json({ success: false, message: 'Coupon code is required' });
    if (order_amount === undefined) return res.status(400).json({ success: false, message: 'Order amount is required to validate' });

    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('*')
      .ilike('code', code)
      .eq('active', true)
      .single();
    
    if (error || !coupon) return res.status(404).json({ success: false, message: 'Invalid or expired coupon' });
    
    if (order_amount < coupon.min_order) {
      return res.status(400).json({ 
        success: false, 
        message: `Minimum order amount of ₹${coupon.min_order} required for this coupon` 
      });
    }

    // Calculate discount amount based on type
    let discountAmount = 0;
    if (coupon.type === 'percent') {
      discountAmount = Math.round((order_amount * coupon.value) / 100);
    } else if (coupon.type === 'flat') {
      discountAmount = coupon.value;
    }

    discountAmount = Math.min(discountAmount, order_amount);

    res.json({ 
      success: true, 
      message: 'Coupon applied successfully', 
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        discount_applied: discountAmount
      } 
    });
  } catch (e) { next(e); }
};

