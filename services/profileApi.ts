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
};
