'use client';
import { useEffect, useState } from 'react';
import WorkTabs from '@/components/dashboard/my-work/WorkTabs';
import WorkCampaignCard, { WorkCampaign } from '@/components/creator-dashboard/WorkCampaignCard';
import WorkDetailsDrawer from '@/components/creator-dashboard/WorkDetailsDrawer';
import SubmitContentModal from '@/components/dashboard/my-work/SubmitContentModal';
import SubmitProofModal, {
  type LiveLinkEntry,
} from '@/components/dashboard/my-work/SubmitProofModal';
import CampaignStatusSheet from '@/components/creator-dashboard/CampaignStatusSheet';
import RaiseDisputeModal from '@/components/dashboard/my-work/RaiseDisputeModal';
import MyWorkPageSkeleton from '@/components/skeletons/MyWorkPageSkeleton';
import { useQueryClient } from '@tanstack/react-query';
import {
  useMyApplications,
  useSubmitContentDraft,
  useSubmitProofOfPosting,
} from '@/hooks/useCampaign';
import { toast } from 'sonner';
import { CampaignApplicationDto, Campaign } from '@/types/campaign';
import { useBrandNames } from '@/hooks/useBrandNames';
import { formatCurrency } from '@/utils/Utilities';

interface SubmissionItem {
  id?: string;
  status: string;
  brandFeedback?: string;
  draftLink?: string | null;
  liveLink?: Record<string, { url: string; isLive: boolean; checkedAt: string }> | null;
}
function mapAppToWorkCampaign(
  app: CampaignApplicationDto,
  brandNameById: Record<string, string> = {},
): WorkCampaign {
  const campaign = app.campaign || ({} as Campaign);
  const brandName =
    campaign.brand?.username ||
    (campaign.brandId && brandNameById[campaign.brandId]) ||
    'Unknown Brand';
  const platformName = app.primaryPlatform?.name || 'Instagram';
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
      } else if (latest.status === 'pending_approval') {
        status = 'Under review';
      } else if (latest.status === 'request_revision') {
        status = 'Revision requested';
        revisionComment = latest.brandFeedback || 'Please check guidelines and deliverables.';
      } else if (latest.status === 'revision-sent') {
        status = 'Under review';
      } else if (latest.status === 'approved') {
        status = 'Approved';
      } else if (
        latest.status === 'livelink_available' ||
        latest.status === 'completed' ||
        latest.status === 'done'
      ) {
        status = 'Payment released';
      }
    }
  }
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
    currency: campaign.currency ?? 'NGN',
    budgetMinMax: formatCurrency(campaign.totalBudget || 0, campaign.currency ?? 'NGN'),
    budgetString: formatCurrency(campaign.totalBudget || 0, campaign.currency ?? 'NGN'),
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
    deliverables: campaign.deliverables || [],
    contentDirection: campaign.contentDirection || [],
    contentDos: campaign.contentGuidelines?.dos || [],
    contentDonts: campaign.contentGuidelines?.donts || [],
    usageRights: campaign.usageRights || 'No usage rights specified.',
    successLooksLike: campaign.successLooksLike || 'No success criteria specified.',
    draftLink: latestSubmission?.draftLink ?? null,
    liveLink: latestSubmission?.liveLink ?? null,
    contentIdea: app.contentIdea,
    applicationsCount: campaign.applicationsCount?.total ?? 0,
  };
}

type PrimaryTab = 'Active' | 'Applied' | 'Done';

export default function MyWorkPage() {
  const queryClient = useQueryClient();
  const { data: myApps = [], isLoading, refetch } = useMyApplications();

  const [activeTab, setActiveTab] = useState<PrimaryTab>('Active');
  const [activeSubFilter, setActiveSubFilter] = useState<string>('All');
  const [statusSheetCampaign, setStatusSheetCampaign] = useState<WorkCampaign | null>(null);
  const [isStatusSheetOpen, setIsStatusSheetOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<WorkCampaign | null>(null);

  // Submit content modal states
  const [submitLinkCampaign, setSubmitLinkCampaign] = useState<WorkCampaign | null>(null);
  // Submit proof modal states
  const [submitProofCampaign, setSubmitProofCampaign] = useState<WorkCampaign | null>(null);

  // Raise dispute modal states
  const [disputeCampaign, setDisputeCampaign] = useState<WorkCampaign | null>(null);

  const submitDraft = useSubmitContentDraft(() => {
    queryClient.invalidateQueries({ queryKey: ['my-applications'] });
  });

  const submitProof = useSubmitProofOfPosting(() => {
    queryClient.invalidateQueries({ queryKey: ['my-applications'] });
  });

  useEffect(() => {
    refetch();
  }, [activeTab, refetch]);

  const brandIds = myApps.map((app) => app.campaign?.brandId);
  const { nameById: brandNameById } = useBrandNames(brandIds);

  const campaigns = myApps.map((app) => mapAppToWorkCampaign(app, brandNameById));

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
      setSubmitLinkCampaign(null);
    }
  };

  const handleSubmitProof = (entries: LiveLinkEntry[]) => {
    if (!submitProofCampaign) return;

    if (submitProofCampaign.campaignId && submitProofCampaign.submissionId) {
      const liveLink = entries.reduce<Record<string, string>>((acc, entry) => {
        acc[entry.platform] = entry.link;
        return acc;
      }, {});

      submitProof.mutate(
        {
          id: submitProofCampaign.campaignId,
          submissionId: submitProofCampaign.submissionId,
          payload: { liveLink },
        },
        {
          onSuccess: () => {
            setSubmitProofCampaign(null);
          },
        },
      );
    } else {
      toast.success('Mock Proof of posting submitted successfully! (Staging Fallback)');
      setSubmitProofCampaign(null);
    }
  };
  const handleAcceptOffer = (campaign: WorkCampaign) => {
    toast.success(`Offer for "${campaign.title}" accepted!`);
  };

  const handleDeclineOffer = (campaign: WorkCampaign) => {
    toast.success(`Offer for "${campaign.title}" declined!`);
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
      // Tab and Sub-pill checks
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
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

  if (isLoading) {
    return <MyWorkPageSkeleton />;
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
      />

      {/* Campaign Cards Grid */}
      {filteredCampaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
          {filteredCampaigns.map((campaign) => (
            <WorkCampaignCard
              key={campaign.id}
              campaign={campaign}
              onOpenStatusSheet={(c) => {
                setStatusSheetCampaign(c);
                setIsStatusSheetOpen(true);
              }}
              isSelected={statusSheetCampaign?.id === campaign.id}
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

      <CampaignStatusSheet
        campaign={statusSheetCampaign}
        open={isStatusSheetOpen}
        onOpenChange={setIsStatusSheetOpen}
        onSubmitLink={(c) => {
          setIsStatusSheetOpen(false);
          setSubmitLinkCampaign(c);
        }}
        onSubmitProof={(c) => {
          setIsStatusSheetOpen(false);
          setSubmitProofCampaign(c);
        }}
        onAcceptOffer={handleAcceptOffer}
        onDeclineOffer={handleDeclineOffer}
        onRaiseDispute={(c) => {
          setIsStatusSheetOpen(false);
          setDisputeCampaign(c);
        }}
        onViewBrief={(c) => {
          setIsStatusSheetOpen(false);
          setSelectedCampaign(c);
        }}
      />

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
        key={submitLinkCampaign?.id ?? 'closed'}
        isOpen={!!submitLinkCampaign}
        campaign={submitLinkCampaign}
        onClose={() => setSubmitLinkCampaign(null)}
        onSubmit={handleSubmitLink}
        isSubmitting={submitDraft.isPending}
      />

      {/* Submit Proof of Posting Modal */}
      <SubmitProofModal
        key={submitProofCampaign?.id ?? 'closed'}
        isOpen={!!submitProofCampaign}
        campaign={submitProofCampaign}
        onClose={() => setSubmitProofCampaign(null)}
        onSubmit={handleSubmitProof}
        isSubmitting={submitProof.isPending}
      />

      {/* Raise Dispute Modal */}
      <RaiseDisputeModal
        isOpen={!!disputeCampaign}
        campaign={disputeCampaign}
        onClose={() => setDisputeCampaign(null)}
      />
    </div>
  );
}
