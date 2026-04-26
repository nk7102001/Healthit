const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ExpressError = require("../utils/ExpressError");

async function requireAuth(req, res, next) {
  const token = req.cookies.token;

  // No token
  if (!token) {
    return next(new ExpressError("Please login to continue", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await User.findById(decoded.userId).select("name email isAdmin");

    if (!user) {
      return next(new ExpressError("User not found", 401));
    }

    // Attach user to request
    req.user = user;
    next();

  } catch (err) {
    return next(new ExpressError("Invalid or expired token. Please login again.", 401));
  }
}

module.exports = requireAuth;
