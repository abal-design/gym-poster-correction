const User = require('../models/User');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { signToken } = require('../utils/jwt');
const env = require('../config/env');

const issueAuthResponse = (user, statusCode, res) => {
  const token = signToken({ id: user._id, role: user.role }, env.JWT_SECRET, env.JWT_EXPIRES_IN);
  const safeUser = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    favoriteExercises: user.favoriteExercises || [],
  };

  return res.status(statusCode).json({
    status: 'success',
    token,
    user: safeUser,
  });
};

const register = catchAsync(async (req, res, next) => {
  const existing = await User.findOne({ email: req.body.email });
  if (existing) {
    return next(new AppError('Email is already registered.', 409));
  }

  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: 'user',
  });

  return issueAuthResponse(user, 201, res);
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Incorrect email or password.', 401));
  }

  return issueAuthResponse(user, 200, res);
});

const getMe = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id).populate('favoriteExercises', 'name category difficulty');

  return res.status(200).json({
    status: 'success',
    user,
  });
});

module.exports = { register, login, getMe };
