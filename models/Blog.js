const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: {
  type: String,
  required: true,
  unique: true,
  lowercase: true,   
  trim: true        
},
  summary: String,
  content: String,
  image: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Blog", blogSchema);
