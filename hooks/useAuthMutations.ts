import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { authApi } from '@/services/authApi';
import { useAuthStore } from '@/store/authStore';
import { AxiosError } from 'axios';
export function useRoles() {
  return useQuery({
    queryKey: ['roles'],
    queryFn: () => authApi.getRoles().then((r) => r.data),
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
  return useMutation({
    mutationFn: authApi.verifyOtp,
    onSuccess: ({ data }) => {
      setSession(data.accessToken, data.user);
      toast.success('Email verified successfully!');
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err?.response?.data?.message ?? 'Invalid code');
    },
  });
}

export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: ({ data }) => {
      setSession(data.accessToken, data.user);
      toast.success(`Welcome back!`);
    },
    onError: (err: AxiosError<{ message?: string }>) => {
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
