'use client';

import SocialCampaignCard from '@/components/creator-dashboard/SocialCampaignCard';
import CampaignCardSkeleton from '@/components/skeletons/CampaignCard';
import { useCreatorCategories } from '@/hooks/useCampaign';
import { getCampaignDeadlineInfo } from '@/lib/campaignTimelineStage';
import { getRewardTokensForTier } from '@/constants/creatorTiers';
import { useAuthStore } from '@/store/authStore';
import type { CampaignApplicationDto, SocialImpactSubmission } from '@/types/campaign';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80';

function statusBadge(status: CampaignApplicationDto['status']) {
  if (status === 'accepted') return { label: 'Accepted', className: 'bg-[#e6f9f1] text-[#00c37b]' };
  if (status === 'rejected') return { label: 'Rejected', className: 'bg-[#fef2f2] text-[#dc2626]' };
  return { label: 'Pending', className: 'bg-[#fffbeb] text-[#d97706]' };
}

export function getLiveLinkSubmission(
  app: CampaignApplicationDto,
): SocialImpactSubmission | undefined {
  const submissions = (app.submissions ?? []) as SocialImpactSubmission[];
  return submissions.find((s) => s?.liveLink?.link);
}

export default function SocialImpactWorkGrid({
  applications,
  isLoading,
  onViewBrief,
  onSubmitLiveLink,
}: {
  applications: CampaignApplicationDto[];
  isLoading: boolean;
  onViewBrief: (campaignId: string) => void;
  onSubmitLiveLink: (application: CampaignApplicationDto) => void;
}) {
  const { user } = useAuthStore();
  const { data: creatorCategories = [] } = useCreatorCategories();
  const myRewardTokens = getRewardTokensForTier(creatorCategories, user?.assignedTier);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
      {isLoading ? (
        Array.from({ length: 3 }).map((_, i) => <CampaignCardSkeleton key={i} />)
      ) : applications.length > 0 ? (
        applications.map((app) => {
          const campaign = app.campaign;
          const deadline = getCampaignDeadlineInfo(campaign?.timeline);
          const badge = statusBadge(app.status);
          const submission = getLiveLinkSubmission(app);

          return (
            <SocialCampaignCard
              key={app.id}
              title={campaign?.title || 'Untitled campaign'}
              brand={campaign?.brand?.username || 'Trendupp'}
              daysLeft={deadline.label ?? undefined}
              tokens={`${myRewardTokens} Tokens`}
              image={campaign?.coverImage || FALLBACK_IMAGE}
              badgeLabel={badge.label}
              badgeClassName={badge.className}
              hasApplied={!!submission}
              participateLabel="Send live link"
              appliedLabel="Submitted"
              onParticipate={() => onSubmitLiveLink(app)}
              onViewBrief={() => campaign?.id && onViewBrief(campaign.id)}
            />
          );
        })
      ) : (
        <div className="col-span-full flex flex-col items-center justify-center p-12 border border-[#e8e6f0]/50 rounded-[32px] bg-white min-h-[300px]">
          <span className="text-xs text-[#7a7a9a] font-medium">
            No Social Impact campaigns under this filter
          </span>
        </div>
      )}
    </div>
  );
}
