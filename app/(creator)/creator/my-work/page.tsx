'use client';
import { useState } from 'react';
import WorkTabs from '@/components/dashboard/my-work/WorkTabs';
import WorkCampaignCard, { WorkCampaign } from '@/components/creator-dashboard/WorkCampaignCard';
import WorkDetailsDrawer from '@/components/creator-dashboard/WorkDetailsDrawer';
import SubmitContentModal from '@/components/dashboard/my-work/SubmitContentModal';
import SubmitProofModal from '@/components/dashboard/my-work/SubmitProofModal';
import CampaignFilterModal, {
  FilterState,
} from '@/components/creator-dashboard/CampaignFilterModal';

const INITIAL_CAMPAIGNS: WorkCampaign[] = [
  {
    id: 1,
    title: 'Summer Style Collection 2025',
    brand: 'Zara Africa',
    budgetMinMax: '₦150K–₦300K',
    budgetString: '₦150,000 – 300,000',
    daysLeft: '5d 14h',
    status: 'In progress',
    platform: 'Instagram',
    tier: 'Micro',
    guidelines:
      'Create your content off-platform, then return to submit the link for brand review. Keep your content within the brief guidelines. Submit content within the next 3-5 days.',
    image:
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    title: 'Summer Style Collection 2025',
    brand: 'Zara Africa',
    budgetMinMax: '₦150K–₦300K',
    budgetString: '₦150,000 – 300,000',
    daysLeft: '4d 12h',
    status: 'Under review',
    platform: 'Instagram',
    tier: 'Micro',
    guidelines:
      "The brand has up to 48 hours to review your submission. You'll receive a push notification with their decision.",
    image:
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    title: 'Summer Style Collection 2025',
    brand: 'Zara Africa',
    budgetMinMax: '₦150K–₦300K',
    budgetString: '₦150,000 – 300,000',
    daysLeft: '3d 8h',
    status: 'Revision requested',
    platform: 'Instagram',
    tier: 'Micro',
    guidelines: 'Please adjust lighting and duration.',
    revisionComment:
      'The video needs to clearly show the front camera quality. Please reshoot the selfie segment with better lighting. Duration should be exactly 45 seconds.',
    image:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    title: 'Summer Style Collection 2025',
    brand: 'Zara Africa',
    budgetMinMax: '₦150K–₦300K',
    budgetString: '₦150,000 – 300,000',
    daysLeft: '2d 6h',
    status: 'Approved',
    platform: 'Instagram',
    tier: 'Micro',
    guidelines:
      'Publish your content on YouTube, then come back to submit proof of posting. The post must stay live for 24 hours before payment is released.',
    image:
      'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 5,
    title: 'Summer Style Collection 2026',
    brand: 'Zara Africa',
    budgetMinMax: '₦150K–₦300K',
    budgetString: '₦150,000 – 300,000',
    daysLeft: '4d',
    status: 'Selected',
    platform: 'Instagram',
    tier: 'Micro',
    guidelines: 'Awaiting your acceptance of this offer.',
    image:
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 6,
    title: 'Summer Style Collection 2025',
    brand: 'Zara Africa',
    budgetMinMax: '₦150K–₦300K',
    budgetString: '₦150,000 – 300,000',
    daysLeft: '6d',
    status: 'Pending',
    platform: 'Instagram',
    tier: 'Micro',
    guidelines: 'Awaiting brand decision.',
    image:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 7,
    title: 'Summer Style Collection 2025',
    brand: 'Zara Africa',
    budgetMinMax: '₦150K–₦300K',
    budgetString: '₦150,000 – 300,000',
    daysLeft: '0d',
    status: 'Declined',
    platform: 'Instagram',
    tier: 'Micro',
    guidelines: 'Sorry you have not been selected.',
    image:
      'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 8,
    title: 'Summer Style Collection 2025',
    brand: 'Zara Africa',
    budgetMinMax: '₦150K–₦250K',
    budgetString: '₦150,000 – 250,000',
    daysLeft: '0d',
    status: 'Payment released',
    platform: 'Instagram',
    tier: 'Micro',
    guidelines: 'Payment released.',
    actualAmount: 250000,
    escrowReleaseDate: 'June 28, 2026',
    image:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
  },
];

type PrimaryTab = 'Active' | 'Applied' | 'Done';

export default function MyWorkPage() {
  const [campaigns, setCampaigns] = useState<WorkCampaign[]>(INITIAL_CAMPAIGNS);
  const [activeTab, setActiveTab] = useState<PrimaryTab>('Active');
  const [activeSubFilter, setActiveSubFilter] = useState<string>('All');

  const [selectedCampaign, setSelectedCampaign] = useState<WorkCampaign | null>(null);

  // Submit content modal states
  const [submitLinkCampaign, setSubmitLinkCampaign] = useState<WorkCampaign | null>(null);
  // Submit proof modal states
  const [submitProofCampaign, setSubmitProofCampaign] = useState<WorkCampaign | null>(null);

  // Filter modal states
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    sortBy: 'Newest',
    platforms: [],
    niches: [],
    campaignGoal: null,
  });

  // Handle link submission (moves campaign to "Under Review")
  const handleSubmitLink = (_link: string) => {
    if (submitLinkCampaign) {
      setCampaigns((prev) =>
        prev.map((c) => (c.id === submitLinkCampaign.id ? { ...c, status: 'Under review' } : c)),
      );
      setSubmitLinkCampaign(null);
    }
  };

  // Handle proof submission (moves campaign to "Payment Released")
  const handleSubmitProof = (_link: string) => {
    if (submitProofCampaign) {
      setCampaigns((prev) =>
        prev.map((c) =>
          c.id === submitProofCampaign.id
            ? {
                ...c,
                status: 'Payment released',
                actualAmount: 250000,
                escrowReleaseDate: 'June 28, 2026',
              }
            : c,
        ),
      );
      setSubmitProofCampaign(null);
    }
  };

  const handleAcceptOffer = (campaign: WorkCampaign) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === campaign.id ? { ...c, status: 'In progress' } : c)),
    );
  };

  const handleDeclineOffer = (campaign: WorkCampaign) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === campaign.id ? { ...c, status: 'Declined' } : c)),
    );
  };

  // Compute counts dynamically
  const activeCount = campaigns.filter((c) =>
    ['In progress', 'Under review', 'Revision requested', 'Approved'].includes(c.status),
  ).length;

  const appliedCount = campaigns.filter((c) =>
    ['Selected', 'Pending', 'Declined'].includes(c.status),
  ).length;

  const doneCount = campaigns.filter((c) => c.status === 'Payment released').length;

  const counts = {
    active: activeCount,
    applied: appliedCount,
    done: doneCount,
    activeSub: {
      All: activeCount,
      'In Progress': campaigns.filter((c) => c.status === 'In progress').length,
      'Pending Approval': campaigns.filter((c) => c.status === 'Under review').length,
      Revision: campaigns.filter((c) => c.status === 'Revision requested').length,
      Approved: campaigns.filter((c) => c.status === 'Approved').length,
    },
    appliedSub: {
      All: appliedCount,
      Accepted: campaigns.filter((c) => c.status === 'Selected').length,
      Pending: campaigns.filter((c) => c.status === 'Pending').length,
      Rejected: campaigns.filter((c) => c.status === 'Declined').length,
    },
  };

  // Filter campaigns depending on tab and sub-pill selection
  const filteredCampaigns = campaigns.filter((c) => {
    // Platform and niche checks from filter modal
    if (filters.platforms.length > 0 && !filters.platforms.includes(c.platform)) {
      return false;
    }

    if (activeTab === 'Active') {
      const isActive = ['In progress', 'Under review', 'Revision requested', 'Approved'].includes(
        c.status,
      );
      if (!isActive) return false;

      if (activeSubFilter === 'In Progress') return c.status === 'In progress';
      if (activeSubFilter === 'Pending Approval') return c.status === 'Under review';
      if (activeSubFilter === 'Revision') return c.status === 'Revision requested';
      if (activeSubFilter === 'Approved') return c.status === 'Approved';
      return true;
    }

    if (activeTab === 'Applied') {
      const isApplied = ['Selected', 'Pending', 'Declined'].includes(c.status);
      if (!isApplied) return false;

      if (activeSubFilter === 'Accepted') return c.status === 'Selected';
      if (activeSubFilter === 'Pending') return c.status === 'Pending';
      if (activeSubFilter === 'Rejected') return c.status === 'Declined';
      return true;
    }

    if (activeTab === 'Done') {
      return c.status === 'Payment released';
    }

    return true;
  });

  return (
    <div className="flex flex-col gap-6 w-full pb-12 select-none">
      {/* Page Title & Subtitle */}
      <div className="flex flex-col gap-1">
        <h1 className="text-[28px] font-bold text-[#1a1a2e]">My work</h1>
        <p className="text-sm font-light text-[#7a7a9a]">
          Track your active campaigns and earnings
        </p>
      </div>

      {/* Tabs System Component */}
      <WorkTabs
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setActiveSubFilter('All');
        }}
        activeSubFilter={activeSubFilter}
        onSubFilterChange={setActiveSubFilter}
        counts={counts}
        onFilterClick={() => setIsFilterOpen(true)}
      />

      {/* Campaign Cards Grid */}
      {filteredCampaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
          {filteredCampaigns.map((campaign) => (
            <WorkCampaignCard
              key={campaign.id}
              campaign={campaign}
              onShowMoreInfo={(c) => setSelectedCampaign(c)}
              onSubmitLink={(c) => setSubmitLinkCampaign(c)}
              onSubmitProof={(c) => setSubmitProofCampaign(c)}
              onAcceptOffer={handleAcceptOffer}
              onDeclineOffer={handleDeclineOffer}
              isSelected={selectedCampaign?.id === campaign.id}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 border border-[#e8e6f0]/50 rounded-[32px] bg-white mt-2 min-h-[300px]">
          <span className="text-xs text-[#7a7a9a] font-medium">
            No campaigns found under this filter
          </span>
        </div>
      )}

      {/* Campaign Details slide-out drawer */}
      <WorkDetailsDrawer
        isOpen={!!selectedCampaign}
        onClose={() => setSelectedCampaign(null)}
        campaign={selectedCampaign}
        onSubmitLink={(c) => {
          setSelectedCampaign(null);
          setSubmitLinkCampaign(c);
        }}
        onSubmitProof={(c) => {
          setSelectedCampaign(null);
          setSubmitProofCampaign(c);
        }}
      />

      {/* Submit Draft Link Modal */}
      <SubmitContentModal
        isOpen={!!submitLinkCampaign}
        campaign={submitLinkCampaign}
        onClose={() => setSubmitLinkCampaign(null)}
        onSubmit={handleSubmitLink}
      />

      {/* Submit Proof of Posting Modal */}
      <SubmitProofModal
        isOpen={!!submitProofCampaign}
        campaign={submitProofCampaign}
        onClose={() => setSubmitProofCampaign(null)}
        onSubmit={handleSubmitProof}
      />

      {/* Side Filters Modal Drawer */}
      <CampaignFilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={(f) => {
          setFilters(f);
          setIsFilterOpen(false);
        }}
        onReset={() => {
          setFilters({ sortBy: 'Newest', platforms: [], niches: [], campaignGoal: null });
          setIsFilterOpen(false);
        }}
        currentFilters={filters}
      />
    </div>
  );
}
