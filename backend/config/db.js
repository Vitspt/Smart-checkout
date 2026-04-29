// ============================================================
// config/db.js
// ─────────────────────────────────────────────────────────────
// Currently: returns in-memory mock stores.
// When Supabase is ready: replace the exports with the
// @supabase/supabase-js client and remove the mock stores.
//
// Supabase swap (future):
//   const { createClient } = require('@supabase/supabase-js');
//   const supabase = createClient(
//     process.env.SUPABASE_URL,
//     process.env.SUPABASE_SERVICE_KEY
//   );
//   module.exports = supabase;
// ============================================================

const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

// ── In-memory stores (act like Supabase tables) ───────────────
const db = {
  users: [
    {
      id: uuidv4(),
      name: 'Demo User',
      email: 'demo@smart.com',
      phone: '9876543210',
      password_hash: bcrypt.hashSync('demo123', 10),
      joined: '2024-01-15',
      points: 350,
      role: 'user',
      created_at: new Date().toISOString()
    }
  ],
  cart_items: [],   // { id, user_id, product_id, qty, added_at }
  orders: [],       // { id, user_id, items, total, method, status, created_at }
  scan_history: [], // { id, user_id, product_id, product_name, price, emoji, scanned_at }
  coupons: [
    { code: 'SMART10',  type: 'percent', value: 10, min_order: 100, active: true },
    { code: 'FIRST50',  type: 'flat',    value: 50, min_order: 200, active: true },
    { code: 'SAVE20',   type: 'percent', value: 20, min_order: 500, active: true },
  ]
};

module.exports = { db };
