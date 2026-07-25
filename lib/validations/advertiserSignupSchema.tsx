import { z } from 'zod';

export const advertiserSignupSchema = z
  .object({
    brandName: z.string().min(1, 'Brand name is required'),
    email: z.email('Enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      ),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the Terms & Conditions',
    }),
    acceptedPromotions: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type AdvertiserSignupValues = z.infer<typeof advertiserSignupSchema>;
