const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Blog = require("../models/Blog");
const getUserFromToken = require("../utils/getUserFromToken");






// =============================
// ✅ Admin Blog Routes (Fix Here)
// =============================
router.get("/add", requireAuth, isAdmin, (req, res) => {
  res.render("pages/blog-add", {
    user: req.user,
    message: null,
  });
});

router.post("/add", requireAuth, isAdmin, async (req, res) => {
  const { title, slug, summary, content, image } = req.body;

  try {
    const newBlog = new Blog({
      title,
      slug: slug.toLowerCase().trim(),
      summary,
      content,
      image,
    });

    await newBlog.save();

    res.render("pages/blog-add", {
      user: req.user,
      message: "✅ Blog added successfully!",
    });
  } catch (err) {
    console.error("❌ Blog create error:", err.message);
    res.render("pages/blog-add", {
      user: req.user,
      message: "❌ Error: Slug must be unique or something went wrong.",
    });
  }
});

// GET edit blog form
router.get("/edit/:id", requireAuth, isAdmin, async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.send("Blog not found.");
  res.render("pages/blog-edit", { blog, message: null, user: req.user });
});

// POST update blog
router.post("/edit/:id", requireAuth, isAdmin, async (req, res) => {
  const { title, slug, image, summary, content } = req.body;
  try {
    await Blog.findByIdAndUpdate(req.params.id, {
      title,
      slug: slug.toLowerCase(),
      image,
      summary,
      content,
    });
    res.redirect("/blog");
  } catch (err) {
    res.render("pages/blog-edit", {
      blog: req.body,
      message: "❌ Error updating blog.",
      user: req.user,
    });
  }
});

// DELETE Blog (Admin only)
router.post("/delete/:id", requireAuth, isAdmin, async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.redirect("/blog");
  } catch (err) {
    console.error("❌ Blog delete error:", err.message);
    res.send("Error deleting blog.");
  }
});

// Public Blog Routes
router.get("/", async (req, res) => {
  const user = await getUserFromToken(req);
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.render("pages/blog-list", { blogs, user });
});
router.get("/:slug", async (req, res) => {
  const user = await getUserFromToken(req);
  const blog = await Blog.findOne({ slug: req.params.slug.toLowerCase() });
  if (!blog) return res.status(404).send("Blog not found");
  res.render("pages/blog-detail", { blog, user });
});


module.exports = router;