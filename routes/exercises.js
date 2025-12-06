const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// Exercises (Public)
router.get("/", (req, res) => {
  const token = req.cookies.token;
  let user = null;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      user = decoded;
    } catch {}
  }
  res.render("pages/exercises", { user });
});

module.exports = router;
