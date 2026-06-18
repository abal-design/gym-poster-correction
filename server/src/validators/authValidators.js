const { z } = require('zod');

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(60),
    email: z.email('Invalid email address').toLowerCase(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
  }),
  params: z.object({}).optional().default({}),
  query: z.object({}).optional().default({}),
});

const loginSchema = z.object({
  body: z.object({
    email: z.email('Invalid email address').toLowerCase(),
    password: z.string().min(1, 'Password is required'),
  }),
  params: z.object({}).optional().default({}),
  query: z.object({}).optional().default({}),
});

module.exports = { registerSchema, loginSchema };
