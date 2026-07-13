'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { signinSchema, SigninValues } from '@/lib/validations/loginSchema';
import { forgotPasswordSchema, ForgotPasswordValues } from '@/lib/validations/forgotPasswordSchema';
import { newPasswordSchema, NewPasswordValues } from '@/lib/validations/newPasswordSchema';
import {
  useLogin,
  useForgotPassword,
  useResetPassword,
  useResendOtp,
} from '@/hooks/useAuthMutations';

export type Step =
  | 'signin'
  | 'forgot-password'
  | 'verify-code'
  | 'reset-password'
  | 'setup-portal'
  | 'setup-signin';

export function useAdminAuthForms() {
  const [step, setStep] = useState<Step>('signin');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const router = useRouter();

  const login = useLogin();
  const forgotPassword = useForgotPassword();
  const resetPassword = useResetPassword();
  const resendOtp = useResendOtp();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('setup') === 'true') {
      setStep('setup-portal');
      const e = params.get('email');
      if (e) setEmail(e);
    }
  }, []);

  const signinForm = useForm<SigninValues>({ resolver: zodResolver(signinSchema) });
  const forgotForm = useForm<ForgotPasswordValues>({ resolver: zodResolver(forgotPasswordSchema) });
  const resetForm = useForm<NewPasswordValues>({ resolver: zodResolver(newPasswordSchema) });

  const watchedEmail = forgotForm.watch('email');
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(watchedEmail || '');

  async function onSignin(values: SigninValues) {
    try {
      await login.mutateAsync(values);
      setTimeout(() => router.push('/admin/dashboard'), 500);
    } catch {}
  }

  async function onForgotSubmit(values: ForgotPasswordValues) {
    try {
      await forgotPassword.mutateAsync(values.email);
      setEmail(values.email);
      setStep('verify-code');
    } catch {}
  }

  function onVerifyCodeSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (code.length === 6) setStep('reset-password');
    else toast.error('Please enter a 6-digit verification code.');
  }

  async function onResetSubmit(values: NewPasswordValues) {
    try {
      await resetPassword.mutateAsync({ email, code, newPassword: values.password });
      resetForm.reset();
      setStep('signin');
    } catch {}
  }

  async function onSetPassword(values: NewPasswordValues) {
    try {
      await resetPassword.mutateAsync({ email, code: 'ONBOARD', newPassword: values.password });
      resetForm.reset();
      toast.success('Password set successfully!');
      setStep('setup-signin');
    } catch {}
  }

  async function onSetupSignin(values: NewPasswordValues) {
    try {
      await login.mutateAsync({ email, password: values.password });
      setTimeout(() => router.push('/admin/dashboard'), 500);
    } catch {}
  }

  function handleBack() {
    const map: Partial<Record<Step, Step>> = {
      'forgot-password': 'signin',
      'verify-code': 'forgot-password',
      'reset-password': 'verify-code',
      'setup-portal': 'signin',
      'setup-signin': 'setup-portal',
    };
    const prev = map[step];
    if (prev) setStep(prev);
  }

  return {
    step,
    setStep,
    email,
    code,
    setCode,
    isEmailValid,
    signinForm,
    forgotForm,
    resetForm,
    resendOtp,
    onSignin,
    onForgotSubmit,
    onVerifyCodeSubmit,
    onResetSubmit,
    onSetPassword,
    onSetupSignin,
    handleBack,
  };
}
