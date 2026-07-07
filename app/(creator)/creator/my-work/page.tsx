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
import { useQueryClient } from '@tanstack/react-query';
import {
  useMyApplications,
  useSubmitContentDraft,
  useSubmitProofOfPosting,
} from '@/hooks/useCampaign';
import { toast } from 'sonner';
import { CampaignApplicationDto, Campaign } from '@/types/campaign';

const INITIAL_CAMPAIGNS: WorkCampaign[] = [
  {
    id: '1',
    title: 'Summer Style Collection 2025',
    brand: 'Zara Africa',
    budgetMinMax: '₦150K–₦300K',
    budgetString: '₦150,000 – 300,000',
    daysLeft: '5d 14h',
    daysLeftNumber: 5,
    status: 'In progress',
    platform: 'Instagram',
    tier: 'Micro',
    guidelines:
      'Create your content off-platform, then return to submit the link for brand review. Keep your content within the brief guidelines. Submit content within the next 3-5 days.',
    image:
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    niches: ['Fashion', 'Lifestyle'],
    goal: 'Content Creation',
    createdAt: '2026-06-24T12:00:00Z',
    budgetMax: 300000,
  },
  {
    id: '2',
    title: 'Summer Style Collection 2025',
    brand: 'Zara Africa',
    budgetMinMax: '₦150K–₦300K',
    budgetString: '₦150,000 – 300,000',
    daysLeft: '4d 12h',
    daysLeftNumber: 4,
    status: 'Under review',
    platform: 'TikTok',
    tier: 'Micro',
    guidelines:
      "The brand has up to 48 hours to review your submission. You'll receive a push notification with their decision.",
    image:
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
    niches: ['Fashion', 'Beauty'],
    goal: 'Content Creation',
    createdAt: '2026-06-23T10:00:00Z',
    budgetMax: 300000,
  },
  {
    id: '3',
    title: 'Summer Style Collection 2025',
    brand: 'Zara Africa',
    budgetMinMax: '₦150K–₦450K',
    budgetString: '₦150,000 – 450,000',
    daysLeft: '3d 8h',
    daysLeftNumber: 3,
    status: 'Revision requested',
    platform: 'YouTube',
    tier: 'Micro',
    guidelines: 'Please adjust lighting and duration.',
    revisionComment:
      'The video needs to clearly show the front camera quality. Please reshoot the selfie segment with better lighting. Duration should be exactly 45 seconds.',
    image:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    niches: ['Lifestyle', 'Travel'],
    goal: 'Amplification',
    createdAt: '2026-06-22T08:00:00Z',
    budgetMax: 450000,
  },
  {
    id: '4',
    title: 'Summer Style Collection 2025',
    brand: 'Zara Africa',
    budgetMinMax: '₦150K–₦200K',
    budgetString: '₦150,000 – 200,000',
    daysLeft: '2d 6h',
    daysLeftNumber: 2,
    status: 'Approved',
    platform: 'Instagram',
    tier: 'Micro',
    guidelines:
      'Publish your content on YouTube, then come back to submit proof of posting. The post must stay live for 24 hours before payment is released.',
    image:
      'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80',
    niches: ['Fashion'],
    goal: 'Content Creation',
    createdAt: '2026-06-21T09:00:00Z',
    budgetMax: 200000,
  },
  {
    id: '5',
    title: 'Summer Style Collection 2026',
    brand: 'Zara Africa',
    budgetMinMax: '₦150K–₦300K',
    budgetString: '₦150,000 – 300,000',
    daysLeft: '4d',
    daysLeftNumber: 4,
    status: 'Selected',
    platform: 'TikTok',
    tier: 'Micro',
    guidelines: 'Awaiting your acceptance of this offer.',
    image:
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
    niches: ['Tech'],
    goal: 'Amplification',
    createdAt: '2026-06-20T14:00:00Z',
    budgetMax: 300000,
  },
  {
    id: '6',
    title: 'Summer Style Collection 2025',
    brand: 'Zara Africa',
    budgetMinMax: '₦150K–₦350K',
    budgetString: '₦150,000 – 350,000',
    daysLeft: '6d',
    daysLeftNumber: 6,
    status: 'Pending',
    platform: 'Instagram',
    tier: 'Micro',
    guidelines: 'Awaiting brand decision.',
    image:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
    niches: ['Lifestyle'],
    goal: 'Content Creation',
    createdAt: '2026-06-19T11:00:00Z',
    budgetMax: 350000,
  },
  {
    id: '7',
    title: 'Summer Style Collection 2025',
    brand: 'Zara Africa',
    budgetMinMax: '₦150K–₦300K',
    budgetString: '₦150,000 – 300,000',
    daysLeft: '0d',
    daysLeftNumber: 0,
    status: 'Declined',
    platform: 'X',
    tier: 'Micro',
    guidelines: 'Sorry you have not been selected.',
    image:
      'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
    niches: ['Finance', 'Tech'],
    goal: 'Amplification',
    createdAt: '2026-06-18T09:00:00Z',
    budgetMax: 300000,
  },
  {
    id: '8',
    title: 'Summer Style Collection 2025',
    brand: 'Zara Africa',
    budgetMinMax: '₦150K–₦250K',
    budgetString: '₦150,000 – 250,000',
    daysLeft: '0d',
    daysLeftNumber: 0,
    status: 'Payment released',
    platform: 'Instagram',
    tier: 'Micro',
    guidelines: 'Payment released.',
    actualAmount: 250000,
    escrowReleaseDate: 'June 28, 2026',
    image:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    niches: ['Fashion'],
    goal: 'Content Creation',
    createdAt: '2026-06-17T12:00:00Z',
    budgetMax: 250000,
  },
];

interface SubmissionItem {
  id?: string;
  status: string;
  revisionFeedback?: string;
}

function mapAppToWorkCampaign(app: CampaignApplicationDto): WorkCampaign {
  const campaign = app.campaign || ({} as Campaign);
  const brandName = campaign.brand?.username || 'Unknown Brand';
  const platformName = app.primaryPlatform?.name || 'Instagram';

  // Calculate status
  let status: WorkCampaign['status'] = 'Pending';
  let revisionComment = '';

  if (app.status === 'pending') {
    status = 'Pending';
  } else if (app.status === 'rejected') {
    status = 'Declined';
  } else if (app.status === 'accepted') {
    const submissions = (app.submissions || []) as SubmissionItem[];
    if (submissions.length === 0) {
      status = 'In progress';
    } else {
      const latest = submissions[submissions.length - 1];
      if (latest.status === 'in_progress') {
        status = 'In progress';
      } else if (latest.status === 'awaiting_review') {
        status = 'Under review';
      } else if (latest.status === 'revision_requested') {
        status = 'Revision requested';
        revisionComment = latest.revisionFeedback || 'Please check guidelines and deliverables.';
      } else if (latest.status === 'live') {
        status = 'Payment released';
      }
    }
  }

  // Calculate days left
  let daysLeft = '0d';
  let daysLeftNumber = 0;
  if (campaign.timeline) {
    const diff = new Date(campaign.timeline).getTime() - Date.now();
    if (diff > 0) {
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      daysLeft = days > 0 ? `${days}d ${hours}h` : `${hours}h`;
      daysLeftNumber = days;
    }
  }

  const latestSubmission = app.submissions?.[app.submissions.length - 1] as
    | SubmissionItem
    | undefined;

  return {
    id: app.id,
    campaignId: campaign.id,
    submissionId: latestSubmission?.id,
    title: campaign.title || 'Untitled Campaign',
    brand: brandName,
    budgetMinMax: `₦${(campaign.totalBudget || 0).toLocaleString()}`,
    budgetString: `₦${(campaign.totalBudget || 0).toLocaleString()}`,
    daysLeft,
    daysLeftNumber,
    status,
    platform: platformName,
    tier: campaign.creatorCategory?.name || 'Nano',
    guidelines: campaign.campaignBrief || 'No guidelines provided',
    image:
      campaign.coverImage ||
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    niches: campaign.creatorNiche?.name ? [campaign.creatorNiche.name] : [],
    goal: campaign.goal === 'Create Content' ? 'Content Creation' : 'Amplification',
    createdAt: app.createdAt,
    budgetMax: campaign.totalBudget || 0,
    actualAmount: app.feeRequest,
    revisionComment,
  };
}

type PrimaryTab = 'Active' | 'Applied' | 'Done';

export default function MyWorkPage() {
  const queryClient = useQueryClient();
  const { data: myApps = [], isLoading } = useMyApplications();

  const [mockCampaigns, setMockCampaigns] = useState<WorkCampaign[]>(INITIAL_CAMPAIGNS);
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

  const submitDraft = useSubmitContentDraft(() => {
    queryClient.invalidateQueries({ queryKey: ['my-applications'] });
  });

  const submitProof = useSubmitProofOfPosting(() => {
    queryClient.invalidateQueries({ queryKey: ['my-applications'] });
  });

  // Choose between dynamic backend apps or local mocks
  const campaigns = myApps.length > 0 ? myApps.map(mapAppToWorkCampaign) : mockCampaigns;

  // Handle link submission (moves campaign to "Under Review")
  const handleSubmitLink = (link: string) => {
    if (!submitLinkCampaign) return;

    if (submitLinkCampaign.campaignId && submitLinkCampaign.id) {
      submitDraft.mutate(
        {
          id: submitLinkCampaign.campaignId,
          appId: submitLinkCampaign.id,
          payload: { draftLink: link },
        },
        {
          onSuccess: () => {
            setSubmitLinkCampaign(null);
          },
        },
      );
    } else {
      toast.success('Mock Content draft link submitted successfully! (Staging Fallback)');
      setMockCampaigns((prev) =>
        prev.map((c) => (c.id === submitLinkCampaign.id ? { ...c, status: 'Under review' } : c)),
      );
      setSubmitLinkCampaign(null);
    }
  };

  // Handle proof submission (moves campaign to "Payment Released")
  const handleSubmitProof = (link: string) => {
    if (!submitProofCampaign) return;

    if (submitProofCampaign.campaignId && submitProofCampaign.submissionId) {
      const platformKey = submitProofCampaign.platform.toLowerCase();
      const normalisedKey = platformKey === 'x' ? 'twitter' : platformKey;

      submitProof.mutate(
        {
          id: submitProofCampaign.campaignId,
          submissionId: submitProofCampaign.submissionId,
          payload: {
            liveLink: {
              [normalisedKey]: link,
            },
          },
        },
        {
          onSuccess: () => {
            setSubmitProofCampaign(null);
          },
        },
      );
    } else {
      toast.success('Mock Proof of posting submitted successfully! (Staging Fallback)');
      setMockCampaigns((prev) =>
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
    setMockCampaigns((prev) =>
      prev.map((c) => (c.id === campaign.id ? { ...c, status: 'In progress' } : c)),
    );
  };

  const handleDeclineOffer = (campaign: WorkCampaign) => {
    setMockCampaigns((prev) =>
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

  // Filter campaigns depending on tab, sub-pill selection, and filter modal selections
  const filteredCampaigns = campaigns
    .filter((c) => {
      // 1. Platform check
      if (filters.platforms.length > 0 && !filters.platforms.includes(c.platform)) {
        return false;
      }

      // 2. Niche check
      if (filters.niches.length > 0) {
        const hasMatchingNiche = c.niches?.some((n) => filters.niches.includes(n));
        if (!hasMatchingNiche) return false;
      }

      // 3. Campaign Goal check
      if (filters.campaignGoal && c.goal !== filters.campaignGoal) {
        return false;
      }

      // 4. Tab and Sub-pill checks
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
    })
    .sort((a, b) => {
      // 5. Sort filters
      if (filters.sortBy === 'Newest') {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      }
      if (filters.sortBy === 'Closing Soon') {
        const daysA = a.daysLeftNumber ?? 999999;
        const daysB = b.daysLeftNumber ?? 999999;
        return daysA - daysB;
      }
      if (filters.sortBy === 'Highest Budget') {
        const budgetA = a.budgetMax ?? 0;
        const budgetB = b.budgetMax ?? 0;
        return budgetB - budgetA;
      }
      return 0;
    });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 w-full pb-12 select-none animate-pulse">
        <div className="flex flex-col gap-1">
          <div className="h-8 w-32 bg-gray-200 rounded-md"></div>
          <div className="h-4 w-48 bg-gray-100 rounded-md mt-1"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-80 bg-gray-50 border border-gray-100 rounded-[32px]"></div>
          ))}
        </div>
      </div>
    );
  }

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
