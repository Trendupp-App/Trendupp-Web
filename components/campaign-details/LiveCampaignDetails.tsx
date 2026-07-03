'use client';

import { useState } from 'react';
import CampaignDetailTabs from './CampaignDetailsTab';
import CampaignOverviewTab from './CampaignOverviewTab';
import ApplicationsTab from './ApplicationsTab';
import type { Campaign } from '@/types/campaign';

type DetailTab = 'overview' | 'applications';

export default function LiveCampaignDetail({ campaign }: { campaign: Campaign }) {
  const [activeTab, setActiveTab] = useState<DetailTab>('overview');
  return (
    <>
      <CampaignDetailTabs
        activeTab={activeTab}
        onChange={setActiveTab}
        applicationsCount={campaign?.applications?.length || 0}
      />
      {activeTab === 'overview' ? (
        <CampaignOverviewTab campaign={campaign} />
      ) : (
        <ApplicationsTab
          campaignId={campaign.id}
          applicationsForLive={campaign.applications}
          campaignTitle={campaign.title}
        />
      )}
    </>
  );
}
