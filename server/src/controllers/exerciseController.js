const Exercise = require('../models/Exercise');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const getExercises = catchAsync(async (req, res) => {
  const { category, search } = req.query;
  const filter = {};

  if (category) filter.category = category;
  if (search) filter.name = { $regex: search, $options: 'i' };

  const exercises = await Exercise.find(filter).sort({ createdAt: -1 });

  return res.status(200).json({
    status: 'success',
    results: exercises.length,
    exercises,
  });
});

const getExerciseById = catchAsync(async (req, res, next) => {
  const exercise = await Exercise.findById(req.params.id);

  if (!exercise) {
    return next(new AppError('Exercise not found.', 404));
  }

  return res.status(200).json({
    status: 'success',
    exercise,
  });
});

const createExercise = catchAsync(async (req, res) => {
  const exercise = await Exercise.create(req.body);

  return res.status(201).json({
    status: 'success',
    exercise,
  });
});

const updateExercise = catchAsync(async (req, res, next) => {
  const exercise = await Exercise.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!exercise) {
    return next(new AppError('Exercise not found.', 404));
  }

  return res.status(200).json({
    status: 'success',
    exercise,
  });
});

const deleteExercise = catchAsync(async (req, res, next) => {
  const exercise = await Exercise.findByIdAndDelete(req.params.id);

  if (!exercise) {
    return next(new AppError('Exercise not found.', 404));
  }

  return res.status(204).json({
    status: 'success',
    data: null,
  });
});

module.exports = {
  getExercises,
  getExerciseById,
  createExercise,
  updateExercise,
  deleteExercise,
};
