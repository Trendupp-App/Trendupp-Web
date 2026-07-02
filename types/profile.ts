import type { OnboardingStepsCompleted } from '@/types/Onboarding';

export interface SocialsConnected {
  instagram: boolean;
  tiktok: boolean;
  youtube: boolean;
  twitter: boolean;
}

export interface UpdatePersonalInfoPayload {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  bio?: string;
  nationalityId?: string;
  countryId?: string;
  stateId?: string;
  avatar?: File;
  websiteUrl?: string;
  monthlyBudget?: string;
  city?: string;
}

export interface UpdatePersonalInfoResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string | null;
  bio: string | null;
  avatarUrl: string | null;
  onboardingPercentage: number;
  onboardingStepsCompleted: OnboardingStepsCompleted;
}

export interface UpdateProfileSocialsPayload {
  instagramUsername?: string | null;
  instagramFollowers?: number;
  tiktokUsername?: string | null;
  tiktokFollowers?: number;
  youtubeUsername?: string | null;
  youtubeFollowers?: number;
  twitterUsername?: string | null;
  twitterFollowers?: number;
}

export interface UpdateProfileSocialsResponse {
  message: string;
  user: {
    socialsConnected: SocialsConnected;
    assignedTier: string | null;
  };
}

export interface NotificationSettings {
  newCampaigns: boolean;
  applicationUpdates: boolean;
  paymentAlerts: boolean;
  brandMessages: boolean;
  pushNotifications: boolean;
  emailNotifications: boolean;
  weeklySummary: boolean;
  marketingOffers: boolean;
}

export type NotificationSettingsResponse = NotificationSettings;

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  biometricLoginEnabled: boolean;
  loginAlertsEnabled: boolean;
}

export type SecuritySettingsResponse = SecuritySettings;

export interface ChangePasswordPayload {
  currentPassword?: string;
  newPassword: string;
}

export interface DeactivateAccountPayload {
  password?: string;
}

export interface SupportTicketCategory {
  id: string;
  name: string;
}

export interface CreateSupportTicketPayload {
  issueCategoryId: string;
  subject: string;
  description: string;
  attachment?: File;
}

export interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  status: string;
  createdAt: string;
}

export interface SupportTicketResponse {
  message: string;
  ticket: SupportTicket;
}

export interface UpdateProfilePayoutPayload {
  bankId: string;
  bankAccountNumber: string;
  bankAccountName: string;
}

export interface UpdateProfilePayoutResponse {
  message: string;
  user: {
    bankName: string | null;
    bankAccountNumber: string | null;
    bankAccountName: string | null;
  };
}
