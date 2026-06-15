'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/components/auth/AuthLayout';
import { BackButton } from '@/shared/BackButton';

export default function WelcomePage() {
  const router = useRouter();
  const params = useSearchParams();
  const type = params.get('type') ?? 'creator';

  const destination = type === 'advertiser' ? '/brand/dashboard' : '/creator/dashboard';

  const handleOnboard = () => {
    router.push(`/features/onboard?type=${type}`);
  };

  return (
    <AuthLayout
      imageSrc="/auth/onb3.svg"
      imageAlt="Creator"
      headlineTop="Discover"
      headlineBottom="Paid Campaigns"
      tagline="Find brand campaigns that match your niche and grow your creator career with real money."
      slideIndex={0}
    >
      <div className="w-full items-center flex flex-col">
        <BackButton className="absolute top-4" />
        <div className="w-full max-w-[500px] flex flex-col items-center">
          {/* Success icon */}
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-green-50 mb-6">
            <CheckCircle2 size={32} className="text-green-500" />
          </div>

          <h1 className="text-2xl font-extralight text-[#1a1a2e] text-center mb-2">
            Welcome to Trendupp! 🎉
          </h1>
          <p className="text-sm font-light text-text-secondary text-center mb-8">
            Your account is ready. You can start exploring campaigns right now.
          </p>

          {/* Profile completion card */}
          <div className="w-full shadow-lg border border-[#e8e6f0] rounded-xl p-4 mb-8">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-[#1a1a2e]">Your profile is 20% complete</p>
              <span className="text-sm font-semibold text-brand-pink">20%</span>
            </div>
            <div className="w-full bg-[#f5f3fb] rounded-full h-1.5 mb-3">
              <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '20%' }} />
            </div>
            <p className="text-xs text-text-secondary">
              Add your username, bio and niche to get noticed by brands
            </p>
          </div>

          <Button
            onClick={handleOnboard}
            className="w-full shadow-sm bg-brand-pink rounded-md h-12 text-[15px] font-light text-white"
          >
            Continue
          </Button>

          <button
            onClick={() => router.push(destination)}
            className="mt-4 text-sm text-text-secondary underline underline-offset-2 hover:text-[#1a1a2e] transition-colors"
          >
            I&apos;ll do that later
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}
