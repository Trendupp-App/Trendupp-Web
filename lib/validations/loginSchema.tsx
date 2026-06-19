import { z } from 'zod';

export const signinSchema = z.object({
  email: z.string().min(1, 'Enter your email address').email('Enter a valid email address'),
  password: z.string().min(1, 'Enter your password'),
});

export type SigninValues = z.infer<typeof signinSchema>;
