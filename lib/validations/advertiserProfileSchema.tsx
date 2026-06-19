import { z } from 'zod';

export const schema = z.object({
  brandName: z.string().min(1, 'Enter your brand name'),
  bio: z.string().optional(),
  country: z.string().min(1, 'Select your country'),
  state: z.string().optional(),
  city: z.string().optional(),
  website: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  monthlyBudget: z.string().min(1, 'Enter your monthly budget'),
  logo: z.string().optional(),
});

export type Values = z.infer<typeof schema>;
