// controllers/couponsController.js
const { db } = require('../config/db');

// GET /api/coupons  — get all active coupons
exports.getActiveCoupons = (req, res) => {
  const activeCoupons = db.coupons.filter(c => c.active);
  res.json({ success: true, count: activeCoupons.length, data: activeCoupons });
};

// POST /api/coupons/validate  { code, order_amount }
exports.validateCoupon = (req, res) => {
  const { code, order_amount } = req.body;
  
  if (!code) return res.status(400).json({ success: false, message: 'Coupon code is required' });
  if (order_amount === undefined) return res.status(400).json({ success: false, message: 'Order amount is required to validate' });

  const coupon = db.coupons.find(c => c.code.toUpperCase() === code.toUpperCase() && c.active);
  
  if (!coupon) return res.status(404).json({ success: false, message: 'Invalid or expired coupon' });
  
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

  // Cap discount at order amount so total doesn't go negative
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
};
