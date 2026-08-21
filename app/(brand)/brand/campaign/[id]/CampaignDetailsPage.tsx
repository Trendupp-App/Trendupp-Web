'use client';

import { useParams } from 'next/navigation';
import { useCampaign } from '@/hooks/useCampaign';
import CampaignDetailHeader from '@/components/campaign-details/CampaignDetailHeader';
import CampaignStatsRow from '@/components/campaign-details/CampaignStatsRow';
import CampaignDetailSkeleton from '@/components/skeletons/CampaignDetailsSkeleton';
import LiveCampaignDetail from '@/components/campaign-details/LiveCampaignDetails';
import ActiveCampaignDetail from '@/components/campaign-details/ActiveCampaignDetail';

export default function CampaignDetailPage() {
  const params = useParams<{ id: string }>();
  const { data: campaign, isLoading } = useCampaign(params.id);

  if (isLoading || !campaign) {
    return <CampaignDetailSkeleton />;
  }

  return (
    <div className="max-w-[900px] mx-auto px-6 py-8">
      <CampaignDetailHeader campaign={campaign} />
      <CampaignStatsRow campaign={campaign} />

      {campaign.status === 'active' ? (
        <ActiveCampaignDetail campaign={campaign} />
      ) : (
        <LiveCampaignDetail campaign={campaign} />
      )}
    </div>
  );
}
