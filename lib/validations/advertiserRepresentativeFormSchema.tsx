import { z } from 'zod';

export const schema = z.object({
  firstName: z.string().min(1, 'Enter first name'),
  lastName: z.string().min(1, 'Enter last name'),
  email: z.string().email('Enter a valid email address'),
  phone: z
    .string()
    .min(7, 'Enter a valid phone number')
    .regex(/^[\d+\s-]+$/, 'Phone number must contain only digits'),
});

export type Values = z.infer<typeof schema>;
