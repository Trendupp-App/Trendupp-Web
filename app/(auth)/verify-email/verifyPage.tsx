'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/components/auth/AuthLayout';
import OtpInput from '@/components/auth/OtpInput';
import { BackButton } from '@/shared/BackButton';
import { useResendOtp, useVerifyOtp } from '@/hooks/useAuthMutations';

export default function VerifyPage() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get('email') ?? 'your email';
  const type = params.get('type') ?? 'creator';
  const verifyOtp = useVerifyOtp();
  const resendOtp = useResendOtp();
  const prefillOtp = params.get('otp') ?? '';

  async function handleSubmit() {
    if (otp.length < 6) return;
    setLoading(true);
    try {
      await verifyOtp.mutateAsync({ email, code: otp });
      setTimeout(() => {
        router.push(`/welcome?type=${type}`);
      }, 500);
    } catch {
      // error toast already handled by useVerifyOtp's onError
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      imageSrc="/auth/onb3.svg"
      imageAlt="Creator"
      headlineTop="Discover"
      headlineBottom="Paid Campaigns"
      tagline="Find brand campaigns that match your niche and grow your creator career with real money."
      slideIndex={1}
    >
      <div className="w-full items-center flex flex-col">
        <BackButton className="absolute top-4" />
        <div className="w-full max-w-[500px] flex flex-col items-center">
          <h1 className="text-2xl font-extralight text-[#1a1a2e] text-center mb-2">
            Enter verification code
          </h1>
          <p className="text-sm font-light text-text-secondary text-center mb-1">
            Enter the verification code that was sent to
          </p>
          <p className="text-sm font-semibold text-[#1a1a2e] text-center mb-2">{email}</p>
          <p className="text-xs text-text-secondary text-center mb-8">
            Enter your 6 digit security code
          </p>

          <OtpInput onChange={setOtp} initialValue={prefillOtp} />

          <Button
            onClick={handleSubmit}
            disabled={otp.length < 6 || loading}
            className="w-full mt-8 shadow-xl shadow-brand-pink-light bg-brand-pink rounded-md h-12 text-[15px] font-semibold text-white disabled:bg-brand-pink-light"
          >
            {loading ? 'Verifying…' : 'Submit'}
          </Button>

          <p className="text-sm text-text-secondary text-center mt-5">
            Didn&apos;t get the code?{' '}
            <button
              onClick={() => resendOtp.mutate(email)}
              className="text-brand-pink font-semibold hover:underline"
            >
              Resend
            </button>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
