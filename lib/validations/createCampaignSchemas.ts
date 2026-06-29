import { z } from 'zod';
import { CAMPAIGN_GOALS, CONTENT_TYPES } from '@/types/campaign';

// ── Step 1 ────────────────────────────────────────────────────────────────────

export const stepDetailsSchema = z.object({
  coverImage: z.string().optional(),

  title: z.string().min(1, 'Campaign title is required'),

  goal: z.enum(CAMPAIGN_GOALS, {
    error: 'Please select a campaign goal',
  }),

  budget: z
    .string()
    .min(1, 'Budget is required')
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, 'Enter a valid budget'),

  paymentPerCreator: z.string().min(1, 'Payment per creator is required'),

  contentType: z.enum(CONTENT_TYPES, {
    error: 'Please select a content type',
  }),

  duration: z
    .string()
    .min(1, 'Duration is required')
    .refine((v) => {
      const n = Number(v);
      return Number.isInteger(n) && n >= 1 && n <= 90;
    }, 'Duration must be a whole number between 1 and 90'),

  creatorTier: z.string().min(1, 'Please select a creator tier'),

  platforms: z.array(z.string()).min(1, 'Select at least one platform'),
});

// Input type (raw strings from form fields)
export type Step1Input = z.input<typeof stepDetailsSchema>;

// Output type (after Zod transforms — same here, but good practice)
export type Step1Values = z.output<typeof stepDetailsSchema>;
