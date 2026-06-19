import apiClient from '@/lib/apiClient';
import { Bank, GetBanksParams } from '@/types/bank';
import {
  Country,
  Nationality,
  State,
  UpdateProfilePayload,
  UpdateProfileResponse,
  Niche,
  UpdateNichesPayload,
  UpdateNichesResponse,
  UpdateSocialsPayload,
  UpdateSocialsResponse,
  UpdatePayoutPayload,
  UpdatePayoutResponse,
} from '@/types/Onboarding';

export const onboardingApi = {
  getBanks: (params: GetBanksParams = {}) =>
    apiClient.get<Bank[]>('/users/onboarding/banks', { params }),

  getNationalities: () => apiClient.get<Nationality[]>('/users/onboarding/nationalities'),

  getCountries: () => apiClient.get<Country[]>('/users/onboarding/countries'),

  getStates: (countryId: string) =>
    apiClient.get<State[]>(`/users/onboarding/countries/${countryId}/states`),
  updateProfile: (payload: UpdateProfilePayload) =>
    apiClient.patch<UpdateProfileResponse>('/users/onboarding/profile', payload),

  getNiches: () => apiClient.get<Niche[]>('/users/onboarding/niches'),

  updateNiches: (payload: UpdateNichesPayload) =>
    apiClient.post<UpdateNichesResponse>('/users/onboarding/niches', payload),

  updateSocials: (payload: UpdateSocialsPayload) =>
    apiClient.patch<UpdateSocialsResponse>('/users/onboarding/socials', payload),
  updatePayout: (payload: UpdatePayoutPayload) =>
    apiClient.patch<UpdatePayoutResponse>('/users/onboarding/payout', payload),
};
