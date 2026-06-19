import { z } from 'zod';

export const advertiserSignupSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Enter a valid email address'),
    phoneNumber: z
      .string()
      .min(1, 'Phone number is required')
      .regex(/^\+?[1-9]\d{9,14}$/, 'Enter a valid phone number'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the Terms & Conditions',
    }),
    promo: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type AdvertiserSignupValues = z.infer<typeof advertiserSignupSchema>;
