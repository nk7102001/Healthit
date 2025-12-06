const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const User = require("../models/User");
const BMIRecord = require("../models/BMIRecord");
const requireAuth = require("../middleware/auth");


// BMI Routes
router.get("/", async (req, res) => {
  const token = req.cookies.token;
  let user = null;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      user = await User.findById(decoded.userId).select("name email isAdmin");
    } catch {}
  }
  res.render("pages/bmi", { user, bmi: null, status: null });
});
router.post("/", async (req, res) => {
  const { height, weight } = req.body;
  const token = req.cookies.token;
  let user = null;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      user = await User.findById(decoded.userId).select("name email isAdmin");
      const bmi = (weight / (height / 100) ** 2).toFixed(2);
      const status =
        bmi < 18.5
          ? "Underweight"
          : bmi < 24.9
          ? "Normal"
          : bmi < 29.9
          ? "Overweight"
          : "Obese";
      await BMIRecord.create({ userId: user._id, height, weight, bmi, status });
      return res.render("pages/bmi", { user, bmi, status });
    } catch {}
  }
  const bmi = (weight / (height / 100) ** 2).toFixed(2);
  const status =
    bmi < 18.5
      ? "Underweight"
      : bmi < 24.9
      ? "Normal"
      : bmi < 29.9
      ? "Overweight"
      : "Obese";
  res.render("pages/bmi", { user: null, bmi, status });
});
router.get("/history", requireAuth, async (req, res) => {
  const records = await BMIRecord.find({ userId: req.user._id }).sort({
    createdAt: -1,
  });
  res.render("pages/bmi-history", { records, user: req.user });
});


module.exports = router;