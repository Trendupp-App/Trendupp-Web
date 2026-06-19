import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { onboardingApi } from '@/services/onboardingApi';
import { useAuthStore } from '@/store/authStore';
import type {
  UpdateProfilePayload,
  UpdateSocialsPayload,
  UpdateNichesPayload,
  UpdatePayoutPayload,
} from '@/types/Onboarding';

export function useUpdateProfile() {
  const updateUser = useAuthStore((s) => s.updateUser);

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => onboardingApi.updateProfile(payload),
    onSuccess: ({ data }) => {
      const u = data?.user;
      updateUser({
        username: u.username,
        bio: u.bio,
        avatarUrl: u.avatarUrl,
        onboardingPercentage: u.onboardingPercentage,
        onboardingStepsCompleted: u.onboardingStepsCompleted,
        socialsConnected: u.socialsConnected,
      });
      toast.success(data.message ?? 'Profile updated successfully');
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err?.response?.data?.message ?? 'Could not update profile');
    },
  });
}

export function useUpdateNiches() {
  const updateUser = useAuthStore((s) => s.updateUser);

  return useMutation({
    mutationFn: (payload: UpdateNichesPayload) => onboardingApi.updateNiches(payload),
    onSuccess: ({ data }) => {
      const u = data?.user;
      updateUser({
        niches: u.niches,
        onboardingPercentage: u.onboardingPercentage,
        onboardingStepsCompleted: u.onboardingStepsCompleted,
      });
      toast.success(data.message ?? 'Niches updated successfully');
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err?.response?.data?.message ?? 'Could not update niches');
    },
  });
}

export function useUpdateSocials() {
  const updateUser = useAuthStore((s) => s.updateUser);

  return useMutation({
    mutationFn: (payload: UpdateSocialsPayload) => onboardingApi.updateSocials(payload),
    onSuccess: ({ data }) => {
      const u = data?.user;
      updateUser({
        socialsConnected: u.socialsConnected,
        assignedTier: u.assignedTier,
        onboardingPercentage: u.onboardingPercentage,
        onboardingStepsCompleted: u.onboardingStepsCompleted,
      });
      toast.success(data.message ?? 'Social account connected successfully');
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err?.response?.data?.message ?? 'Could not connect social account');
    },
  });
}

export function useUpdatePayout() {
  const updateUser = useAuthStore((s) => s.updateUser);

  return useMutation({
    mutationFn: (payload: UpdatePayoutPayload) => onboardingApi.updatePayout(payload),
    onSuccess: ({ data }) => {
      const u = data?.user;
      updateUser({
        bankName: u.bankName,
        bankAccountNumber: u.bankAccountNumber,
        bankAccountName: u.bankAccountName,
        onboardingPercentage: u.onboardingPercentage,
        onboardingStepsCompleted: u.onboardingStepsCompleted,
      });
      toast.success(data.message ?? 'Payout details saved successfully');
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err?.response?.data?.message ?? 'Could not save payout details');
    },
  });
}
