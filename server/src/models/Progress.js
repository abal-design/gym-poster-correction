const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    exercise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exercise',
      required: true,
      index: true,
    },
    completedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 400,
      default: '',
    },
    durationMinutes: {
      type: Number,
      min: 1,
      max: 180,
      default: 15,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Progress', progressSchema);
