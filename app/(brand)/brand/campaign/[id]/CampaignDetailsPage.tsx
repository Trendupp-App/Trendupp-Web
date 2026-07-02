'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import CampaignDetailHeader from '@/components/campaign-details/CampaignDetailHeader';
import CampaignStatsRow from '@/components/campaign-details/CampaignStatsRow';
import CampaignDetailTabs from '@/components/campaign-details/CampaignDetailsTab';
import CampaignOverviewTab from '@/components/campaign-details/CampaignOverviewTab';
import ApplicationsTab from '@/components/campaign-details/ApplicationsTab';
import { useCampaign } from '@/hooks/useCampaign';
import { DUMMY_APPLICATIONS } from '@/dummy/applicants';
import CampaignDetailSkeleton from '@/components/skeletons/CampaignDetailsSkeleton';

type DetailTab = 'overview' | 'applications';

export default function CampaignDetailPage() {
  const params = useParams<{ id: string }>();
  const { data: campaign, isLoading } = useCampaign(params.id);
  const [activeTab, setActiveTab] = useState<DetailTab>('overview');

  if (isLoading || !campaign) {
    return <CampaignDetailSkeleton />;
  }

  const applications = DUMMY_APPLICATIONS;

  return (
    <div className="max-w-[900px] mx-auto px-6 py-8">
      <CampaignDetailHeader campaign={campaign} />
      <CampaignStatsRow campaign={campaign} applicantsCount={applications.length} />
      <CampaignDetailTabs
        activeTab={activeTab}
        onChange={setActiveTab}
        applicationsCount={applications.length}
      />

      {activeTab === 'overview' ? (
        <CampaignOverviewTab campaign={campaign} />
      ) : (
        <ApplicationsTab applications={applications} campaignTitle={campaign.title} />
      )}
    </div>
  );
}
