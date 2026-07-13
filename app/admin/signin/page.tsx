'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, ChevronLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/components/auth/AuthLayout';
import OtpInput from '@/components/auth/OtpInput';
import { signinSchema, SigninValues } from '@/lib/validations/loginSchema';
import { forgotPasswordSchema, ForgotPasswordValues } from '@/lib/validations/forgotPasswordSchema';
import { newPasswordSchema, NewPasswordValues } from '@/lib/validations/newPasswordSchema';
import { BackButton } from '@/shared/BackButton';
import {
  useLogin,
  useForgotPassword,
  useResetPassword,
  useResendOtp,
} from '@/hooks/useAuthMutations';
import { toast } from 'sonner';

type Step =
  | 'signin'
  | 'forgot-password'
  | 'verify-code'
  | 'reset-password'
  | 'setup-portal'
  | 'setup-signin';

export default function AdminSigninPage() {
  const [step, setStep] = useState<Step>('signin');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  const login = useLogin();
  const forgotPassword = useForgotPassword();
  const resetPassword = useResetPassword();
  const resendOtp = useResendOtp();

  // Detect Setup Mode on Mount (e.g. ?setup=true&email=joshua12@gmail.com)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get('setup') === 'true') {
        setStep('setup-portal');
        const emailParam = searchParams.get('email');
        if (emailParam) {
          setEmail(emailParam);
        }
      }
    }
  }, []);

  // Sign In Form
  const {
    register: registerSignin,
    handleSubmit: handleSigninSubmit,
    formState: { errors: signinErrors, isSubmitting: isSigninSubmitting },
  } = useForm<SigninValues>({
    resolver: zodResolver(signinSchema),
  });

  // Forgot Password Form
  const {
    register: registerForgot,
    handleSubmit: handleForgotSubmit,
    watch: watchForgot,
    formState: { errors: forgotErrors, isSubmitting: isForgotSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  // New Password Form (used for reset-password, setup-portal, and setup-signin)
  const {
    register: registerReset,
    handleSubmit: handleResetSubmit,
    reset: resetResetForm,
    formState: { errors: resetErrors, isSubmitting: isResetSubmitting },
  } = useForm<NewPasswordValues>({
    resolver: zodResolver(newPasswordSchema),
  });

  // Actions
  async function onSignin(values: SigninValues) {
    try {
      await login.mutateAsync(values);
      setTimeout(() => {
        router.push('/admin/disputes');
      }, 500);
    } catch {
      // Error is handled by useLogin's onError Toast
    }
  }

  async function onForgotSubmit(values: ForgotPasswordValues) {
    try {
      await forgotPassword.mutateAsync(values.email);
      setEmail(values.email);
      setStep('verify-code');
    } catch {
      // Error is handled by mutate's onError
    }
  }

  function onVerifyCodeSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (code.length === 6) {
      setStep('reset-password');
    } else {
      toast.error('Please enter a 6-digit verification code.');
    }
  }

  async function onResetSubmit(values: NewPasswordValues) {
    try {
      await resetPassword.mutateAsync({
        email,
        code,
        newPassword: values.password,
      });
      resetResetForm();
      setStep('signin');
    } catch {
      // Error is handled by mutate's onError
    }
  }

  async function onSetPassword(values: NewPasswordValues) {
    try {
      // Typically sets the password for admin onboarding
      await resetPassword.mutateAsync({
        email,
        code: 'ONBOARD', // Or token if present
        newPassword: values.password,
      });
      resetResetForm();
      toast.success('Password set successfully!');
      setStep('setup-signin');
    } catch {
      // Error is handled by mutate's onError
    }
  }

  async function onSetupSignin(values: NewPasswordValues) {
    try {
      await login.mutateAsync({
        email,
        password: values.password,
      });
      setTimeout(() => {
        router.push('/admin/disputes');
      }, 500);
    } catch {
      // Error is handled by useLogin's onError
    }
  }

  function handleBack() {
    if (step === 'forgot-password') {
      setStep('signin');
    } else if (step === 'verify-code') {
      setStep('forgot-password');
    } else if (step === 'reset-password') {
      setStep('verify-code');
    } else if (step === 'setup-portal') {
      setStep('signin');
    } else if (step === 'setup-signin') {
      setStep('setup-portal');
    }
  }

  const inputCls =
    'border-[#e8e6f0] h-10 text-xs font-light focus-visible:ring-brand-pink/30 focus-visible:border-brand-pink';
  const iconCls = 'absolute left-3 top-1/2 -translate-y-1/2 text-[#9a99b0] pointer-events-none';

  // Watch email field to control visual state of "Send code" button
  const watchedEmail = watchForgot('email');
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(watchedEmail || '');

  return (
    <AuthLayout
      imageSrc="/auth/onb3.webp"
      imageAlt="Creator"
      headlineTop="Discover"
      headlineBottom="Paid Campaigns"
      tagline="Find brand campaigns that match your niche and grow your creator career with real money."
      slideIndex={0}
    >
      <div className="w-full items-center flex flex-col relative">
        {/* Back Button */}
        {step === 'signin' ? (
          <BackButton className="absolute top-0" />
        ) : (
          <button
            type="button"
            onClick={handleBack}
            className="absolute top-0 left-0 flex items-center gap-1.5 text-sm text-[#7a7a9a] hover:text-brand-pink cursor-pointer transition-colors"
          >
            <ChevronLeft className="size-5" />
            <span>Back</span>
          </button>
        )}

        {/* Decorative stars */}
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="hidden md:block absolute left-8 top-20 w-7 h-7 text-brand-pink"
        >
          <path d="M12 2l2.5 7.5H22l-6 4.5 2.5 7.5L12 17l-6.5 4.5L8 14 2 9.5h7.5z" />
        </svg>
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="hidden md:block absolute right-8 top-20 w-7 h-7 text-brand-pink"
        >
          <path d="M12 2l2.5 7.5H22l-6 4.5 2.5 7.5L12 17l-6.5 4.5L8 14 2 9.5h7.5z" />
        </svg>

        <div className="max-w-[500px] w-full flex flex-col mt-12">
          {/* STEP 1: SIGN IN */}
          {step === 'signin' && (
            <>
              <h1 className="text-2xl font-extralight text-[#1a1a2e] text-center mb-1">
                Sign in to Admin Portal
              </h1>
              <p className="text-sm font-light text-text-secondary text-center mb-6">
                Restricted access — Trendupp team only
              </p>

              <form onSubmit={handleSigninSubmit(onSignin)} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <Label className="text-sm font-light text-[#1a1a2e]">Email address</Label>
                  <div className="relative">
                    <Mail size={15} className={iconCls} />
                    <Input
                      {...registerSignin('email')}
                      type="email"
                      placeholder="Enter email address"
                      className={`pl-9 ${inputCls}`}
                    />
                  </div>
                  {signinErrors.email && (
                    <p className="text-[11px] text-red-400">{signinErrors.email.message}</p>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <Label className="text-sm font-light text-[#1a1a2e]">Password</Label>
                  <div className="relative">
                    <Lock size={15} className={iconCls} />
                    <Input
                      {...registerSignin('password')}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter password"
                      className={`pl-9 pr-10 ${inputCls}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9a99b0] hover:text-[#1a1a2e]"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {signinErrors.password && (
                    <p className="text-[11px] text-red-400">{signinErrors.password.message}</p>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setStep('forgot-password')}
                    className="text-xs font-medium text-brand-pink hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={isSigninSubmitting}
                  className="w-full shadow-xl shadow-brand-pink-light bg-brand-pink rounded-md h-12 text-[15px] font-extralight text-white mt-2 disabled:bg-brand-pink/40 cursor-pointer"
                >
                  {isSigninSubmitting ? 'Signing in…' : 'Sign in'}
                </Button>
              </form>
            </>
          )}

          {/* STEP 2: FORGOT PASSWORD */}
          {step === 'forgot-password' && (
            <>
              <h1 className="text-2xl font-extralight text-[#1a1a2e] text-center mb-1">
                Forgot your password?
              </h1>
              <p className="text-sm font-light text-text-secondary text-center mb-6">
                Enter your registered email address and we&apos;ll send a 6-digit verification code.
              </p>

              <form onSubmit={handleForgotSubmit(onForgotSubmit)} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <Label className="text-sm font-light text-[#1a1a2e]">Email address</Label>
                  <div className="relative">
                    <Mail size={15} className={iconCls} />
                    <Input
                      {...registerForgot('email')}
                      type="email"
                      placeholder="you@email.com"
                      className={`pl-9 ${inputCls}`}
                    />
                  </div>
                  {forgotErrors.email && (
                    <p className="text-[11px] text-red-400">{forgotErrors.email.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isForgotSubmitting || !isEmailValid}
                  className={`w-full rounded-md h-12 text-[15px] font-extralight text-white mt-2 transition-all cursor-pointer ${
                    isEmailValid
                      ? 'bg-brand-pink shadow-xl shadow-brand-pink-light hover:bg-brand-pink/90'
                      : 'bg-brand-pink/10 text-brand-pink border border-brand-pink/20 pointer-events-none'
                  }`}
                >
                  {isForgotSubmitting ? 'Sending…' : 'Send code'}
                </Button>
              </form>
            </>
          )}

          {/* STEP 3: VERIFY CODE */}
          {step === 'verify-code' && (
            <>
              <h1 className="text-2xl font-extralight text-[#1a1a2e] text-center mb-1">
                Enter verification code
              </h1>
              <p className="text-sm font-light text-text-secondary text-center mb-4">
                Enter the verification code that was sent to{' '}
                <span className="font-medium text-[#1a1a2e]">{email}</span>
              </p>
              <p className="text-xs text-text-secondary text-center mb-6">
                Enter your 6 digit security code
              </p>

              <form onSubmit={onVerifyCodeSubmit} className="flex flex-col gap-4">
                <OtpInput length={6} onChange={setCode} />

                <Button
                  type="submit"
                  disabled={code.length !== 6}
                  className="w-full shadow-xl shadow-brand-pink-light bg-brand-pink rounded-md h-12 text-[15px] font-extralight text-white mt-4 disabled:bg-brand-pink/40 cursor-pointer"
                >
                  Submit
                </Button>

                <p className="text-sm text-text-secondary text-center mt-3">
                  Didn&apos;t get the code?{' '}
                  <button
                    type="button"
                    onClick={() => resendOtp.mutate(email)}
                    disabled={resendOtp.isPending}
                    className="text-brand-pink font-semibold hover:underline cursor-pointer disabled:opacity-50"
                  >
                    Resend
                  </button>
                </p>
              </form>
            </>
          )}

          {/* STEP 4: RESET PASSWORD */}
          {step === 'reset-password' && (
            <>
              <h1 className="text-2xl font-extralight text-[#1a1a2e] text-center mb-1">
                Create new password
              </h1>
              <p className="text-sm font-light text-text-secondary text-center mb-6">
                Choose a strong password with at least 8 characters, numbers and symbols.
              </p>

              <form onSubmit={handleResetSubmit(onResetSubmit)} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <Label className="text-sm font-light text-[#1a1a2e]">New password</Label>
                  <div className="relative">
                    <Lock size={15} className={iconCls} />
                    <Input
                      {...registerReset('password')}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter password"
                      className={`pl-9 pr-10 ${inputCls}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9a99b0] hover:text-[#1a1a2e]"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {resetErrors.password && (
                    <p className="text-[11px] text-red-400">{resetErrors.password.message}</p>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <Label className="text-sm font-light text-[#1a1a2e]">Confirm password</Label>
                  <div className="relative">
                    <Lock size={15} className={iconCls} />
                    <Input
                      {...registerReset('confirmPassword')}
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm password"
                      className={`pl-9 pr-10 ${inputCls}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9a99b0] hover:text-[#1a1a2e]"
                    >
                      {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {resetErrors.confirmPassword && (
                    <p className="text-[11px] text-red-400">
                      {resetErrors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isResetSubmitting}
                  className="w-full shadow-xl shadow-brand-pink-light bg-brand-pink rounded-md h-12 text-[15px] font-extralight text-white mt-4 disabled:bg-brand-pink/40 cursor-pointer"
                >
                  {isResetSubmitting ? 'Resetting…' : 'Reset password'}
                </Button>
              </form>
            </>
          )}

          {/* STEP 5: SETUP PORTAL (Onboarding 22 - node-id=4221-33388) */}
          {step === 'setup-portal' && (
            <>
              <h1 className="text-2xl font-extralight text-[#1a1a2e] text-center mb-1">
                Set up your portal
              </h1>
              <p className="text-sm font-light text-text-secondary text-center mb-6">
                Restricted access — Trendupp team only
              </p>

              <form onSubmit={handleResetSubmit(onSetPassword)} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <Label className="text-sm font-light text-[#1a1a2e]">Email address</Label>
                  <div className="relative opacity-70">
                    <Mail size={15} className={iconCls} />
                    <Input
                      type="email"
                      value={email || 'joshua12@gmail.com'}
                      disabled
                      className={`pl-9 bg-[#f3f2fa] cursor-not-allowed ${inputCls}`}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <Label className="text-sm font-light text-[#1a1a2e]">Password</Label>
                  <div className="relative">
                    <Lock size={15} className={iconCls} />
                    <Input
                      {...registerReset('password')}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter password"
                      className={`pl-9 pr-10 ${inputCls}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9a99b0] hover:text-[#1a1a2e]"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {resetErrors.password && (
                    <p className="text-[11px] text-red-400">{resetErrors.password.message}</p>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <Label className="text-sm font-light text-[#1a1a2e]">Confirm password</Label>
                  <div className="relative">
                    <Lock size={15} className={iconCls} />
                    <Input
                      {...registerReset('confirmPassword')}
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm password"
                      className={`pl-9 pr-10 ${inputCls}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9a99b0] hover:text-[#1a1a2e]"
                    >
                      {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {resetErrors.confirmPassword && (
                    <p className="text-[11px] text-red-400">
                      {resetErrors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isResetSubmitting}
                  className="w-full shadow-xl shadow-brand-pink-light bg-brand-pink rounded-md h-12 text-[15px] font-extralight text-white mt-4 disabled:bg-brand-pink/40 cursor-pointer"
                >
                  {isResetSubmitting ? 'Setting up…' : 'Set password'}
                </Button>
              </form>
            </>
          )}

          {/* STEP 6: SETUP SIGNIN (Onboarding 23 - node-id=4221-33466) */}
          {step === 'setup-signin' && (
            <>
              <h1 className="text-2xl font-extralight text-[#1a1a2e] text-center mb-1">
                Sign in to Admin Portal
              </h1>
              <p className="text-sm font-light text-text-secondary text-center mb-6">
                Restricted access — Trendupp team only
              </p>

              <form onSubmit={handleResetSubmit(onSetupSignin)} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <Label className="text-sm font-light text-[#1a1a2e]">Password</Label>
                  <div className="relative">
                    <Lock size={15} className={iconCls} />
                    <Input
                      {...registerReset('password')}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter password"
                      className={`pl-9 pr-10 ${inputCls}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9a99b0] hover:text-[#1a1a2e]"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {resetErrors.password && (
                    <p className="text-[11px] text-red-400">{resetErrors.password.message}</p>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <Label className="text-sm font-light text-[#1a1a2e]">Confirm password</Label>
                  <div className="relative">
                    <Lock size={15} className={iconCls} />
                    <Input
                      {...registerReset('confirmPassword')}
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm password"
                      className={`pl-9 pr-10 ${inputCls}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9a99b0] hover:text-[#1a1a2e]"
                    >
                      {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {resetErrors.confirmPassword && (
                    <p className="text-[11px] text-red-400">
                      {resetErrors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isResetSubmitting}
                  className="w-full shadow-xl shadow-brand-pink-light bg-brand-pink rounded-md h-12 text-[15px] font-extralight text-white mt-4 disabled:bg-brand-pink/40 cursor-pointer"
                >
                  {isResetSubmitting ? 'Logging in…' : 'Continue'}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </AuthLayout>
  );
}
