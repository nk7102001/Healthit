const jwt = require("jsonwebtoken");
const User = require("../models/User");

const getUserFromToken = async (req) => {
  try {
    const token = req.cookies.token;
    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return await User.findById(decoded.userId).select("name email isAdmin");
  } catch {
    return null;
  }
};

module.exports = getUserFromToken;
