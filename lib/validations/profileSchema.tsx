import { z } from 'zod';

export const schema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores allowed'),
  nationality: z.string().min(1, 'Select your nationality'),
  country: z.string().min(1, 'Select your country'),
  state: z.string().min(1, 'Select your state'),
  bio: z.string().optional(),
  photo: z.string().optional(),
});

export type Values = z.infer<typeof schema>;
