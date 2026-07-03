'use client';

import Link from 'next/link';
import { Plus, Megaphone } from 'lucide-react';
import CampaignCard from '@/components/create-campaign/CampaignCard';
import CampaignCardSkeleton from '@/components/skeletons/CampaignCard';
import { useMyCampaigns } from '@/hooks/useCampaign';

interface CampaignSectionProps {
  isLoading: boolean;
  campaigns: ReturnType<typeof useMyCampaigns>['data'];
  title: string;
  subtitle: string;
  seeAllHref: string;
  showPlaceholderWhenEmpty?: boolean;
}

function CampaignSection({
  isLoading,
  campaigns = [],
  title,
  subtitle,
  seeAllHref,
  showPlaceholderWhenEmpty = false,
}: CampaignSectionProps) {
  const isEmpty = !isLoading && campaigns.length === 0;

  // Active campaigns: just hide the section when there's nothing to show.
  if (isEmpty && !showPlaceholderWhenEmpty) return null;

  return (
    <section>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-[#1a1a2e]">{title}</h2>
          <p className="text-sm text-[#9a99b0] mt-0.5">{subtitle}</p>
        </div>
        {!isEmpty && (
          <Link
            href={seeAllHref}
            className="text-sm text-[#9a99b0] hover:text-brand-pink transition-colors shrink-0 mt-1"
          >
            See all
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <CampaignCardSkeleton key={i} />
          ))}
        </div>
      ) : isEmpty ? (
        <CreateCampaignPlaceholder />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {campaigns.map((c) => (
            <CampaignCard key={c.id} campaign={c} />
          ))}
        </div>
      )}
    </section>
  );
}

function CreateCampaignPlaceholder() {
  return (
    <div className="w-full border border-dashed border-[#e0ddef] rounded-2xl flex flex-col items-center justify-center py-16 gap-4 bg-white/60">
      <div className="w-14 h-14 rounded-full bg-[#fef2f6] flex items-center justify-center">
        <Megaphone size={24} className="text-brand-pink" />
      </div>
      <div className="flex flex-col items-center gap-1 text-center">
        <p className="text-sm font-medium text-[#1a1a2e]">No live campaigns yet</p>
        <p className="text-sm text-[#9a99b0]">
          Create a campaign to start receiving applications from creators.
        </p>
      </div>
      <Link
        href="/brand/campaign/create"
        className="flex items-center gap-2 px-4 py-2.5 bg-brand-pink text-white text-sm font-medium rounded-lg hover:bg-brand-pink/90 transition-colors shadow-sm"
      >
        <Plus size={16} />
        New campaign
      </Link>
    </div>
  );
}

interface BrandCampaignSectionsProps {
  isProfileComplete?: boolean;
}

export default function BrandCampaignSections({
  isProfileComplete = true,
}: BrandCampaignSectionsProps) {
  // const {data} = useMyCampaigns();
  // console.log("data campaigns:", data);
  const { data: activeCampaigns = [], isLoading: activeLoading } = useMyCampaigns(
    'active',
    isProfileComplete,
  );
  const { data: liveCampaigns = [], isLoading: liveLoading } = useMyCampaigns(
    'live',
    isProfileComplete,
  );

  if (!isProfileComplete) {
    return (
      <section>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-[#1a1a2e]">Live Campaigns</h2>
            <p className="text-sm text-[#9a99b0] mt-0.5">
              Published and currently accepting creator applications
            </p>
          </div>
        </div>

        <div className="w-full border border-dashed border-[#e0ddef] rounded-2xl flex flex-col items-center justify-center py-16 gap-3 bg-white/60">
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#c4c2d4"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <p className="text-sm text-[#9a99b0]">
            Complete your brand profile first to unlock campaigns.
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Active campaigns — hidden entirely when empty */}
      <CampaignSection
        isLoading={activeLoading}
        campaigns={activeCampaigns}
        title="Active campaigns"
        subtitle="Creators selected • Content being created"
        seeAllHref="/brand/campaign?tab=active"
      />

      {/* Live campaigns — show create-campaign placeholder when empty */}
      <CampaignSection
        isLoading={liveLoading}
        campaigns={liveCampaigns}
        title="Live Campaigns"
        subtitle="Published and currently accepting creator applications"
        seeAllHref="/brand/campaign?tab=live"
        showPlaceholderWhenEmpty
      />
    </>
  );
}
