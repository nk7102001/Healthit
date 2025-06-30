// Entry point for Express server
const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config();
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const axios = require("axios");
const jwt = require('jsonwebtoken');

const authRoutes = require('./routes/auth');
const requireAuth = require('./middleware/auth');
const isAdmin = require('./middleware/isAdmin');

const AIPlan = require('./models/AIPlan');
const BMIRecord = require('./models/BMIRecord');
const User = require('./models/User');
const Blog = require('./models/Blog');
const ContactMessage = require('./models/ContactMessage');
const bcrypt = require('bcryptjs');

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use('/', authRoutes);

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Utility to extract user from token (optional pages)
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

// Home Page
app.get('/', async (req, res) => {
  const user = await getUserFromToken(req);
  res.render('pages/index', { user });
});

// Signup/Login
app.get('/login', (req, res) => {
  const token = req.cookies.token;
  let user = null;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      user = decoded;
    } catch (err) {
      console.log("Invalid token in login page");
    }
  }

  res.render('pages/login', { user });
});

app.get('/signup', (req, res) => {
  const token = req.cookies.token;
  let user = null;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      user = decoded;
    } catch (err) {
      console.log("Invalid token in signup page");
    }
  }

  res.render('pages/signup', { user });
});



// Features (Public)
app.get('/features', async (req, res) => {
  const user = await getUserFromToken(req);
  res.render('pages/features', { user });
});

// Contact
app.get('/contact', async (req, res) => {
  const user = await getUserFromToken(req);
  res.render('pages/contact', { user, message: null });
});
app.post('/contact', async (req, res) => {
  const user = await getUserFromToken(req);
  const { name, email, message } = req.body;
  try {
    await ContactMessage.create({ name, email, message });
    res.render('pages/contact', { user, message: "✅ Thanks for contacting us!" });
  } catch (err) {
    res.render('pages/contact', { user, message: "❌ Something went wrong." });
  }
});

// =============================
// ✅ Admin Blog Routes (Fix Here)
// =============================
app.get('/blog/add', requireAuth, isAdmin, (req, res) => {
  res.render('pages/blog-add', {
    user: req.user,
    message: null
  });
});

app.post('/blog/add', requireAuth, isAdmin, async (req, res) => {
  const { title, slug, summary, content, image } = req.body;

  try {
    const newBlog = new Blog({
      title,
      slug: slug.toLowerCase().trim(),
      summary,
      content,
      image
    });

    await newBlog.save();

    res.render('pages/blog-add', {
      user: req.user,
      message: '✅ Blog added successfully!'
    });

  } catch (err) {
    console.error("❌ Blog create error:", err.message);
    res.render('pages/blog-add', {
      user: req.user,
      message: '❌ Error: Slug must be unique or something went wrong.'
    });
  }
});

// GET edit blog form
app.get('/blog/edit/:id', requireAuth, isAdmin, async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.send("Blog not found.");
  res.render('pages/blog-edit', { blog, message: null, user: req.user });
});

// POST update blog
app.post('/blog/edit/:id', requireAuth, isAdmin, async (req, res) => {
  const { title, slug, image, summary, content } = req.body;
  try {
    await Blog.findByIdAndUpdate(req.params.id, {
      title, slug: slug.toLowerCase(), image, summary, content
    });
    res.redirect('/blog');
  } catch (err) {
    res.render('pages/blog-edit', { blog: req.body, message: '❌ Error updating blog.', user: req.user });
  }
});

// DELETE Blog (Admin only)
app.post('/blog/delete/:id', requireAuth, isAdmin, async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.redirect('/blog');
  } catch (err) {
    console.error("❌ Blog delete error:", err.message);
    res.send("Error deleting blog.");
  }
});

// Public Blog Routes
app.get("/blog", async (req, res) => {
  const user = await getUserFromToken(req);
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.render("pages/blog-list", { blogs, user });
});
app.get("/blog/:slug", async (req, res) => {
  const user = await getUserFromToken(req);
  const blog = await Blog.findOne({ slug: req.params.slug.toLowerCase() });
  if (!blog) return res.status(404).send("Blog not found");
  res.render("pages/blog-detail", { blog, user });
});

// Dashboard
app.get('/dashboard', requireAuth, (req, res) => {
  res.render('pages/dashboard', { user: req.user });
});

// Profile Routes
app.get('/profile', requireAuth, (req, res) => {
  res.render('pages/profile', { user: req.user });
});
app.get('/profile/edit', requireAuth, (req, res) => {
  res.render('pages/edit-profile', { user: req.user, message: null });
});
app.post('/profile/edit', requireAuth, async (req, res) => {
  const { name, email } = req.body;
  try {
    await User.findByIdAndUpdate(req.user._id, { name, email });
    res.redirect('/profile');
  } catch (err) {
    res.render('pages/edit-profile', { user: req.user, message: "❌ Failed to update profile." });
  }
});
app.get('/profile/password', requireAuth, (req, res) => {
  res.render('pages/change-password', { user: req.user, message: null });
});
app.post('/profile/password', requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user._id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.render('pages/change-password', { user: req.user, message: '❌ Current password is incorrect' });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.render('pages/change-password', { user: req.user, message: '✅ Password changed successfully' });
  } catch (err) {
    res.render('pages/change-password', { user: req.user, message: '❌ Something went wrong.' });
  }
});

// BMI Routes
app.get('/bmi', async (req, res) => {
  const token = req.cookies.token;
  let user = null;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      user = await User.findById(decoded.userId).select('name email isAdmin');
    } catch {}
  }
  res.render('pages/bmi', { user, bmi: null, status: null });
});
app.post('/bmi', async (req, res) => {
  const { height, weight } = req.body;
  const token = req.cookies.token;
  let user = null;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      user = await User.findById(decoded.userId).select("name email isAdmin");
      const bmi = (weight / ((height / 100) ** 2)).toFixed(2);
      const status = bmi < 18.5 ? 'Underweight' : bmi < 24.9 ? 'Normal' : bmi < 29.9 ? 'Overweight' : 'Obese';
      await BMIRecord.create({ userId: user._id, height, weight, bmi, status });
      return res.render('pages/bmi', { user, bmi, status });
    } catch {}
  }
  const bmi = (weight / ((height / 100) ** 2)).toFixed(2);
  const status = bmi < 18.5 ? 'Underweight' : bmi < 24.9 ? 'Normal' : bmi < 29.9 ? 'Overweight' : 'Obese';
  res.render('pages/bmi', { user: null, bmi, status });
});
app.get('/bmi-history', requireAuth, async (req, res) => {
  const records = await BMIRecord.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.render('pages/bmi-history', { records, user: req.user });
});

// AI Plan Routes
// AI Plan Routes
app.get('/ai-plan', requireAuth, (req, res) => {
  res.render('pages/ai-plan', { plan: null, user: req.user });
});

// POST AI Plan using DeepSeek via OpenRouter
app.post("/ai-plan", requireAuth, async (req, res) => {
  const { goal, age, gender, activity, diet } = req.body;

  const prompt = `Generate a detailed, personalized Indian vegetarian diet and workout plan for a ${age}-year-old ${gender} whose goal is to ${goal} weight. Activity level: ${activity}. Diet preference: ${diet}. Structure the response with clear headings and bullet points.`;

  try {
    const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
      model: "deepseek/deepseek-r1-0528-qwen3-8b:free",  // ✅ make sure this is enabled in OpenRouter settings
      messages: [
        { role: "system", content: "You are a professional fitness and nutrition expert." },
        { role: "user", content: prompt }
      ]
    }, {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "http://localhost:3000",  // ✅ must match OpenRouter allowed referer
        "X-Title": "Healthit AI Plan",
        "Content-Type": "application/json"
      }
    });

    const plan = response.data?.choices?.[0]?.message?.content;

    await AIPlan.create({
      userId: req.user._id,
      goal,
      age,
      gender,
      activity,
      diet,
      generatedPlan: plan
    });

    res.render("pages/ai-plan", { plan, user: req.user });
  } catch (err) {
    console.error("DeepSeek API error:", err.response?.data || err.message);
    res.render("pages/ai-plan", {
      plan: "❌ Failed to generate plan. Please try again.",
      user: req.user
    });
  }
});




app.get('/plans', requireAuth, async (req, res) => {
  const plans = await AIPlan.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.render('pages/plan-history', { plans, user: req.user });
});
app.post('/plans/delete/:id', requireAuth, async (req, res) => {
  await AIPlan.deleteOne({ _id: req.params.id, userId: req.user._id });
  res.redirect('/plans');
});

// Nearby
app.get("/nearby", async (req, res) => {
  const user = await getUserFromToken(req);
  res.render("pages/nearby", { hospitals: null, user });
});
app.post("/nearby", async (req, res) => {
  const user = await getUserFromToken(req);
  const { location, type = "hospital" } = req.body;
  const category = type === "pharmacy" ? "healthcare.pharmacy" : "healthcare.hospital";
  const geoKey = process.env.GEOAPIFY_API_KEY;
  try {
    const geoRes = await axios.get("https://api.geoapify.com/v1/geocode/search", {
      params: { text: location, apiKey: geoKey }
    });
    const loc = geoRes.data.features[0];
    if (!loc) return res.render("pages/nearby", { hospitals: [], user });
    const [lon, lat] = loc.geometry.coordinates;
    const placesRes = await axios.get("https://api.geoapify.com/v2/places", {
      params: {
        categories: category,
        filter: `circle:${lon},${lat},5000`,
        bias: `proximity:${lon},${lat}`,
        limit: 15,
        apiKey: geoKey
      }
    });
    const hospitals = placesRes.data.features.map(h => ({
      name: h.properties.name || "Unnamed",
      address: h.properties.address_line1 || "No address"
    }));
    res.render("pages/nearby", { hospitals, user });
  } catch {
    res.render("pages/nearby", { hospitals: [], user });
  }
});

// Exercises (Public)
app.get('/exercises', (req, res) => {
  const token = req.cookies.token;
  let user = null;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      user = decoded;
    } catch {}
  }
  res.render('pages/exercises', { user });
});

// Admin Dashboard
app.get('/admin', requireAuth, isAdmin, async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.render('pages/admin-dashboard', { users, blogs });
});

// MongoDB Connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
