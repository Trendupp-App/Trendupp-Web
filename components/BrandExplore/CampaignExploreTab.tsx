'use client';

import CampaignCard from '@/components/create-campaign/CampaignCard';
import type { Campaign } from '@/types/campaign';
import CampaignDetailsSheet from '@/components/BrandExplore/CampaignDetailsSheet';
import { useState } from 'react';

interface CampaignsExploreTabProps {
  campaigns?: Campaign[];
  isLoading: boolean;
  isError: boolean;
}

export default function CampaignsExploreTab({
  campaigns,
  isLoading,
  isError,
}: CampaignsExploreTabProps) {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  function handleViewDetails(campaign: Campaign) {
    setSelectedCampaignId(campaign.id);
    setSheetOpen(true);
  }
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-64 bg-[#f5f4fa] rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-sm text-[#9a99b0] text-center py-10">
        Could not load campaigns. Please try again.
      </p>
    );
  }

  if (!campaigns || campaigns.length === 0) {
    return (
      <p className="text-sm text-[#9a99b0] text-center py-10">
        No live campaigns right now. Check back soon.
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaigns.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} onViewDetails={handleViewDetails} />
        ))}
      </div>
      <CampaignDetailsSheet
        campaignId={selectedCampaignId}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </>
  );
}
