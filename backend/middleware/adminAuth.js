// middleware/adminAuth.js
const adminAuth = (req, res, next) => {
  // req.user is already populated by the 'auth' middleware
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  const role = req.user.role;
  if (role === 'admin' || role === 'manager' || role === 'security') {
    next();
  } else {
    res.status(403).json({ success: false, message: `Forbidden: Admin or Security access required (Current: ${role})` });
  }
};

module.exports = adminAuth;
