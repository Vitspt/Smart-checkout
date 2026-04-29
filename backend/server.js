// ============================================================
// SmartCheckout Backend — Entry Point
// ============================================================
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

const authRoutes     = require('./routes/auth');
const productsRoutes = require('./routes/products');
const cartRoutes     = require('./routes/cart');
const ordersRoutes   = require('./routes/orders');
const usersRoutes    = require('./routes/users');
const scansRoutes    = require('./routes/scans');
const couponsRoutes  = require('./routes/coupons');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',');
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error('CORS: origin not allowed'));
  },
  credentials: true
}));

// ── Health Check ──────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', env: process.env.NODE_ENV, ts: new Date().toISOString() });
});

// ── Routes ────────────────────────────────────────────────────
app.use('/api/auth',     authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/cart',     cartRoutes);
app.use('/api/orders',   ordersRoutes);
app.use('/api/users',    usersRoutes);
app.use('/api/scans',    scansRoutes);
app.use('/api/coupons',  couponsRoutes);

// ── 404 ───────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

// ── Global Error Handler ──────────────────────────────────────
app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n🚀  SmartCheckout API running on http://localhost:${PORT}`);
    console.log(`📋  Health: http://localhost:${PORT}/api/health\n`);
  });
}

module.exports = app;
