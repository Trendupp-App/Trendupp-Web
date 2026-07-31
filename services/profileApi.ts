import apiClient from '@/lib/apiClient';
import type { AuthUser } from '@/store/authStore';
import type {
  CreatePortfolioItemResponse,
  GetPortfolioResponse,
  SupportTicketCategory,
  SupportTicket,
  CreateSupportTicketPayload,
} from '@/types/profile';

export interface UpdatePersonalInfoResponse extends Partial<AuthUser> {
  message?: string;
  user?: Partial<AuthUser>;
}

export interface UpdateProfileNichesPayload {
  nicheIds: string[];
}

export interface UpdateProfileNichesResponse extends Partial<AuthUser> {
  message?: string;
  user?: Partial<AuthUser>;
}

export const profileApi = {
  getUserDetail: (id: string) => apiClient.get<AuthUser>(`/users/${id}`),

  updatePersonalInfo: (payload: FormData) =>
    apiClient.patch<UpdatePersonalInfoResponse>('/profile/personal-info', payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  updateNiches: (payload: UpdateProfileNichesPayload) =>
    apiClient.put<UpdateProfileNichesResponse>('/profile/niches', payload),

  updatePayout: (payload: UpdateProfilePayoutPayload) =>
    apiClient.patch<UpdateProfilePayoutResponse>('/profile/payout', payload),

  getNotificationSettings: () =>
    apiClient.get<GetNotificationSettingsResponse>('/profile/notifications'),

  updateNotificationSettings: (payload: Partial<NotificationSettings>) =>
    apiClient.patch('/profile/notifications', payload),

  getSecuritySettings: () => apiClient.get<GetSecuritySettingsResponse>('/profile/security'),

  updateSecuritySettings: (payload: Partial<SecuritySettings>) =>
    apiClient.patch('/profile/security', payload),

  changePassword: (payload: ChangePasswordPayload) =>
    apiClient.patch<ChangePasswordResponse>('/profile/password', payload),

  deactivateAccount: (payload: DeactivateAccountPayload) =>
    apiClient.post<{ message: string }>('/profile/deactivate', payload),

  getSupportTicketCategories: () =>
    apiClient.get<SupportTicketCategory[]>('/profile/support-ticket/categories'),

  getSupportTickets: (id?: string) =>
    apiClient.get<SupportTicket[]>('/profile/support-ticket', {
      params: id ? { id } : undefined,
    }),

  submitSupportTicket: (payload: CreateSupportTicketPayload) => {
    const fd = new FormData();
    fd.append('issueCategoryId', payload.issueCategoryId);
    fd.append('subject', payload.subject);
    fd.append('description', payload.description);
    if (payload.attachment instanceof File) {
      fd.append('attachment', payload.attachment);
    }
    // Do not set Content-Type explicitly — the browser must generate the
    // multipart boundary itself, or the backend can't parse the body.
    return apiClient.post<SupportTicket>('/profile/support-ticket', fd, {
      headers: { 'Content-Type': undefined },
    });
  },

  getPortfolio: () => apiClient.get<GetPortfolioResponse>('/portfolio'),

  createPortfolioItem: (payload: FormData) =>
    apiClient.post<CreatePortfolioItemResponse>('/portfolio', payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  deletePortfolioItem: (id: string) => apiClient.delete<{ message?: string }>(`/portfolio/${id}`),
};

export type { SupportTicket, SupportTicketCategory, CreateSupportTicketPayload };

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

export interface UpdateProfilePayoutResponse extends Partial<AuthUser> {
  message?: string;
  user?: Partial<AuthUser>;
}
