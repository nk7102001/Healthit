const express = require("express");
const router  =  express.Router();
const axios = require("axios");
const getUserFromToken = require("../utils/getUserFromToken");
const AIPlan = require("../models/AIPlan");

// AI Plan Routes
router.get("/", async (req, res) => {
  const user = await getUserFromToken(req);
  res.render("pages/ai-plan", { plan: null, user });
});

router.post("/", async (req, res) => {
  const { goal, age, gender, activity, diet } = req.body;
  const user = await getUserFromToken(req);

  // ✅ SAME PROMPT (no change)
  const prompt = `Generate a detailed, personalized Indian vegetarian diet and workout plan for a ${age}-year-old ${gender} whose goal is to ${goal} weight. Activity level: ${activity}. Diet preference: ${diet}. Structure the response with clear headings and bullet points.`;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-r1", // same model
        messages: [
          {
            role: "system",
            content: "You are a professional fitness and nutrition expert.",
          },
          { role: "user", content: prompt },
        ],
        max_tokens: 3000,   
        temperature: 0.7
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

    let errorMessage = "❌ Failed to generate plan. Please try again.";

    if (err.response?.status === 402) {
      errorMessage = "⚠️ API credit low or token limit exceeded.";
    }

    res.render("pages/ai-plan", {
      plan: errorMessage,
      user,
    });
  }
});

module.exports = router;