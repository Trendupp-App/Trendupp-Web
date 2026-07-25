import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { BrandProfileApi } from '@/services/BrandProfileApi';
import { useAuthStore } from '@/store/authStore';
import type {
  UpdatePersonalInfoPayload,
  UpdateProfilePayoutPayload,
  NotificationSettings,
  SecuritySettings,
  ChangePasswordPayload,
  DeactivateAccountPayload,
  CreateSupportTicketPayload,
} from '@/types/profile';
import type { UpdateIndustriesPayload, UpdateRepresentativePayload } from '@/types/Onboarding';

export function useUpdatePersonalInfo() {
  const updateUser = useAuthStore((s) => s.updateUser);
  return useMutation({
    mutationFn: (payload: UpdatePersonalInfoPayload) => BrandProfileApi.updatePersonalInfo(payload),
    onSuccess: ({ data }) => {
      if (data) {
        updateUser({
          firstName: data.firstName,
          lastName: data.lastName,
          username: data.username,
          bio: data.bio,
          avatarUrl: data.avatarUrl,
          onboardingPercentage: data.onboardingPercentage,
          onboardingStepsCompleted: data.onboardingStepsCompleted,
        });
      }
      toast.success('Profile updated successfully');
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err?.response?.data?.message ?? 'Could not update profile');
    },
  });
}

export function useUpdatePayout() {
  const updateUser = useAuthStore((s) => s.updateUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayoutPayload) => BrandProfileApi.updatePayout(payload),
    onSuccess: ({ data }) => {
      const u = data?.user || data;
      updateUser({
        bankName: u?.bankName,
        bankAccountNumber: u?.bankAccountNumber,
        bankAccountName: u?.bankAccountName,
      });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success(data?.message ?? 'Payout details saved successfully');
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err?.response?.data?.message ?? 'Could not save payout details');
    },
  });
}

export function useUpdateProfileIndustries() {
  const updateUser = useAuthStore((s) => s.updateUser);
  return useMutation({
    mutationFn: (payload: UpdateIndustriesPayload) => BrandProfileApi.updateIndustries(payload),
    onSuccess: ({ data }) => {
      updateUser({
        industries: data?.user?.industries,
        onboardingPercentage: data?.user?.onboardingPercentage,
      });
      toast.success('Industries updated successfully');
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err?.response?.data?.message ?? 'Could not update industries');
    },
  });
}

export function useUpdateProfileRepresentative() {
  const updateUser = useAuthStore((s) => s.updateUser);
  return useMutation({
    mutationFn: (payload: UpdateRepresentativePayload) =>
      BrandProfileApi.updateRepresentative(payload),
    onSuccess: ({ data }) => {
      updateUser({ brandRepresentative: data?.user?.brandRepresentative });
      toast.success('Representative details updated successfully');
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err?.response?.data?.message ?? 'Could not update representative');
    },
  });
}

export function useNotificationSettings() {
  return useQuery({
    queryKey: ['notification-settings'],
    queryFn: () => BrandProfileApi.getNotifications().then((r) => r.data),
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateNotifications() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<NotificationSettings>) =>
      BrandProfileApi.updateNotifications(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notification-settings'] });
      toast.success('Notifications updated');
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err?.response?.data?.message ?? 'Could not update notifications');
    },
  });
}

export function useSecuritySettings() {
  return useQuery({
    queryKey: ['security-settings'],
    queryFn: () => BrandProfileApi.getSecurity().then((r) => r.data),
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateSecurity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<SecuritySettings>) => BrandProfileApi.updateSecurity(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['security-settings'] });
      toast.success('Security settings updated');
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err?.response?.data?.message ?? 'Could not update security settings');
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => BrandProfileApi.changePassword(payload),
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err?.response?.data?.message ?? 'Could not change password');
    },
  });
}

export function useDeactivateAccount() {
  const clearSession = useAuthStore((s) => s.clearSession);
  return useMutation({
    mutationFn: (payload: DeactivateAccountPayload) => BrandProfileApi.deactivateAccount(payload),
    onSuccess: () => {
      toast.success('Account deactivated');
      clearSession();
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err?.response?.data?.message ?? 'Could not deactivate account');
    },
  });
}

export function useTicketCategories() {
  return useQuery({
    queryKey: ['ticket-categories'],
    queryFn: () => BrandProfileApi.getTicketCategories().then((r) => r.data),
    staleTime: 1000 * 60 * 60,
  });
}

export function useCreateTicket(onSuccess?: () => void) {
  return useMutation({
    mutationFn: (payload: CreateSupportTicketPayload) => BrandProfileApi.createTicket(payload),
    onSuccess: () => {
      toast.success('Support ticket submitted successfully');
      onSuccess?.();
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err?.response?.data?.message ?? 'Could not submit ticket');
    },
  });
}
