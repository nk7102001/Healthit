// MealPlan schema
const mongoose = require('mongoose');

const aiPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  goal: String,
  age: Number,
  gender: String,
  activity: String,
  diet: String,
  generatedPlan: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AIPlan', aiPlanSchema);
