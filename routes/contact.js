const express = require("express");
const router = express.Router();
const ContactMessage = require("../models/ContactMessage");
const getUserFromToken = require("../utils/getUserFromToken");

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