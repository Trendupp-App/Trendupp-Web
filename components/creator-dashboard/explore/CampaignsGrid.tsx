'use client';

import CampaignCard from '@/components/creator-dashboard/CampaignCard';
import CampaignCardSkeleton from '@/components/skeletons/CampaignCard';
import type { MappedExploreCampaign } from '@/lib/campaignMappers';

export default function CampaignsGrid({
  campaigns,
  isLoading,
  onSelect,
}: {
  campaigns: MappedExploreCampaign[];
  isLoading: boolean;
  onSelect: (campaign: MappedExploreCampaign) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
      {isLoading ? (
        Array.from({ length: 6 }).map((_, i) => <CampaignCardSkeleton key={i} />)
      ) : campaigns.length > 0 ? (
        campaigns.map((campaign) => (
          <div key={campaign.id} onClick={() => onSelect(campaign)} className="cursor-pointer">
            <CampaignCard
              title={campaign.title}
              brand={campaign.brand}
              budget={campaign.budget}
              daysLeft={campaign.daysLeft}
              tier={campaign.tier}
              appliedCount={campaign.appliedCount}
              image={campaign.image}
              status={campaign.status}
              hasApplied={campaign.hasApplied}
              goal={campaign.goal}
            />
          </div>
        ))
      ) : (
        <div className="col-span-full flex flex-col items-center justify-center py-20 text-[#9a99b0] gap-2">
          <span className="text-sm">No campaigns found</span>
        </div>
      )}
    </div>
  );
}
