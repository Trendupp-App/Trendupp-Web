'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';
import StepIndustry from '@/components/onboarding/advertiser/StepIndustry';

// Creator steps
import StepProfileCreator from '@/components/onboarding/creator/StepProfile';
import StepNiche from '@/components/onboarding/creator/StepNiche';
import StepComplete from '@/components/onboarding/creator/StepComplete';

// Advertiser steps
import StepProfileAdvertiser from '@/components/onboarding/advertiser/StepProfile';
import StepRepresentative from '@/components/onboarding/advertiser/StepRepresentativeForm';

import StepSocials from '@/components/onboarding/creator/StepSocialsConnect';
import StepPayout from '@/components/onboarding/creator/StepPayout';

import type { CreatorOnboardingData, AdvertiserOnboardingData } from '@/types/Onboarding';

type CreatorStepId = 'profile' | 'niche' | 'socials' | 'payout' | 'complete';
type AdvertiserStepId =
  | 'profile'
  | 'industry'
  | 'niche'
  | 'representative'
  | 'socials'
  | 'payout'
  | 'complete';
type StepId = CreatorStepId | AdvertiserStepId;

type OnboardingData = CreatorOnboardingData & AdvertiserOnboardingData;

const CREATOR_STEPS: CreatorStepId[] = ['profile', 'niche', 'socials', 'payout', 'complete'];
const ADVERTISER_STEPS: AdvertiserStepId[] = [
  'profile',
  'industry',
  'niche',
  'representative',
  'socials',
  'payout',
  'complete',
];

const CREATOR_STEP_META: Record<CreatorStepId, { title: string; subtitle: string }> = {
  profile: {
    title: "Let's build your profile",
    subtitle: 'This is what brands will see when they view your creator page',
  },
  niche: {
    title: 'Niche',
    subtitle: 'Choose at least 3 niches. Your tier will be set automatically.',
  },
  socials: {
    title: 'Connect your socials',
    subtitle:
      'Link at least 1 and up to 3 of your accounts securely, to verify your social profile and tier',
  },
  payout: {
    title: 'Payout details',
    subtitle: 'Connect your social accounts to access more opportunities',
  },
  complete: {
    title: '',
    subtitle: '',
  },
};

const ADVERTISER_STEP_META: Record<AdvertiserStepId, { title: string; subtitle: string }> = {
  profile: {
    title: "Let's build your profile",
    subtitle: 'This is what creators will see when they view your brand page',
  },
  industry: {
    title: 'Industry',
    subtitle: 'Choose at least 3 industries for your brand',
  },
  niche: {
    title: 'Niche',
    subtitle: 'Choose at least 3 niche for your brand',
  },
  representative: {
    title: 'Brand representative',
    subtitle: 'Add the contact information of your brand representative.',
  },
  socials: {
    title: 'Connect your socials',
    subtitle: 'Connect your social accounts to access more opportunities',
  },
  payout: {
    title: 'Payout details',
    subtitle: 'Add your payout details to fund and run campaigns',
  },
  complete: {
    title: '',
    subtitle: '',
  },
};

function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="w-full mb-6">
      <p className="text-xs text-[#9a99b0] mb-2">
        Step {current}/{total}
      </p>
      <div className="flex gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i < current ? 'bg-brand-pink' : 'bg-[#e8e6f0]'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const params = useSearchParams();
  const userType = (params.get('type') ?? 'creator') as 'creator' | 'advertiser';
  const userName = params.get('name') ?? undefined;

  const isAdvertiser = userType === 'advertiser';
  const steps: StepId[] = isAdvertiser ? ADVERTISER_STEPS : CREATOR_STEPS;
  const stepMeta = isAdvertiser ? ADVERTISER_STEP_META : CREATOR_STEP_META;

  const [stepIndex, setStepIndex] = useState(0);
  const [data, setData] = useState<OnboardingData>({});

  const currentStepId = steps[stepIndex];
  const isComplete = currentStepId === 'complete';
  // Don't count 'complete' as a numbered step
  const numberedSteps = steps.filter((s): s is Exclude<StepId, 'complete'> => s !== 'complete');
  // const numberedSteps = steps.filter((s) => s !== 'complete');
  // const currentNumber = numberedSteps.indexOf(currentStepId) + 1;
  // const meta = stepMeta[currentStepId as keyof typeof stepMeta];
  const currentNumber = numberedSteps.indexOf(currentStepId as Exclude<StepId, 'complete'>) + 1;
  const meta = stepMeta[currentStepId as Exclude<StepId, 'complete'> as keyof typeof stepMeta];

  function advance(partial: Partial<OnboardingData> = {}) {
    setData((prev: OnboardingData) => ({ ...prev, ...partial }));
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  }

  function goBack() {
    if (stepIndex === 0) {
      router.back();
    } else {
      setStepIndex((i) => i - 1);
    }
  }

  function skip() {
    advance();
  }

  function goToDashboard() {
    router.push(isAdvertiser ? '/brand/dashboard' : '/creator/dashboard');
  }

  const layoutProps = isAdvertiser
    ? {
        imageSrc: '/auth/onb3.svg',
        imageAlt: 'Advertiser',
        headlineTop: 'Launch your',
        headlineBottom: 'campaigns',
        tagline: 'Create, manage, and track influencer campaigns from one centralized platform.',
        slideIndex: 0,
      }
    : {
        imageSrc: '/auth/onb3.svg',
        imageAlt: 'Creator',
        headlineTop: 'Discover',
        headlineBottom: 'paid campaigns',
        tagline:
          'Find brand campaigns that match your niche and grow your creator career with real money.',
        slideIndex: 0,
      };

  return (
    <AuthLayout {...layoutProps}>
      <div className="w-full max-w-[560px] flex flex-col">
        {/* Back button — hidden on complete screen */}
        {!isComplete && (
          <button
            onClick={goBack}
            className="self-start flex items-center gap-1 text-sm text-[#7a7a9a] hover:text-brand-pink transition-colors mb-4"
          >
            <ChevronLeft size={18} />
            Back
          </button>
        )}

        {/* Progress bar — hidden on complete screen */}
        {!isComplete && <ProgressBar current={currentNumber} total={numberedSteps.length} />}

        {/* Step heading — hidden on complete screen */}
        {!isComplete && meta.title && (
          <div className="text-center mb-6">
            <h1 className="text-xl font-light text-[#1a1a2e] mb-1">{meta.title}</h1>
            <p className="text-sm font-light text-[#7a7a9a]">{meta.subtitle}</p>
          </div>
        )}

        {/* ── Creator flow ── */}
        {!isAdvertiser && currentStepId === 'profile' && (
          <StepProfileCreator
            onNext={advance}
            defaultValues={{
              nationality: data.nationality,
              country: data.country,
              state: data.state,
              bio: data.bio,
              photo: data.photo,
            }}
          />
        )}

        {!isAdvertiser && currentStepId === 'niche' && (
          <StepNiche onNext={advance} onSkip={skip} defaultValues={{ niches: data.niches }} />
        )}

        {/* ── Advertiser flow ── */}
        {isAdvertiser && currentStepId === 'profile' && (
          <StepProfileAdvertiser
            onNext={advance}
            defaultValues={{
              logo: data.logo,
              brandName: data.brandName,
              bio: data.bio,
              country: data.country,
              state: data.state,
              city: data.city,
              website: data.website,
              monthlyBudget: data.monthlyBudget,
            }}
          />
        )}

        {isAdvertiser && currentStepId === 'industry' && (
          <StepIndustry
            onNext={advance}
            onSkip={skip}
            defaultValues={{ industries: data.industries }}
          />
        )}

        {isAdvertiser && currentStepId === 'niche' && (
          <StepNiche onNext={advance} onSkip={skip} defaultValues={{ niches: data.niches }} />
        )}

        {isAdvertiser && currentStepId === 'representative' && (
          <StepRepresentative
            onNext={advance}
            defaultValues={{
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              phone: data.phone,
            }}
          />
        )}

        {/* ── Shared steps ── */}
        {currentStepId === 'socials' && (
          <StepSocials
            onNext={advance}
            onSkip={skip}
            defaultValues={{ connected: data.connected }}
          />
        )}

        {currentStepId === 'payout' && (
          <StepPayout
            onNext={advance}
            onSkip={skip}
            defaultValues={{
              bankName: data.bankName,
              accountNumber: data.accountNumber,
            }}
          />
        )}

        {currentStepId === 'complete' && (
          <StepComplete userName={userName} onGoToDashboard={goToDashboard} />
        )}
      </div>
    </AuthLayout>
  );
}
