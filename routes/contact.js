const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ContactMessage = require("../models/ContactMessage");



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

// Contact
router.get("/", async (req, res) => {
  const user = await getUserFromToken(req);
  res.render("pages/contact", { user, message: null });
});
router.post("/", async (req, res) => {
  const user = await getUserFromToken(req);
  const { name, email, message } = req.body;
  try {
    await ContactMessage.create({ name, email, message });
    res.render("pages/contact", {
      user,
      message: "✅ Thanks for contacting us!",
    });
  } catch (err) {
    res.render("pages/contact", { user, message: "❌ Something went wrong." });
  }
});

module.exports = router;