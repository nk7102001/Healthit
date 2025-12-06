
const express = require("express");
const path = require("path");
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const jwt = require("jsonwebtoken");

const requireAuth = require("./middleware/auth");
const isAdmin = require("./middleware/isAdmin");
const User = require("./models/User");
const Blog = require("./models/Blog");
const ExpressError = require("./utils/ExpressError.js");
const getUserFromToken  = require("./utils/getUserFromToken.js");



// ROUTES
const authRoutes = require("./routes/auth");
const blogs = require("./routes/blogs.js");
const contact = require("./routes/contact.js")
const profile = require("./routes/profile.js")
const bmi = require("./routes/bmi.js")
const aiPlan = require("./routes/ai-plan.js")
const plans = require("./routes/plans.js")
const nearby = require("./routes/nearby.js")
const dashboard = require("./routes/dashboard.js")
const exercises = require("./routes/exercises.js")



// Middleware
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// View Engine
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// Home Page
app.get("/", async (req, res) => {
  const user = await getUserFromToken(req);
  res.render("pages/index", { user });
});


// Features (Public)
app.get("/features", async (req, res) => {
  const user = await getUserFromToken(req);
  res.render("pages/features", { user });
});



app.use("/", authRoutes);
app.use("/blog", blogs);
app.use("/contact", contact);
app.use("/dashboard", dashboard);
app.use("/profile", profile);
app.use("/bmi", bmi);
app.use("/ai-plan", aiPlan)
app.use("/plans", plans)
app.use("/nearby", nearby)
app.use("/exercises", exercises);







// Admin Dashboard
app.get("/admin", requireAuth, isAdmin, async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.render("pages/admin-dashboard", { users, blogs });
});

app.use((req, res, next) => {
  next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  const message = err.message || "Something went wrong";

  res.status(statusCode).render("error", {
    message,
    user: null,
  });
});

// MongoDB Connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
