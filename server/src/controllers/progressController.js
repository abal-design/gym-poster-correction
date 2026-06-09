const Progress = require('../models/Progress');
const User = require('../models/User');
const Exercise = require('../models/Exercise');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const toggleFavorite = catchAsync(async (req, res, next) => {
  const { exerciseId } = req.params;
  const exercise = await Exercise.findById(exerciseId);

  if (!exercise) {
    return next(new AppError('Exercise not found.', 404));
  }

  const user = await User.findById(req.user._id);
  const exists = user.favoriteExercises.some((id) => id.toString() === exerciseId);

  user.favoriteExercises = exists
    ? user.favoriteExercises.filter((id) => id.toString() !== exerciseId)
    : [...user.favoriteExercises, exerciseId];

  await user.save();

  return res.status(200).json({
    status: 'success',
    favoriteExercises: user.favoriteExercises,
    action: exists ? 'removed' : 'added',
  });
});

const getFavorites = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id).populate('favoriteExercises');

  return res.status(200).json({
    status: 'success',
    favorites: user.favoriteExercises,
  });
});

const markCompleted = catchAsync(async (req, res, next) => {
  const { exerciseId, durationMinutes, notes } = req.body;

  const exercise = await Exercise.findById(exerciseId);
  if (!exercise) {
    return next(new AppError('Exercise not found.', 404));
  }

  const progress = await Progress.create({
    user: req.user._id,
    exercise: exerciseId,
    durationMinutes,
    notes,
  });

  return res.status(201).json({
    status: 'success',
    progress,
  });
});

const getMyProgress = catchAsync(async (req, res) => {
  const progressEntries = await Progress.find({ user: req.user._id })
    .populate('exercise', 'name category difficulty')
    .sort({ completedAt: -1 });

  const totalCompleted = progressEntries.length;
  const totalMinutes = progressEntries.reduce((sum, item) => sum + item.durationMinutes, 0);

  const categorySummary = progressEntries.reduce(
    (acc, item) => {
      const key = item.exercise?.category || 'unknown';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    },
    { 'upper body': 0, 'lower body': 0 }
  );

  return res.status(200).json({
    status: 'success',
    summary: {
      totalCompleted,
      totalMinutes,
      categorySummary,
    },
    progressEntries,
  });
});

module.exports = {
  toggleFavorite,
  getFavorites,
  markCompleted,
  getMyProgress,
};
