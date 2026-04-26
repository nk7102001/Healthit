const Joi = require("joi");

module.exports = {
  blogSchema: Joi.object({
    title: Joi.string().min(3).required(),
    slug: Joi.string().min(3).required(),
    summary: Joi.string().min(10).required(),
    content: Joi.string().min(30).required(),
    image: Joi.string().allow("")
  }),

  contactSchema: Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    message: Joi.string().min(5).required(),
  }),

  profileSchema: Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
  }),

  passwordSchema: Joi.object({
    currentPassword: Joi.string().min(4).required(),
    newPassword: Joi.string().min(4).required(),
  }),

  bmiSchema: Joi.object({
    height: Joi.number().min(50).max(300).required(),
    weight: Joi.number().min(10).max(400).required(),
  }),

  aiPlanSchema: Joi.object({
    goal: Joi.string().required(),
    age: Joi.number().min(10).max(100).required(),
    gender: Joi.string().required(),
    activity: Joi.string().required(),
    diet: Joi.string().required(),
  }),

  nearbySchema: Joi.object({
    location: Joi.string().min(2).required(),
    type: Joi.string().valid("hospital", "pharmacy").required(),
  }),
};
