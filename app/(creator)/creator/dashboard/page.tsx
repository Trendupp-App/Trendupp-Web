'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CompletenessCard from '@/components/creator-dashboard/CompletenessCard';
import BannerCarousel from '@/components/creator-dashboard/BannerCarousel';
import CampaignCard from '@/components/creator-dashboard/CampaignCard';
import CampaignDetailsDrawer, {
  MappedCampaign,
} from '@/components/creator-dashboard/CampaignDetailsDrawer';
import CampaignCardSkeleton from '@/components/skeletons/CampaignCard';
import { useCampaigns } from '@/hooks/useCampaign';
import { Campaign } from '@/types/campaign';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { formatCurrency } from '@/utils/Utilities';
import { getCampaignDeadlineInfo } from '@/lib/campaignTimelineStage';
import { getCampaignBudgetRange } from '@/lib/campaignMappers';

type FilterType = 'all' | 'live' | 'past';

export default function CreatorDashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const isProfileCompleted = user?.onboardingPercentage === 100;
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedCampaign, setSelectedCampaign] = useState<MappedCampaign | null>(null);

  // Fetch campaigns from backend
  const { data: campaignsResponse, isLoading } = useCampaigns({
    status: activeFilter === 'all' ? undefined : activeFilter === 'live' ? 'live' : 'completed',
    page: 1,
    limit: 6,
  });
  const liveCampaigns = campaignsResponse?.data ?? [];

  const mappedCampaigns = liveCampaigns.map((c: Campaign) => {
    const deadline = getCampaignDeadlineInfo(c.timeline);
    const feeRange = getCampaignBudgetRange(c);
    return {
      id: c.id,
      title: c.title,
      brand: c.brand?.username || 'Unknown Brand',
      budget: formatCurrency(c.totalBudget, c.currency ?? 'NGN'),
      budgetMin: c.totalBudget,
      budgetMax: c.totalBudget,
      feeRangeLabel: feeRange.label,
      feeRangeMin: feeRange.min,
      feeRangeMax: feeRange.max,
      daysLeft: deadline.label ?? 'Closed',
      daysLeftNumber: deadline.daysRemaining,
      tier: c.creatorCategory?.name || 'Nano',
      appliedCount: c.applicationsCount?.total || 0,
      image:
        c.coverImage ||
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
      niches: c.creatorNiche?.name ? [c.creatorNiche.name] : [],
      platforms: c.preferredPlatforms?.map((p: { name: string }) => p.name) || [],
      status: (c.status === 'active' || c.status === 'live'
        ? 'live'
        : c.status === 'completed'
          ? 'past'
          : c.status) as string,
      isSocialImpact: false,
      goal: c.goal === 'Create Content' ? 'Content Creation' : 'Amplification',
      createdAt: c.createdAt,
      campaignBrief: c.campaignBrief || 'No brief provided.',
      deliverables: c.deliverables || [],
      contentDirection: c.contentDirection || [],
      contentGuidelines: c.contentGuidelines || { dos: [], donts: [] },
      usageRights: c.usageRights || '',
      successLooksLike: c.successLooksLike || '',
    };
  });

  const filteredCampaigns = mappedCampaigns.filter((campaign) => {
    if (activeFilter === 'all') return true;
    return campaign.status === activeFilter;
  });

  return (
    <div className="flex flex-col gap-8 w-full pb-12 select-none">
      {/* Welcome Message */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1.5 text-left">
          <h1 className="text-[28px] font-bold text-[#1a1a2e] tracking-tight">
            Hey, {user?.firstName || 'Creator'}
          </h1>
          <p className="text-sm font-light text-[#7a7a9a]">
            Welcome back to your creator dashboard
          </p>
        </div>
      </div>

      {/* Row 1: Banner / Completeness */}
      <div className={cn('grid gap-6 items-stretch', !isProfileCompleted && 'lg:grid-cols-12')}>
        {!isProfileCompleted && (
          <div className="lg:col-span-5">
            <CompletenessCard
              percentage={user?.onboardingPercentage || 0}
              onCompleteClick={() => router.push('/onboard')}
            />
          </div>
        )}
        <div className={cn(!isProfileCompleted && 'lg:col-span-7')}>
          <BannerCarousel />
        </div>
      </div>

      {/* Row 2: Campaigns Filters & Action Row */}
      <div className="flex flex-col gap-5 mt-2">
        {/* Filter Headers */}
        <div className="flex items-center justify-between border-b border-[#e8e6f0]/40 pb-4 overflow-hidden">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide shrink-0 max-w-full">
            {(['all', 'live', 'past'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  'px-5 py-2.5 text-xs font-semibold rounded-2xl transition-all border-none cursor-pointer shrink-0 outline-none select-none',
                  activeFilter === filter
                    ? 'bg-brand-pink text-white shadow-[0_2px_8px_rgba(215,23,111,0.15)]'
                    : 'bg-[#f0edf7]/65 text-[#5a5a7a] hover:bg-[#f0edf7]',
                )}
              >
                {filter === 'all' && 'All'}
                {filter === 'live' && 'Live Campaigns'}
                {filter === 'past' && 'Past Campaigns'}
              </button>
            ))}
          </div>
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between mt-1 mb-0.5">
          <div className="flex items-center gap-2 text-[#1a1a2e]">
            <span className="text-base sm:text-lg">🔥</span>
            <h3 className="text-base font-bold tracking-tight">
              {activeFilter === 'past' ? 'Past Campaigns' : 'Live Campaigns'}
            </h3>
          </div>
          <button
            onClick={() => router.push('/creator/explore')}
            className="flex items-center gap-1 text-xs font-semibold text-brand-pink hover:underline cursor-pointer border-none bg-transparent outline-none"
          >
            <span>See all</span>
            <span className="text-[10px] font-bold">&gt;</span>
          </button>
        </div>

        {/* Dynamic Display based on Active Filter */}
        {isLoading ? (
          <div>
            {/* Mobile View Skeleton */}
            <div className="lg:hidden flex flex-col gap-4 w-full pb-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <CampaignCardSkeleton key={i} />
              ))}
            </div>
            {/* Desktop View Skeleton */}
            <div className="hidden lg:grid lg:grid-cols-3 gap-x-6 gap-y-4 w-full pb-4 select-none">
              {Array.from({ length: 3 }).map((_, i) => (
                <CampaignCardSkeleton key={i} />
              ))}
            </div>
          </div>
        ) : (
          <div>
            {/* Mobile View */}
            <div className="lg:hidden w-full select-none">
              {activeFilter === 'all' ? (
                /* Horizontal scrolling list for "All" active tab */
                <div className="flex flex-row overflow-x-auto gap-4 w-full pb-4 scrollbar-hide">
                  {filteredCampaigns.map((campaign) => (
                    <div
                      key={campaign.id}
                      className="w-[220px] shrink-0 cursor-pointer"
                      onClick={() => setSelectedCampaign(campaign)}
                    >
                      <CampaignCard
                        title={campaign.title}
                        brand={campaign.brand}
                        budget={campaign.budget}
                        daysLeft=""
                        tier={campaign.tier}
                        appliedCount={campaign.appliedCount}
                        image={campaign.image}
                        hideApplied={true}
                        status={campaign.status}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                /* Vertical stack list for "Live" or "Past" active tabs */
                <div className="flex flex-col gap-4 w-full pb-4">
                  {filteredCampaigns.map((campaign) => (
                    <div
                      key={campaign.id}
                      className="w-full cursor-pointer"
                      onClick={() => setSelectedCampaign(campaign)}
                    >
                      <CampaignCard
                        title={campaign.title}
                        brand={campaign.brand}
                        budget={campaign.budget}
                        daysLeft={campaign.daysLeft}
                        tier={campaign.tier}
                        appliedCount={campaign.appliedCount}
                        image={campaign.image}
                        status={campaign.status}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop View: Grid for all tabs */}
            <div className="hidden lg:grid lg:grid-cols-3 gap-x-6 gap-y-4 w-full pb-4 select-none">
              {filteredCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="w-full cursor-pointer"
                  onClick={() => setSelectedCampaign(campaign)}
                >
                  <CampaignCard
                    title={campaign.title}
                    brand={campaign.brand}
                    budget={campaign.budget}
                    daysLeft={campaign.daysLeft}
                    tier={campaign.tier}
                    appliedCount={campaign.appliedCount}
                    image={campaign.image}
                    status={campaign.status}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <CampaignDetailsDrawer
        isOpen={!!selectedCampaign}
        onClose={() => setSelectedCampaign(null)}
        campaign={
          selectedCampaign
            ? mappedCampaigns.find((c) => c.id === selectedCampaign.id) || selectedCampaign
            : null
        }
      />
    </div>
  );
}
