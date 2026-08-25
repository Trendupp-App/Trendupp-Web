'use client';

import { useQuery } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import apiClient from '@/lib/apiClient';

export type AuthProviderId = 'google' | 'apple' | 'facebook' | 'tiktok' | 'instagram';

export interface AuthProviderFlags {
  provider: AuthProviderId;
  signinEnabled: boolean;
  signupEnabled: boolean;
}

/**
 * Backend-controlled kill-switches for the OAuth buttons (GET /auth/providers,
 * public). Which flag applies is derived from the route: /signup pages check
 * signupEnabled, everything else checks signinEnabled.
 *
 * Fail-open on loading/error — the API enforces the flags server-side, so a
 * transient fetch failure showing an extra button is harmless, while hiding
 * every button would strand real users.
 */
export function useAuthProviderEnabled(provider: AuthProviderId): boolean {
  const pathname = usePathname();
  const { data } = useQuery({
    queryKey: ['authProviders'],
    queryFn: async () => (await apiClient.get<AuthProviderFlags[]>('/auth/providers')).data,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const row = data?.find((p) => p.provider === provider);
  if (!row) return true;

  const isSignup = pathname?.includes('signup') ?? false;
  return isSignup ? row.signupEnabled : row.signinEnabled;
}
