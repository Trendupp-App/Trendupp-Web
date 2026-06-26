import type { OnboardingStepsCompleted } from '@/types/Onboarding';

type CreatorKey = keyof Pick<OnboardingStepsCompleted, 'profile' | 'socials' | 'payout'> | 'niches';
type AdvertiserKey =
  | keyof Pick<OnboardingStepsCompleted, 'profile' | 'socials' | 'payout'>
  | 'industries'
  | 'representative';

const CREATOR_STEP_TO_KEY: Record<'profile' | 'niche' | 'socials' | 'payout', CreatorKey> = {
  profile: 'profile',
  niche: 'niches',
  socials: 'socials',
  payout: 'payout',
};

const ADVERTISER_STEP_TO_KEY: Record<
  'profile' | 'industry' | 'representative' | 'socials' | 'payout',
  AdvertiserKey
> = {
  profile: 'profile',
  industry: 'industries',
  representative: 'representative',
  socials: 'socials',
  payout: 'payout',
};

export function getResumeStepIndex(
  steps: string[],
  completed: OnboardingStepsCompleted | undefined,
  isAdvertiser: boolean,
): number {
  if (!completed) return 0;

  const map = isAdvertiser ? ADVERTISER_STEP_TO_KEY : CREATOR_STEP_TO_KEY;

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    if (step === 'complete') continue;
    const key = map[step as keyof typeof map];
    // payout can be optional/undefined on AdvertiserOnboardingStepsCompleted — treat falsy as "not done"
    if (!completed[key as keyof OnboardingStepsCompleted]) return i;
  }
  return steps.length - 1; // everything done -> land on 'complete'
}
