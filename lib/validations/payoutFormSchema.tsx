import { z } from 'zod';

export const schema = z.object({
  bankName: z.string().min(1, 'Please select a bank'),
  accountNumber: z
    .string()
    .length(10, 'Account number must be exactly 10 digits')
    .regex(/^\d+$/, 'Account number must be digits only'),
});

export type Values = z.infer<typeof schema>;
