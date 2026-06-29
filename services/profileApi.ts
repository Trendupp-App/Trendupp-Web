import apiClient from '@/lib/apiClient';

export interface UpdatePersonalInfoResponse {
  message: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    username: string;
    bio: string | null;
    avatarUrl: string | null;
    nationalityId: string | null;
    countryId: string | null;
    stateId: string | null;
    onboardingPercentage: number;
    isEmailVerified: boolean;
  };
}

export interface UpdateProfileNichesPayload {
  nicheIds: string[];
}

export interface UpdateProfileNichesResponse {
  message: string;
  user: {
    id: string;
    niches: Array<{ id: string; name: string; order: number }>;
    onboardingPercentage: number;
  };
}

export const profileApi = {
  updatePersonalInfo: (payload: FormData) =>
    apiClient.patch<UpdatePersonalInfoResponse>('/api/v1/profile/personal-info', payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  updateNiches: (payload: UpdateProfileNichesPayload) =>
    apiClient.put<UpdateProfileNichesResponse>('/api/v1/profile/niches', payload),

  updateSocials: (payload: UpdateProfileSocialsPayload) =>
    apiClient.patch<UpdateProfileSocialsResponse>('/api/v1/profile/socials', payload),

  updatePayout: (payload: UpdateProfilePayoutPayload) =>
    apiClient.patch<UpdateProfilePayoutResponse>('/api/v1/profile/payout', payload),

  getNotificationSettings: () =>
    apiClient.get<GetNotificationSettingsResponse>('/api/v1/profile/notifications'),

  updateNotificationSettings: (payload: Partial<NotificationSettings>) =>
    apiClient.patch('/api/v1/profile/notifications', payload),
};

export interface NotificationSettings {
  newCampaigns: boolean;
  appUpdates: boolean;
  paymentAlerts: boolean;
  brandMessages: boolean;
  push: boolean;
  email: boolean;
  weeklySummary: boolean;
  marketingOffers: boolean;
}

export interface GetNotificationSettingsResponse {
  message: string;
  settings: NotificationSettings;
}

export interface UpdateProfilePayoutPayload {
  bankId: string;
  bankAccountNumber: string;
  bankAccountName: string;
}

export interface UpdateProfilePayoutResponse {
  message: string;
  user: {
    id: string;
    bankName: string | null;
    bankAccountNumber: string | null;
    bankAccountName: string | null;
    onboardingPercentage: number;
  };
}

export interface UpdateProfileSocialsPayload {
  instagramUsername?: string | null;
  instagramFollowers?: number | null;
  tiktokUsername?: string | null;
  tiktokFollowers?: number | null;
  youtubeUsername?: string | null;
  youtubeFollowers?: number | null;
  twitterUsername?: string | null;
  twitterFollowers?: number | null;
}

export interface UpdateProfileSocialsResponse {
  message: string;
  user: {
    id: string;
    instagramUsername: string | null;
    tiktokUsername: string | null;
    youtubeUsername: string | null;
    twitterUsername: string | null;
    instagramFollowers: number;
    tiktokFollowers: number;
    youtubeFollowers: number;
    twitterFollowers: number;
    socialsConnected: {
      instagram: boolean;
      tiktok: boolean;
      youtube: boolean;
      twitter: boolean;
    };
    assignedTier: string | null;
  };
}
