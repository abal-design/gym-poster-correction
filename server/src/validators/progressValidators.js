const { z } = require('zod');

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid resource id');

const markCompletedSchema = z.object({
  body: z.object({
    exerciseId: objectIdSchema,
    durationMinutes: z.number().int().min(1).max(180).default(15),
    notes: z.string().max(400).optional().default(''),
  }),
  params: z.object({}).optional().default({}),
  query: z.object({}).optional().default({}),
});

const favoriteToggleSchema = z.object({
  body: z.object({}).optional().default({}),
  params: z.object({ exerciseId: objectIdSchema }),
  query: z.object({}).optional().default({}),
});

module.exports = { markCompletedSchema, favoriteToggleSchema };
