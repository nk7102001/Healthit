const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/auth");

router.get("/", requireAuth, (req, res) => {
  res.render("pages/dashboard", { user: req.user });
});

module.exports = router;