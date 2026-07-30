'use client';

import SocialCampaignCard from '@/components/creator-dashboard/SocialCampaignCard';
import CampaignCardSkeleton from '@/components/skeletons/CampaignCard';
import { useCreatorCategories, useParticipateSocialImpact } from '@/hooks/useCampaign';
import { getCampaignDeadlineInfo } from '@/lib/campaignTimelineStage';
import { getRewardTokensForTier } from '@/constants/creatorTiers';
import { useAuthStore } from '@/store/authStore';
import type { Campaign, CampaignApplicationDto } from '@/types/campaign';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80';

function SocialImpactCardItem({
  campaign,
  hasApplied,
  myRewardTokens,
  onViewBrief,
  onParticipated,
}: {
  campaign: Campaign;
  hasApplied: boolean;
  myRewardTokens: number;
  onViewBrief: (campaign: Campaign) => void;
  onParticipated: (campaign: Campaign, application?: CampaignApplicationDto) => void;
}) {
  const participate = useParticipateSocialImpact((application) =>
    onParticipated(campaign, application),
  );
  const deadline = getCampaignDeadlineInfo(campaign.timeline);

  return (
    <SocialCampaignCard
      title={campaign.title}
      brand={campaign.brand?.username || 'Trendupp'}
      daysLeft={deadline.label ?? undefined}
      tokens={`${myRewardTokens} Tokens`}
      image={campaign.coverImage || FALLBACK_IMAGE}
      isParticipating={participate.isPending}
      hasApplied={hasApplied}
      onParticipate={() => participate.mutate(campaign.id)}
      onViewBrief={() => onViewBrief(campaign)}
    />
  );
}

export default function SocialImpactGrid({
  campaigns,
  isLoading,
  appliedCampaignIds,
  onViewBrief,
  onParticipated,
}: {
  campaigns: Campaign[];
  isLoading: boolean;
  appliedCampaignIds: Set<string>;
  onViewBrief: (campaign: Campaign) => void;
  onParticipated: (campaign: Campaign, application?: CampaignApplicationDto) => void;
}) {
  const { user } = useAuthStore();
  const { data: creatorCategories = [] } = useCreatorCategories();
  const myRewardTokens = getRewardTokensForTier(creatorCategories, user?.assignedTier);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
      {isLoading ? (
        Array.from({ length: 6 }).map((_, i) => <CampaignCardSkeleton key={i} />)
      ) : campaigns.length > 0 ? (
        campaigns.map((campaign) => (
          <SocialImpactCardItem
            key={campaign.id}
            campaign={campaign}
            hasApplied={appliedCampaignIds.has(campaign.id)}
            myRewardTokens={myRewardTokens}
            onViewBrief={onViewBrief}
            onParticipated={onParticipated}
          />
        ))
      ) : (
        <div className="col-span-full flex flex-col items-center justify-center py-20 text-[#9a99b0] gap-2">
          <span className="text-sm">No Social Impact campaigns right now</span>
        </div>
      )}
    </div>
  );
}
