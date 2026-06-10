const mongoose = require('mongoose');

const postureStepSchema = new mongoose.Schema(
  {
    stepNumber: { type: Number, required: true },
    instruction: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const exerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      maxlength: 100,
    },
    category: {
      type: String,
      enum: ['upper body', 'lower body'],
      required: true,
      index: true,
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    targetMuscles: [{ type: String, trim: true }],
    equipment: [{ type: String, trim: true }],
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    postureSteps: {
      type: [postureStepSchema],
      validate: {
        validator: (value) => value.length > 0,
        message: 'At least one posture step is required',
      },
    },
    tips: [{ type: String, trim: true }],
    commonMistakes: [{ type: String, trim: true }],
    imageUrl: { type: String, trim: true },
    durationMinutes: { type: Number, min: 1, max: 180, default: 15 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Exercise', exerciseSchema);
