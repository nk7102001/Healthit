const express = require("express");
const router  =  express.Router();
const axios = require("axios");
const jwt = require("jsonwebtoken");
const getUserFromToken = require("../utils/getUserFromToken");
const AIPlan = require("../models/AIPlan");

// AI Plan Routes
router.get("/", async (req, res) => {
  const user = await getUserFromToken(req); // For navbar
  res.render("pages/ai-plan", { plan: null, user });
});

router.post("/", async (req, res) => {
  const { goal, age, gender, activity, diet } = req.body;
  const user = await getUserFromToken(req);

  const prompt = `Generate a detailed, personalized Indian vegetarian diet and workout plan for a ${age}-year-old ${gender} whose goal is to ${goal} weight. Activity level: ${activity}. Diet preference: ${diet}. Structure the response with clear headings and bullet points.`;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-r1",
        messages: [
          {
            role: "system",
            content: "You are a professional fitness and nutrition expert.",
          },
          { role: "user", content: prompt },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "http://localhost:3000",
          "Content-Type": "application/json",
        },
      }
    );

    const plan = response.data.choices[0].message.content;

    // 🔒 Save to DB only if user is logged in
    if (user) {
      await AIPlan.create({
        userId: user._id,
        goal,
        age,
        gender,
        activity,
        diet,
        generatedPlan: plan,
      });
    }

    res.render("pages/ai-plan", { plan, user });
  } catch (err) {
    console.error("DeepSeek API error:", err.response?.data || err.message);
    res.render("pages/ai-plan", {
      plan: "❌ Failed to generate plan. Please try again.",
      user,
    });
  }
});

module.exports = router;