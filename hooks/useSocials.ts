'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { socialsApi, type SocialPlatformId } from '@/services/socialsApi';
import { syncAuthStoreFromSocials, isMockConnectAvailable } from '@/lib/socialConnect';

const SOCIALS_QUERY_KEY = ['socials'] as const;

type ApiError = AxiosError<{ message?: string }>;

/** The four platform cards with the caller's connection status. */
export function useSocialConnections() {
  return useQuery({
    queryKey: SOCIALS_QUERY_KEY,
    queryFn: async () => (await socialsApi.list()).data,
  });
}

/**
 * Dev-only: connect with a backend mock code (no platform app needed).
 * Real OAuth connects happen via beginSocialConnect() + the callback pages.
 */
export function useMockConnectSocial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (platform: SocialPlatformId) => {
      if (!isMockConnectAvailable()) {
        throw new Error('Mock connect is not available in production');
      }
      const { data } = await socialsApi.connect(platform, {
        code: `mock_${crypto.randomUUID().slice(0, 8)}`,
        redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback/${platform}`,
      });
      return data;
    },
    onSuccess: (data) => {
      syncAuthStoreFromSocials(data);
      void queryClient.invalidateQueries({ queryKey: SOCIALS_QUERY_KEY });
      toast.success(`${data.message} — you are now a ${data.tier}`);
    },
    onError: (err: ApiError) => {
      toast.error(err?.response?.data?.message ?? 'Could not connect this account');
    },
  });
}

export function useRefreshSocial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (platform: SocialPlatformId) => (await socialsApi.refresh(platform)).data,
    onSuccess: (data) => {
      syncAuthStoreFromSocials(data);
      void queryClient.invalidateQueries({ queryKey: SOCIALS_QUERY_KEY });
      toast.success(data.message);
    },
    onError: (err: ApiError) => {
      toast.error(err?.response?.data?.message ?? 'Could not refresh stats');
    },
  });
}

export function useDisconnectSocial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (platform: SocialPlatformId) => (await socialsApi.disconnect(platform)).data,
    onSuccess: (data) => {
      syncAuthStoreFromSocials(data);
      void queryClient.invalidateQueries({ queryKey: SOCIALS_QUERY_KEY });
      toast.success(data.message);
    },
    onError: (err: ApiError) => {
      toast.error(err?.response?.data?.message ?? 'Could not disconnect this account');
    },
  });
}
