import { z } from 'zod';

export const schema = z.object({
  bankName: z.string().min(1, 'Please select a bank'),
  bankId: z.string().min(1, 'Please select your bank'),
  accountNumber: z
    .string()
    .length(10, 'Account number must be exactly 10 digits')
    .regex(/^\d+$/, 'Account number must be digits only'),
  bankAccountName: z.string().min(2, 'Please enter the account holder name'),
});

export type Values = z.infer<typeof schema>;
