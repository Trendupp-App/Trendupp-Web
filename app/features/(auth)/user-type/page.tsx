'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, BriefcaseBusiness } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import AuthLayout from '@/components/auth/AuthLayout';
import AccountTypeCard from '@/components/auth/AccountTypeCard';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/services/authApi';
import { useQueryClient } from '@tanstack/react-query';

type AccountType = 'creator' | 'advertiser' | null;

export default function AccountTypePage() {
  const [selected, setSelected] = useState<AccountType>(null);
  const router = useRouter();
  const { user, accessToken } = useAuthStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ['roles'],
      queryFn: () => authApi.getRoles().then((r) => r?.data),
      staleTime: Infinity,
    });
  }, [queryClient]);

  useEffect(() => {
    if (accessToken && user) {
      router.replace(
        user.role === 'creator' ? '/features/creator/dashboard' : '/features/brand/dashboard',
      );
    }
  }, [accessToken, user, router]);

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
      imageSrc="/auth/onb3.svg"
      imageAlt="Creator in yellow jacket"
      headlineTop="Discover"
      headlineBottom="Paid Campaigns"
      tagline="Find brand campaigns that match your niche and grow your creator career with real money."
      slideIndex={1}
    >
      <div className="w-full  max-w-[420px] flex flex-col">
        <h1 className="text-2xl font-extralight text-[#1a1a2e] text-center mb-2">
          What brings you to Trendupp?
        </h1>
        <p className="text-sm font-light text-text-secondary text-center mb-8">
          Choose your account type to get started
        </p>

        <div className="flex flex-col gap-3 mb-8">
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
          className="w-full border shadow bg-brand-pink rounded-md h-12 text-[15px] font-semibold disabled:bg-brand-pink-light"
        >
          <p className={cn('font-medium', selected ? 'text-white' : 'text-brand-pink')}>Continue</p>
        </Button>

        <p className="text-sm text-text-secondary text-center mt-5">
          Already have an account?{' '}
          <a href="/features/signin" className="text-[#d91a6b] font-semibold hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </AuthLayout>
  );
}
