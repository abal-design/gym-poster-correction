const express = require('express');
const {
  toggleFavorite,
  getFavorites,
  markCompleted,
  getMyProgress,
} = require('../controllers/progressController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { markCompletedSchema, favoriteToggleSchema } = require('../validators/progressValidators');

const router = express.Router();

router.use(protect);

router.get('/favorites', getFavorites);
router.post('/favorites/:exerciseId', validate(favoriteToggleSchema), toggleFavorite);

router.get('/me', getMyProgress);
router.post('/complete', validate(markCompletedSchema), markCompleted);

module.exports = router;
