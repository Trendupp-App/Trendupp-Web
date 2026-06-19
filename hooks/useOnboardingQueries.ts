import { useQuery } from '@tanstack/react-query';
import { onboardingApi } from '@/services/onboardingApi';
import { GetBanksParams } from '@/types/bank';

export function useBanks(params: GetBanksParams) {
  return useQuery({
    queryKey: ['banks', params],
    queryFn: () => onboardingApi.getBanks(params).then((r) => r.data),
    staleTime: 1000 * 60 * 30,
    placeholderData: (prev) => prev,
  });
}

export function useNationalities() {
  return useQuery({
    queryKey: ['nationalities'],
    queryFn: () => onboardingApi.getNationalities().then((r) => r.data),
    staleTime: 1000 * 60 * 60,
  });
}

export function useCountries() {
  return useQuery({
    queryKey: ['countries'],
    queryFn: () => onboardingApi.getCountries().then((r) => r.data),
    staleTime: 1000 * 60 * 60,
  });
}

export function useStates(countryId?: string) {
  return useQuery({
    queryKey: ['states', countryId],
    queryFn: () => onboardingApi.getStates(countryId as string).then((r) => r.data),
    enabled: !!countryId,
    staleTime: 1000 * 60 * 60,
  });
}

export function useNiches() {
  return useQuery({
    queryKey: ['niches'],
    queryFn: () =>
      onboardingApi.getNiches().then((r) => [...r.data].sort((a, b) => a.order - b.order)),
    staleTime: 1000 * 60 * 60,
  });
}
