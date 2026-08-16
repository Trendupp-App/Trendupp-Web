import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { authApi } from '@/services/authApi';
import { AuthUser, useAuthStore } from '@/store/authStore';
import { AxiosError } from 'axios';
import { signIn, signOut } from 'next-auth/react';
import { mapUserProfileToAuthUser } from '@/lib/mapUserProfile';
import { useDebouncedValue } from './useDebounceValue';
import { useRouter } from 'next/navigation';

export async function hydrateFullProfile(
  userId: string,
  updateUser: (patch: Partial<AuthUser>) => void,
) {
  try {
    const { data: fullProfile } = await authApi.getUserProfile(userId);
    updateUser(mapUserProfileToAuthUser(fullProfile));
  } catch (e) {
    console.error('Failed to hydrate full profile', e);
  }
}
export function useRoles() {
  return useQuery({
    queryKey: ['roles'],
    queryFn: () => authApi.getRoles().then((r) => r?.data),
    staleTime: Infinity,
  });
}

export function useSignup() {
  return useMutation({
    mutationFn: authApi.signup,
    onSuccess: () => {
      toast.success('Account created! Check your email for a verification code.');
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err?.response?.data?.message ?? 'Signup failed');
    },
  });
}

export function useVerifyOtp() {
  const setSession = useAuthStore((s) => s.setSession);
  const updateUser = useAuthStore((s) => s.updateUser);
  return useMutation({
    mutationFn: authApi.verifyOtp,
    onSuccess: async ({ data }) => {
      setSession(data.accessToken, data.user);
      toast.success('Email verified successfully!');
      await hydrateFullProfile(data.user.id, updateUser);
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err?.response?.data?.message ?? 'Invalid code');
    },
  });
}

// Verifies a password-reset OTP without touching the session — unlike
// useVerifyOtp (signup), the user isn't logging in here, just proving they
// own the email before they're allowed to pick a new password.
export function useVerifyResetOtp() {
  return useMutation({
    mutationFn: authApi.verifyOtp,
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err?.response?.data?.message ?? 'Invalid or expired code');
    },
  });
}

export function useLogin() {
  const clearSession = useAuthStore((s) => s.clearSession);
  const setSession = useAuthStore((s) => s.setSession);
  const updateUser = useAuthStore((s) => s.updateUser);

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: async ({ data }) => {
      setSession(data.accessToken, data.user);
      toast.success(`Welcome back!`);
      await hydrateFullProfile(data.user.id, updateUser);
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      // false: this is a failed *login* attempt, not a real session being torn
      // down — there's nothing to redirect away from, and clearSession's default
      // hard `window.location.href` reload would wipe the page (and the error
      // toast) out from under the user before they can read it.
      clearSession(false);
      toast.error(err?.response?.data?.message ?? 'Login failed');
    },
  });
}

export function useResendOtp() {
  return useMutation({
    mutationFn: (email: string) => authApi.resendOtp(email),
    onSuccess: () => toast.success('A new code has been sent'),
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err?.response?.data?.message ?? 'Could not resend code');
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
    onSuccess: () => {
      toast.success('If the email exists, a reset code has been sent.');
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err?.response?.data?.message ?? 'Could not send reset code');
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      toast.success('Password reset successfully!');
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err?.response?.data?.message ?? 'Reset failed');
    },
  });
}

export function useGoogleAuth() {
  const setSession = useAuthStore((s) => s.setSession);
  const clearSession = useAuthStore((s) => s.clearSession);
  const updateUser = useAuthStore((s) => s.updateUser);
  const router = useRouter();

  const googleSignIn = async ({
    role,
    acceptedTerms,
    acceptedPromotions,
  }: {
    role: string;
    acceptedTerms: boolean;
    acceptedPromotions: boolean;
  }) => {
    // Trigger NextAuth Google popup
    const result = await signIn('google', { redirect: false });
    if (result?.error) {
      toast.error('Google sign-in failed');
      return null;
    }
    return { role, acceptedTerms, acceptedPromotions };
  };

  const exchangeGoogleToken = useMutation({
    mutationFn: authApi.googleAuth,
    onSuccess: async ({ data }) => {
      // The NextAuth session only exists to carry Google's id_token to this
      // exchange — once it's been used, drop it so it can never be reused
      // later with a token that's since expired.
      void signOut({ redirect: false });
      setSession(data.accessToken, data.user);
      toast.success('Signed in with Google!');
      await hydrateFullProfile(data.user.id, updateUser);
      const { user } = data;
      if (user.onboardingPercentage < 100) {
        const name = encodeURIComponent(user.firstName ?? '');
        router.push(`/onboard?type=${user.role}&name=${name}`);
      } else {
        router.push(user.role === 'creator' ? '/creator/dashboard' : '/brand/dashboard');
      }
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      void signOut({ redirect: false });
      // false: this is a failed *login* attempt, not a real session being torn
      // down — there's nothing to redirect away from, and clearSession's default
      // hard `window.location.href` reload would wipe the page (and the error
      // toast) out from under the user before they can read it.
      clearSession(false);
      toast.error(err?.response?.data?.message ?? 'Google auth failed');
    },
  });

  return { googleSignIn, exchangeGoogleToken };
}

export function useTiktokAuth() {
  const setSession = useAuthStore((s) => s.setSession);
  const clearSession = useAuthStore((s) => s.clearSession);
  const updateUser = useAuthStore((s) => s.updateUser);

  const exchangeTiktokToken = useMutation({
    mutationFn: authApi.tiktokAuth,
    onSuccess: async ({ data }) => {
      setSession(data.accessToken, data.user);
      toast.success('Signed in with TikTok!');
      await hydrateFullProfile(data.user.id, updateUser);
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      // false: this is a failed *login* attempt, not a real session being torn
      // down — there's nothing to redirect away from, and clearSession's default
      // hard `window.location.href` reload would wipe the page (and the error
      // toast) out from under the user before they can read it.
      clearSession(false);
      toast.error(err?.response?.data?.message ?? 'TikTok auth failed');
    },
  });

  return { exchangeTiktokToken };
}

export function useInstagramAuth() {
  const setSession = useAuthStore((s) => s.setSession);
  const clearSession = useAuthStore((s) => s.clearSession);
  const updateUser = useAuthStore((s) => s.updateUser);

  const exchangeInstagramToken = useMutation({
    mutationFn: authApi.instagramAuth,
    onSuccess: async ({ data }) => {
      setSession(data.accessToken, data.user);
      toast.success('Signed in with Instagram!');
      await hydrateFullProfile(data.user.id, updateUser);
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      // false: this is a failed *login* attempt, not a real session being torn
      // down — there's nothing to redirect away from, and clearSession's default
      // hard `window.location.href` reload would wipe the page (and the error
      // toast) out from under the user before they can read it.
      clearSession(false);
      toast.error(err?.response?.data?.message ?? 'Instagram auth failed');
    },
  });

  return { exchangeInstagramToken };
}

export function useFacebookAuth() {
  const setSession = useAuthStore((s) => s.setSession);
  const clearSession = useAuthStore((s) => s.clearSession);
  const updateUser = useAuthStore((s) => s.updateUser);

  const exchangeFacebookToken = useMutation({
    mutationFn: authApi.facebookAuth,
    onSuccess: async ({ data }) => {
      setSession(data.accessToken, data.user);
      toast.success('Signed in with Facebook!');
      await hydrateFullProfile(data.user.id, updateUser);
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      // false: this is a failed *login* attempt, not a real session being torn
      // down — there's nothing to redirect away from, and clearSession's default
      // hard `window.location.href` reload would wipe the page (and the error
      // toast) out from under the user before they can read it.
      clearSession(false);
      toast.error(err?.response?.data?.message ?? 'Facebook auth failed');
    },
  });

  return { exchangeFacebookToken };
}

export function useAppleAuth() {
  const setSession = useAuthStore((s) => s.setSession);
  const clearSession = useAuthStore((s) => s.clearSession);
  const updateUser = useAuthStore((s) => s.updateUser);

  const exchangeAppleToken = useMutation({
    mutationFn: authApi.appleAuth,
    onSuccess: async ({ data }) => {
      setSession(data.accessToken, data.user);
      toast.success('Signed in with Apple!');
      await hydrateFullProfile(data.user.id, updateUser);
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      // false: this is a failed *login* attempt, not a real session being torn
      // down — there's nothing to redirect away from, and clearSession's default
      // hard `window.location.href` reload would wipe the page (and the error
      // toast) out from under the user before they can read it.
      clearSession(false);
      toast.error(err?.response?.data?.message ?? 'Apple auth failed');
    },
  });

  return { exchangeAppleToken };
}

export function useUsernameAvailability(rawValue: string) {
  const value = rawValue.trim();
  const debounced = useDebouncedValue(value, 450);
  const isCheckable = debounced.length >= 3;

  const query = useQuery({
    queryKey: ['username-check', debounced.toLowerCase()],
    queryFn: () => authApi.checkUsername(debounced).then((r) => r.data),
    enabled: isCheckable,
    staleTime: 1000 * 30,
    retry: false,
  });

  return {
    ...query,
    isChecking: isCheckable && query.isFetching,
    isTaken: query.data?.isAvailable === false,
    isAvailable: query.data?.isAvailable === true,
  };
}
