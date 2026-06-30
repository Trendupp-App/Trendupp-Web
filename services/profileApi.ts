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

  getSecuritySettings: () => apiClient.get<GetSecuritySettingsResponse>('/api/v1/profile/security'),

  updateSecuritySettings: (payload: Partial<SecuritySettings>) =>
    apiClient.patch('/api/v1/profile/security', payload),

  changePassword: (payload: ChangePasswordPayload) =>
    apiClient.patch<ChangePasswordResponse>('/api/v1/profile/password', payload),

  deactivateAccount: (payload: DeactivateAccountPayload) =>
    apiClient.post<{ message: string }>('/api/v1/profile/deactivate', payload),

  getSupportTicketCategories: () =>
    apiClient.get<GetSupportTicketCategoriesResponse>('/api/v1/profile/support-ticket/categories'),

  getSupportTickets: (id?: string) =>
    apiClient.get<GetSupportTicketsResponse>('/api/v1/profile/support-ticket', {
      params: id ? { id } : undefined,
    }),

  submitSupportTicket: (payload: FormData) =>
    apiClient.post<SubmitSupportTicketResponse>('/api/v1/profile/support-ticket', payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export interface SubmitSupportTicketResponse {
  message: string;
  ticket?: SupportTicket;
}

export interface SupportTicket {
  id: string;
  category: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed' | string;
  createdAt: string;
  updatedAt?: string;
}

export interface GetSupportTicketsResponse {
  message: string;
  tickets?: SupportTicket[];
  ticket?: SupportTicket;
}

export interface GetSupportTicketCategoriesResponse {
  message: string;
  categories: Array<string | { id: string; name: string }>;
}

export interface DeactivateAccountPayload {
  password?: string;
}

export interface ChangePasswordPayload {
  currentPassword?: string;
  newPassword?: string;
}

export interface ChangePasswordResponse {
  message: string;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  biometricLoginEnabled: boolean;
  loginAlertsEnabled: boolean;
}

export interface GetSecuritySettingsResponse {
  message: string;
  settings: SecuritySettings;
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
