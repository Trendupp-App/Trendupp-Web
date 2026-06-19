import { z } from 'zod';

export const schema = z.object({
  nationality: z.string().min(1, 'Select your nationality'),
  country: z.string().min(1, 'Select your country'),
  state: z.string().min(1, 'Select your state'),
  bio: z.string().optional(),
  photo: z.string().optional(),
});

export type Values = z.infer<typeof schema>;
