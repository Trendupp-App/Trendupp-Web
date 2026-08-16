import { z } from 'zod';
import { CAMPAIGN_GOALS } from '@/types/campaign';

// ── Step 1 ────────────────────────────────────────────────────────────────────

export const stepDetailsSchema = z
  .object({
    coverImage: z.string().optional(),

    title: z.string().min(1, 'Campaign title is required'),

    goal: z.enum(CAMPAIGN_GOALS, {
      error: 'Please select a campaign goal',
    }),

    budget: z
      .string()
      .min(1, 'Budget is required')
      .refine((v) => !isNaN(Number(v)) && Number(v) > 0, 'Enter a valid budget'),

    creatorTierIds: z.array(z.string()).min(1, 'Please select at least one creator tier'),
    // creatorTier: z.string().min(1, 'Please select a creator tier'),

    platforms: z.array(z.string()).min(1, 'Select at least one platform'),
    creatorNicheIds: z
      .array(z.string())
      .min(1, 'Please select at least one niche')
      .max(3, 'Select up to 3 niches'),
    // creatorNicheId: z.string().min(1, 'Please select a niche'),
    amplificationAsset: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.goal === 'Amplify Content' && !data.amplificationAsset?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['amplificationAsset'],
        message: 'Please provide a link to the content you want to amplify',
      });
    }
  });

// Input type (raw strings from form fields)
export type Step1Input = z.input<typeof stepDetailsSchema>;

// Output type (after Zod transforms — same here, but good practice)
export type Step1Values = z.output<typeof stepDetailsSchema>;

const listItemSchema = z.object({ value: z.string() });

export const stepCampaignBriefSchema = z.object({
  brief: z.string().min(1, 'Campaign brief is required'),
  deliverables: z.array(listItemSchema).min(1, 'Add at least one deliverable'),
  contentDirection: z.array(listItemSchema).min(1, 'Add at least one content direction point'),
  dos: z.array(listItemSchema).min(1, 'Add at least one do'),
  donts: z.array(listItemSchema).min(1, "Add at least one don't"),
});

export type Step2Values = z.infer<typeof stepCampaignBriefSchema>;
