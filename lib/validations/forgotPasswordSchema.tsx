import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  email: z.email('Enter a valid email address').min(1, 'Enter your email address'),
});

export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
