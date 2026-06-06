import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(60),
  email: z.email('Please enter a valid email').toLowerCase(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must include at least one uppercase letter')
    .regex(/[a-z]/, 'Must include at least one lowercase letter')
    .regex(/[0-9]/, 'Must include at least one number'),
});

export const loginSchema = z.object({
  email: z.email('Please enter a valid email').toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(60),
  email: z.email('Please enter a valid email').toLowerCase(),
});

export const markCompleteSchema = z.object({
  durationMinutes: z.number().min(1).max(180),
  notes: z.string().max(400).optional(),
});

export const exerciseSchema = z.object({
  name: z.string().min(2).max(100),
  category: z.enum(['upper body', 'lower body']),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  targetMuscles: z.string().min(2),
  equipment: z.string().min(2),
  description: z.string().min(20).max(2000),
  postureStepsText: z.string().min(20),
  tipsText: z.string().optional(),
  mistakesText: z.string().optional(),
  imageUrl: z.union([z.literal(''), z.url()]).optional(),
  durationMinutes: z.number().min(1).max(180),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
export type ProfileFormValues = z.infer<typeof profileSchema>;
export type MarkCompleteFormValues = z.infer<typeof markCompleteSchema>;
export type ExerciseFormValues = z.infer<typeof exerciseSchema>;
