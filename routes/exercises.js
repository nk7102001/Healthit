const express = require("express");
const router = express.Router();
const getUserFromToken = require("../utils/getUserFromToken");

// Exercises (Public)
router.get("/", async (req, res) => {
  const user = await getUserFromToken(req);
  res.render("pages/exercises", { user });
});

module.exports = router;
