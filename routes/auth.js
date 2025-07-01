const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Signup POST Route
// routes/auth.js

// Signup POST Route
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.render('pages/signup', {
        user: null,
        message: '❌ Email already in use'
      });
    }

    const newUser = await User.create({
  name,
  email,
  password // let Mongoose hook hash it
});


    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, { httpOnly: true });

    // ✅ Redirect to home after signup
    res.redirect('/');

  } catch (err) {
    console.error('Signup Error:', err.message);
    res.render('pages/signup', {
      user: null,
      message: '❌ Signup failed. Please try again.'
    });
  }
});

// Login POST Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log("❌ User not found");
      return res.status(400).send('User not found');
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).send('Invalid credentials');
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    console.log("🎉 Login successful");
    res.redirect('/');
  } catch (err) {
    console.error("🔥 Server error:", err);
    res.status(500).send('Server error');
  }
});


// Logout GET Route
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});

// ✅ Final export (only once)
module.exports = router;
