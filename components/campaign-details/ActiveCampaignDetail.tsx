'use client';

import { useState } from 'react';
import ActiveCampaignTabs from './ActiveCampaignTabs';
import CampaignOverviewTab from './CampaignOverviewTab';
import CampaignDeliverablesTab from './CampaignDeliverableTab';
import CampaignTimelineTab from './CampaignTimelineTab';
import type { Campaign } from '@/types/campaign';

type ActiveTab = 'overview' | 'deliverables' | 'timeline';

export default function ActiveCampaignDetail({ campaign }: { campaign: Campaign }) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  return (
    <>
      <ActiveCampaignTabs activeTab={activeTab} onChange={setActiveTab} />
      {activeTab === 'overview' && <CampaignOverviewTab campaign={campaign} />}
      {activeTab === 'deliverables' && <CampaignDeliverablesTab campaign={campaign} />}
      {activeTab === 'timeline' && <CampaignTimelineTab campaign={campaign} />}
    </>
  );
}
