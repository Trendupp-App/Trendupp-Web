import { AuthUser } from '@/store/authStore';
import { RawUserProfile } from '@/types/profile';

export function mapUserProfileToAuthUser(raw: RawUserProfile): Partial<AuthUser> {
  return {
    id: raw.id,
    email: raw.email,
    firstName: raw.firstName,
    lastName: raw.lastName,
    role: raw.role,
    isEmailVerified: raw.isEmailVerified,
    onboardingPercentage: raw.onboardingPercentage,
    onboardingStepsCompleted: raw.onboardingStepsCompleted,
    socialsConnected: raw.socialsConnected,
    username: raw.username,
    niches: raw.niches,
    industries: raw.industries?.map((i) => ({ id: i.id, name: i.name })),
    assignedTier: raw.assignedTier,
    bio: raw.bio,
    avatarUrl: raw.avatarUrl,
    bankName: raw.bankName,
    bankAccountNumber: raw.bankAccountNumber,
    bankAccountName: raw.bankAccountName,
    brandRepresentative: raw.brandRepresentative,
    country: raw.country,
    state: raw.state,
    city: raw.city,
    instagramUsername: raw.instagramUsername,
    instagramFollowers: raw.instagramFollowers,
    tiktokUsername: raw.tiktokUsername,
    tiktokFollowers: raw.tiktokFollowers,
    youtubeUsername: raw.youtubeUsername,
    youtubeFollowers: raw.youtubeFollowers,
    twitterUsername: raw.twitterUsername,
    twitterFollowers: raw.twitterFollowers,
    facebookUsername: raw.facebookUsername,
    facebookFollowers: raw.facebookFollowers,
  };
}
