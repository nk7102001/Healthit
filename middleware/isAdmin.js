const ExpressError = require("../utils/ExpressError");

module.exports = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return next(new ExpressError("Access denied: Admin only", 403));
  }
  next();
};
