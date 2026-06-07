const User = require('../models/User');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const updateProfile = catchAsync(async (req, res, next) => {
  const { name, email } = req.body;

  const existingEmailOwner = await User.findOne({
    email,
    _id: { $ne: req.user._id },
  });

  if (existingEmailOwner) {
    return next(new AppError('Email is already in use by another account.', 409));
  }

  const updated = await User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
    }
  ).populate('favoriteExercises', 'name category difficulty');

  return res.status(200).json({
    status: 'success',
    user: updated,
  });
});

module.exports = { updateProfile };
