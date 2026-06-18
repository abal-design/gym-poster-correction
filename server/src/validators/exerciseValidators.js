const { z } = require('zod');

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid resource id');

const postureStepSchema = z.object({
  stepNumber: z.number().int().positive(),
  instruction: z.string().min(3).max(400),
});

const exerciseBodySchema = z.object({
  name: z.string().min(2).max(100),
  category: z.enum(['upper body', 'lower body']),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
  targetMuscles: z.array(z.string().min(2).max(50)).default([]),
  equipment: z.array(z.string().min(2).max(50)).default([]),
  description: z.string().min(20).max(2000),
  postureSteps: z.array(postureStepSchema).min(1),
  tips: z.array(z.string().min(2).max(300)).default([]),
  commonMistakes: z.array(z.string().min(2).max(300)).default([]),
  imageUrl: z.url().optional().or(z.literal('')),
  durationMinutes: z.number().int().min(1).max(180).default(15),
});

const listExercisesSchema = z.object({
  body: z.object({}).optional().default({}),
  params: z.object({}).optional().default({}),
  query: z.object({
    category: z.enum(['upper body', 'lower body']).optional(),
    search: z.string().max(100).optional(),
  }),
});

const createExerciseSchema = z.object({
  body: exerciseBodySchema,
  params: z.object({}).optional().default({}),
  query: z.object({}).optional().default({}),
});

const updateExerciseSchema = z.object({
  body: exerciseBodySchema.partial(),
  params: z.object({ id: objectIdSchema }),
  query: z.object({}).optional().default({}),
});

const exerciseIdSchema = z.object({
  body: z.object({}).optional().default({}),
  params: z.object({ id: objectIdSchema }),
  query: z.object({}).optional().default({}),
});

module.exports = {
  listExercisesSchema,
  createExerciseSchema,
  updateExerciseSchema,
  exerciseIdSchema,
};
