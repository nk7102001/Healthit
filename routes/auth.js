const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ==========================
// SHOW SIGNUP PAGE
// ==========================
router.get("/signup", (req, res) => {
  const token = req.cookies.token;
  let user = null;

  if (token) {
    try {
      user = jwt.verify(token, process.env.JWT_SECRET);
    } catch {}
  }

  res.render("pages/signup", { user, message: null });
});

// ==========================
// SHOW LOGIN PAGE
// ==========================
router.get("/login", (req, res) => {
  const token = req.cookies.token;
  let user = null;

  if (token) {
    try {
      user = jwt.verify(token, process.env.JWT_SECRET);
    } catch {}
  }

  res.render("pages/login", { user, message: null });
});

// ==========================
// SIGNUP (POST)
// ==========================
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.render("pages/signup", {
        user: null,
        message: "❌ Email already in use",
      });
    }

    const newUser = await User.create({
      name,
      email,
      password,
    });

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, { httpOnly: true });
    res.redirect("/");

  } catch (err) {
    res.render("pages/signup", {
      user: null,
      message: "❌ Signup failed. Try again.",
    });
  }
});

// ==========================
// LOGIN (POST)
// ==========================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    return res.render("pages/login", {
      user: null,
      message: "❌ Email not found",
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.render("pages/login", {
      user: null,
      message: "❌ Incorrect password",
    });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.redirect("/");
});

// ==========================
// LOGOUT
// ==========================
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

module.exports = router;
