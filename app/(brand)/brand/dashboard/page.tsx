'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import ProfileCompletenessCard from '@/components/brand-dashboard/ProfileCheckCard';
import BrandBannerCarousel from '@/components/brand-dashboard/BrandCarousel';
import BrandCampaignSections from '@/components/brand-dashboard/BrandCampaignSection';
import TopCreatorsSection from '@/components/brand-dashboard/TopCreators';
import TopNewsSection from '@/components/brand-dashboard/NewsSection';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function BrandDashboardPage() {
  const user = useAuthStore((s) => s.user);

  const firstName = user?.firstName ?? 'there';
  const onboardingPercentage = user?.onboardingPercentage ?? 0;
  const isProfileComplete = onboardingPercentage >= 100;

  const stepsCompleted = user?.onboardingStepsCompleted
    ? Object.values(user.onboardingStepsCompleted).filter(Boolean).length
    : 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-light text-[#1a1a2e]">
            {getGreeting()}, {firstName} 👋
          </h1>
          <p className="text-sm text-[#9a99b0] mt-0.5">
            Here&apos;s what&apos;s happening with your brand today.
          </p>
        </div>

        <Link
          href="/brand/campaign/create"
          className="flex cursor-pointer items-center gap-2 px-4 py-2.5 bg-brand-pink text-white text-sm font-light rounded-md hover:bg-brand-pink/90 transition-colors shrink-0 shadow-sm"
        >
          <Plus size={16} />
          New campaign
        </Link>
      </div>

      {/* Hero row: profile completeness (conditional) + banner */}
      {isProfileComplete ? (
        /* Full-width banner when profile is complete */
        <BrandBannerCarousel />
      ) : (
        /* Split: completeness card + banner */
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-start">
          <ProfileCompletenessCard
            percentage={onboardingPercentage}
            stepsCompleted={stepsCompleted}
          />
          <div className="hidden md:block w-[420px] shrink-0">
            <BrandBannerCarousel />
          </div>
        </div>
      )}

      {/* Campaign sections */}
      <BrandCampaignSections isProfileComplete={isProfileComplete} />

      {/* Bottom row: top creators + top news */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TopCreatorsSection />
        <TopNewsSection />
      </div>
    </div>
  );
}
