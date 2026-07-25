'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';
import StepIndustry from '@/components/onboarding/advertiser/StepIndustry';

// Creator steps
import StepProfileCreator from '@/components/onboarding/creator/StepCreatorProfile';
import StepNiche from '@/components/onboarding/creator/StepNiche';
import StepComplete from '@/components/onboarding/creator/StepComplete';

// Advertiser steps
import StepRepresentative from '@/components/onboarding/advertiser/StepRepresentativeForm';

import StepSocials from '@/components/onboarding/creator/StepSocialsConnect';
import StepPayout from '@/components/onboarding/creator/StepPayout';

import type { CreatorOnboardingData, AdvertiserOnboardingData } from '@/types/Onboarding';
import StepBrandProfile from '@/components/onboarding/advertiser/StepBrandProfile';
import { useAuthStore } from '@/store/authStore';
import { getResumeStepIndex } from '@/lib/resume';
import {
  useOnboardingDraft,
  readOnboardingDraft,
  clearOnboardingDraft,
} from '@/hooks/useOnboardingDraft';

type CreatorStepId = 'profile' | 'niche' | 'socials' | 'payout' | 'complete';
type AdvertiserStepId =
  | 'profile'
  | 'industry'
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
    subtitle: 'Choose a minimum of 1 and a maximum of 3 Niches',
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
    subtitle: 'Choose a minimum of 1, and a maximum of 3 industries for your brand',
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
  const user = useAuthStore((s) => s.user);
  const userType = (params.get('type') ?? user?.role ?? 'creator') as 'creator' | 'brand';
  const userName = params.get('name') ?? undefined;

  const isAdvertiser = userType === 'brand';
  const steps: StepId[] = isAdvertiser ? ADVERTISER_STEPS : CREATOR_STEPS;
  const stepMeta = isAdvertiser ? ADVERTISER_STEP_META : CREATOR_STEP_META;

  const draft = readOnboardingDraft<OnboardingData>(user?.id);
  const serverResumeIndex = getResumeStepIndex(steps, user?.onboardingStepsCompleted, isAdvertiser);

  const [stepIndex, setStepIndex] = useState(() =>
    Math.max(draft?.stepIndex ?? 0, serverResumeIndex),
  );

  const [data, setData] = useState<OnboardingData>(() => ({
    username: user?.username ?? undefined,
    bio: user?.bio ?? undefined,
    photo: user?.avatarUrl ?? undefined,
    niches: user?.niches?.map((n) => n.id),
    industries: user?.industries?.map((i) => i.id),
    bankName: user?.bankName ?? undefined,
    bankAccountNumber: user?.bankAccountNumber ?? undefined,
    bankAccountName: user?.bankAccountName ?? undefined,
    ...draft?.data, // unsaved keystrokes win over the server snapshot
  }));

  useOnboardingDraft(user?.id, { stepIndex, data });

  const currentStepId = steps[stepIndex];
  const isComplete = currentStepId === 'complete';

  useEffect(() => {
    if (currentStepId === 'complete') clearOnboardingDraft(user?.id);
  }, [currentStepId, user?.id]);
  // Don't count 'complete' as a numbered step
  const numberedSteps = steps.filter((s): s is Exclude<StepId, 'complete'> => s !== 'complete');
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
    const role = user?.role ?? userType;
    router.push(role === 'brand' ? '/brand/dashboard' : '/creator/dashboard');
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
              username: data.username,
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
          <StepBrandProfile
            onNext={advance}
            defaultValues={{
              logo: data.avatarUrl,
              // brandName: data.brandName,
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
              bankId: data.bankId,
              accountNumber: data.accountNumber,
              bankAccountName: data.bankAccountName,
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
