import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { profileApi, UpdateProfileSocialsPayload } from '@/services/profileApi';
import { useAuthStore } from '@/store/authStore';

export function useUpdatePersonalInfo() {
  const updateUser = useAuthStore((s) => s.updateUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => profileApi.updatePersonalInfo(formData),
    onSuccess: ({ data }) => {
      const u = data?.user;
      // Sync global auth store
      updateUser({
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        username: u.username,
        bio: u.bio,
        avatarUrl: u.avatarUrl,
      });
      // Invalidate queries to refresh view
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success(data.message ?? 'Personal info updated successfully');
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err?.response?.data?.message ?? 'Could not update profile');
    },
  });
}

export function useUpdateProfileNiches() {
  const updateUser = useAuthStore((s) => s.updateUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { nicheIds: string[] }) => profileApi.updateNiches(payload),
    onSuccess: ({ data }) => {
      const u = data?.user;
      // Sync global auth store
      updateUser({
        niches: u.niches,
      });
      // Invalidate queries to refresh view
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success(data.message ?? 'Niches updated successfully');
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err?.response?.data?.message ?? 'Could not update niches');
    },
  });
}

export function useUpdateProfileSocials() {
  const updateUser = useAuthStore((s) => s.updateUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfileSocialsPayload) => profileApi.updateSocials(payload),
    onSuccess: ({ data }) => {
      const u = data?.user;
      // Sync global auth store
      updateUser({
        socialsConnected: u.socialsConnected,
        assignedTier: u.assignedTier,
      });
      // Invalidate queries to refresh view
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success(data.message ?? 'Social accounts updated successfully');
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err?.response?.data?.message ?? 'Could not update social connections');
    },
  });
}
