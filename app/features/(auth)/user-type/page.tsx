'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, BriefcaseBusiness } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import AuthLayout from '@/components/auth/AuthLayout';
import AccountTypeCard from '@/components/auth/AccountTypeCard';

type AccountType = 'creator' | 'advertiser' | null;

export default function AccountTypePage() {
  const [selected, setSelected] = useState<AccountType>(null);
  const router = useRouter();

  function handleContinue() {
    if (!selected) return;
    const routes: Record<NonNullable<AccountType>, string> = {
      creator: '/features/creator/signup',
      advertiser: '/features/advertiser/signup',
    };
    router.push(routes[selected]);
  }

  return (
    <AuthLayout
      imageSrc="/images/auth/onb3.svg"
      imageAlt="Creator in yellow jacket"
      headlineTop="DIscover"
      headlineBottom="paid campaigns"
      tagline="Find brand campaigns that match your niche and grow your creator career with real money."
      slideIndex={1}
    >
      <div className="w-full max-w-[520px] flex flex-col">
        <h1 className="text-[24px] font-semibold text-[#1a1a2e] text-center mb-2">
          What brings you to Trendupp?
        </h1>
        <p className="text-[14px] font-light text-[#7a7a9a] text-center mb-8">
          Choose your account type to get started
        </p>

        <div className="flex flex-col gap-3.5 mb-8">
          <AccountTypeCard
            value="creator"
            selected={selected === 'creator'}
            icon={User}
            title="I am a creator"
            description="Discover paid campaigns, apply to brands, earn guaranteed payments"
            onSelect={(val) => setSelected(val as AccountType)}
          />

          <AccountTypeCard
            value="advertiser"
            selected={selected === 'advertiser'}
            icon={BriefcaseBusiness}
            title="I am an advertiser"
            description="Post campaigns, find verified creators, manage content and payments"
            onSelect={(val) => setSelected(val as AccountType)}
          />
        </div>

        <Button
          disabled={!selected}
          onClick={handleContinue}
          className={cn(
            'w-full rounded-xl h-12 text-[15px] font-semibold transition-all border-none shadow-none',
            selected
              ? 'bg-brand-pink text-white hover:bg-brand-pink/90 active:scale-[0.98]'
              : 'bg-[#fdf2f4] text-brand-pink/60 cursor-not-allowed opacity-100 disabled:opacity-100',
          )}
        >
          Continue
        </Button>

        <p className="text-sm text-[#7a7a9a] text-center mt-5">
          Already have an account?{' '}
          <a href="/features/signin" className="text-[#d91a6b] font-semibold hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </AuthLayout>
  );
}
