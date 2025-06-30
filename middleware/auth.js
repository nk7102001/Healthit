const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function requireAuth(req, res, next) {
  const token = req.cookies.token;

  if (!token) return res.redirect('/login');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("name email isAdmin");
    if (!user) return res.redirect('/login');

    req.user = user;
    next();
  } catch (err) {
    console.error("Invalid token:", err.message);
    res.redirect('/login');
  }
}

module.exports = requireAuth;
