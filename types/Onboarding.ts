export type CreatorOnboardingData = {
  // Step 1 - Profile
  photo?: string;
  nationality?: string;
  country?: string;
  state?: string;
  bio?: string;

  // Step 2 - Niche
  niches?: string[];

  // Step 3 - Socials
  connected?: {
    platformId: string;
    username: string;
    followers: string;
  }[];

  // Step 4 - Payout
  bankName?: string;
  accountNumber?: string;
};

export interface AdvertiserOnboardingData {
  // StepProfile
  logo?: string;
  brandName?: string;
  bio?: string;
  country?: string;
  state?: string;
  city?: string;
  website?: string;
  monthlyBudget?: string;
  industries?: string[];

  // StepRepresentative
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;

  // StepSocialsConnect (shared with creator)
  connected?: {
    platformId: string;
    username: string;
    followers: string;
  }[];

  // StepPayout (shared with creator)
  bankName?: string;
  accountNumber?: string;
}
