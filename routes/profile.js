const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/auth");
const User = require("../models/User");
const bcrypt = require("bcryptjs");





// Profile Routes
router.get("/", requireAuth, (req, res) => {
  res.render("pages/profile", { user: req.user });
});
router.get("/edit", requireAuth, (req, res) => {
  res.render("pages/edit-profile", { user: req.user, message: null });
});
router.post("/edit", requireAuth, async (req, res) => {
  const { name, email } = req.body;
  try {
    await User.findByIdAndUpdate(req.user._id, { name, email });
    res.redirect("/profile");
  } catch (err) {
    res.render("pages/edit-profile", {
      user: req.user,
      message: "❌ Failed to update profile.",
    });
  }
});
router.get("/password", requireAuth, (req, res) => {
  res.render("pages/change-password", { user: req.user, message: null });
});
router.post("/password", requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user._id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.render("pages/change-password", {
        user: req.user,
        message: "❌ Current password is incorrect",
      });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.render("pages/change-password", {
      user: req.user,
      message: "✅ Password changed successfully",
    });
  } catch (err) {
    res.render("pages/change-password", {
      user: req.user,
      message: "❌ Something went wrong.",
    });
  }
});

module.exports = router;

