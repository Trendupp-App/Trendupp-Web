'use client';

import { useState } from 'react';
import CampaignDetailTabs from './CampaignDetailsTab';
import CampaignOverviewTab from './CampaignOverviewTab';
import ApplicationsTab from './ApplicationsTab';
import CampaignTimelineTab from './CampaignTimelineTab';
import type { Campaign } from '@/types/campaign';

type DetailTab = 'overview' | 'applications' | 'timeline';

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
      ) : activeTab === 'applications' ? (
        <ApplicationsTab
          campaignId={campaign.id}
          applicationsForLive={campaign.applications}
          campaignTitle={campaign.title}
          campaignCurrency={campaign.currency}
        />
      ) : (
        <CampaignTimelineTab campaign={campaign} />
      )}
    </>
  );
}
