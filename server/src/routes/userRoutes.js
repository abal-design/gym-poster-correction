const express = require('express');
const { updateProfile } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { updateProfileSchema } = require('../validators/userValidators');

const router = express.Router();

router.patch('/me', protect, validate(updateProfileSchema), updateProfile);

module.exports = router;
