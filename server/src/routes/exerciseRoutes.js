const express = require('express');
const {
  getExercises,
  getExerciseById,
  createExercise,
  updateExercise,
  deleteExercise,
} = require('../controllers/exerciseController');
const { protect, restrictTo } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  listExercisesSchema,
  createExerciseSchema,
  updateExerciseSchema,
  exerciseIdSchema,
} = require('../validators/exerciseValidators');

const router = express.Router();

router.get('/', validate(listExercisesSchema), getExercises);
router.get('/:id', validate(exerciseIdSchema), getExerciseById);

router.post('/', protect, restrictTo('admin'), validate(createExerciseSchema), createExercise);
router.patch('/:id', protect, restrictTo('admin'), validate(updateExerciseSchema), updateExercise);
router.delete('/:id', protect, restrictTo('admin'), validate(exerciseIdSchema), deleteExercise);

module.exports = router;
