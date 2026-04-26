const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/auth");   
const AIPlan = require("../models/AIPlan");

router.get("/", requireAuth, async (req, res) => {
  const plans = await AIPlan.find({ userId: req.user._id }).sort({
    createdAt: -1,
  });
  res.render("pages/plan-history", { plans, user: req.user });
});
router.post("/delete/:id", requireAuth, async (req, res) => {
  await AIPlan.deleteOne({ _id: req.params.id, userId: req.user._id });
  res.redirect("/plans");
});

module.exports = router;