'use client';

import { ChevronLeft } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';
import OtpInput from '@/components/auth/OtpInput';
import { BackButton } from '@/shared/BackButton';
import { useAdminAuthForms } from './_useAdminAuthForms';
import { StepHeader, EmailField, PasswordField, PinkButton } from './_components';

function DecorativeStars() {
  const path = 'M12 2l2.5 7.5H22l-6 4.5 2.5 7.5L12 17l-6.5 4.5L8 14 2 9.5h7.5z';
  const cls = 'hidden md:block absolute top-20 w-7 h-7 text-brand-pink fill-current';
  return (
    <>
      <svg viewBox="0 0 24 24" className={`${cls} left-8`}>
        <path d={path} />
      </svg>
      <svg viewBox="0 0 24 24" className={`${cls} right-8`}>
        <path d={path} />
      </svg>
    </>
  );
}

export default function AdminSigninPage() {
  const {
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
  } = useAdminAuthForms();

  const {
    register: rS,
    handleSubmit: hS,
    formState: { errors: eS, isSubmitting: isS },
  } = signinForm;
  const {
    register: rF,
    handleSubmit: hF,
    formState: { errors: eF, isSubmitting: isF },
  } = forgotForm;
  const {
    register: rR,
    handleSubmit: hR,
    formState: { errors: eR, isSubmitting: isR },
  } = resetForm;

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

        <DecorativeStars />

        <div className="max-w-[500px] w-full flex flex-col mt-12">
          {/* SIGN IN */}
          {step === 'signin' && (
            <>
              <StepHeader
                title="Sign in to Admin Portal"
                subtitle="Restricted access — Trendupp team only"
              />
              <form onSubmit={hS(onSignin)} className="flex flex-col gap-3">
                <EmailField registration={rS('email')} error={eS.email?.message} />
                <PasswordField registration={rS('password')} error={eS.password?.message} />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setStep('forgot-password')}
                    className="text-xs font-medium text-brand-pink hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <PinkButton loading={isS} label="Sign in" loadingLabel="Signing in…" />
              </form>
            </>
          )}

          {/* FORGOT PASSWORD */}
          {step === 'forgot-password' && (
            <>
              <StepHeader
                title="Forgot your password?"
                subtitle="Enter your registered email address and we'll send a 6-digit verification code."
              />
              <form onSubmit={hF(onForgotSubmit)} className="flex flex-col gap-4">
                <EmailField
                  registration={rF('email')}
                  placeholder="you@email.com"
                  error={eF.email?.message}
                />
                <PinkButton
                  loading={isF}
                  disabled={!isEmailValid}
                  inactive={!isEmailValid}
                  label="Send code"
                  loadingLabel="Sending…"
                />
              </form>
            </>
          )}

          {/* VERIFY CODE */}
          {step === 'verify-code' && (
            <>
              <StepHeader title="Enter verification code" subtitle={`Code sent to ${email}`} />
              <p className="text-xs text-text-secondary text-center mb-6">
                Enter your 6 digit security code
              </p>
              <form onSubmit={onVerifyCodeSubmit} className="flex flex-col gap-4">
                <OtpInput length={6} onChange={setCode} />
                <PinkButton disabled={code.length !== 6} label="Submit" />
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

          {/* RESET PASSWORD */}
          {step === 'reset-password' && (
            <>
              <StepHeader
                title="Create new password"
                subtitle="Choose a strong password with at least 8 characters, numbers and symbols."
              />
              <form onSubmit={hR(onResetSubmit)} className="flex flex-col gap-3">
                <PasswordField
                  label="New password"
                  registration={rR('password')}
                  error={eR.password?.message}
                />
                <PasswordField
                  label="Confirm password"
                  registration={rR('confirmPassword')}
                  placeholder="Confirm password"
                  error={eR.confirmPassword?.message}
                />
                <PinkButton loading={isR} label="Reset password" loadingLabel="Resetting…" />
              </form>
            </>
          )}

          {/* SETUP PORTAL (Onboarding 22) */}
          {step === 'setup-portal' && (
            <>
              <StepHeader
                title="Set up your portal"
                subtitle="Restricted access — Trendupp team only"
              />
              <form onSubmit={hR(onSetPassword)} className="flex flex-col gap-3">
                <EmailField registration={{}} disabled value={email || 'joshua12@gmail.com'} />
                <PasswordField registration={rR('password')} error={eR.password?.message} />
                <PasswordField
                  label="Confirm password"
                  registration={rR('confirmPassword')}
                  placeholder="Confirm password"
                  error={eR.confirmPassword?.message}
                />
                <PinkButton loading={isR} label="Set password" loadingLabel="Setting up…" />
              </form>
            </>
          )}

          {/* SETUP SIGNIN (Onboarding 23) */}
          {step === 'setup-signin' && (
            <>
              <StepHeader
                title="Sign in to Admin Portal"
                subtitle="Restricted access — Trendupp team only"
              />
              <form onSubmit={hR(onSetupSignin)} className="flex flex-col gap-3">
                <PasswordField registration={rR('password')} error={eR.password?.message} />
                <PasswordField
                  label="Confirm password"
                  registration={rR('confirmPassword')}
                  placeholder="Confirm password"
                  error={eR.confirmPassword?.message}
                />
                <PinkButton loading={isR} label="Continue" loadingLabel="Logging in…" />
              </form>
            </>
          )}
        </div>
      </div>
    </AuthLayout>
  );
}
