'use client';

import { useState } from 'react';
import {
  Info,
  ExternalLink,
  CheckCircle2,
  XCircle,
  MessageCircle,
  MessageCircleWarning,
  ShieldCheck,
  Star,
} from 'lucide-react';
import type { Campaign } from '@/types/campaign';
import type { CampaignSubmission } from '@/types/submissions';
import {
  useSubmissions,
  useVetDraft,
  useCampaignPlatforms,
  useRaiseDispute,
  useApproveLivePost,
} from '@/hooks/useCampaign';
import { ensureHttpUrl } from '@/utils/Utilities';
import UserAvatar from '@/shared/UserAvatar';
import SubmissionCardSkeleton from '@/components/skeletons/SubmissionCardSkeleton';
import FeedbackModal from '@/shared/FeedBackModal';
import RequestRevisionModal from '@/components/campaign-details/RequestRevisionModal';
import ResolveConflictModal from '@/components/campaign-details/ResolveConflictModal';
import RaiseDisputeModal from '@/components/campaign-details/RaiseDisputeModal';
import { cn } from '@/lib/utils';
import { useCreateReview } from '@/hooks/useCampaign';
import LeaveReviewModal from '@/components/campaign-details/LeaveReviewModal';
import CreatorProfileSheet from '@/components/campaign-details/CreatorProfileSheet';

function timeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (hours < 1) return 'just now';
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

// NOTE: backend uses inconsistent keys — "request_revision" (underscore) for
// the first request, "revision-sent" (hyphen) once the creator resubmits.
// Handling both explicitly rather than normalizing, since that's what the
// API actually returns today.
const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  pending_approval: { label: 'Awaiting review', cls: 'text-[#7a7a9a] border-[#e8e6f0] bg-white' },
  request_revision: {
    label: 'Revision requested',
    cls: 'text-amber-600 border-amber-300 bg-amber-50',
  },
  'revision-sent': {
    label: 'Revision requested',
    cls: 'text-amber-600 border-amber-300 bg-amber-50',
  },
  livelink_available: {
    label: 'Content review',
    cls: 'text-amber-600 border-amber-300 bg-amber-50',
  },
  completed: { label: 'Completed', cls: 'text-emerald-600 border-emerald-200 bg-emerald-50' },
  done: { label: 'Completed', cls: 'text-emerald-600 border-emerald-200 bg-emerald-50' },
  approved: { label: 'Approved', cls: 'text-emerald-600 border-emerald-200 bg-emerald-50' },
  live: { label: 'Live', cls: 'text-emerald-600 border-emerald-200 bg-emerald-50' },
};

const LIVE_STATUSES = new Set(['livelink_available']);

const PLATFORM_LABELS: Record<string, string> = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  twitter: 'X',
};

interface CampaignDeliverablesTabProps {
  campaign: Campaign;
}

type PendingApproval = { submissionId: string; creatorName: string };
type PendingRevision = { submissionId: string; creatorName: string };
type PendingDispute = { submissionId: string; creatorName: string; creatorId: string };
type PendingLiveApproval = { submissionId: string; creatorName: string };
type PendingReview = {
  submissionId: string;
  creatorId: string;
  creatorName: string;
  creatorUsername: string;
  creatorAvatarUrl?: string | null;
};

export default function CampaignDeliverablesTab({ campaign }: CampaignDeliverablesTabProps) {
  const { data: submissions, isLoading, isError } = useSubmissions(campaign.id);
  const { data: platforms = [] } = useCampaignPlatforms();
  const vetDraft = useVetDraft(campaign.id);
  const raiseDispute = useRaiseDispute();
  const approveLivePost = useApproveLivePost(campaign.id);
  const createReview = useCreateReview();
  const [pendingReview, setPendingReview] = useState<PendingReview | null>(null);
  const [viewingCreatorId, setViewingCreatorId] = useState<string | null>(null);
  const [pendingApproval, setPendingApproval] = useState<PendingApproval | null>(null);
  const [pendingRevision, setPendingRevision] = useState<PendingRevision | null>(null);
  const [pendingDispute, setPendingDispute] = useState<PendingDispute | null>(null);
  const [showRaiseDispute, setShowRaiseDispute] = useState(false);

  const [feedbackCache, setFeedbackCache] = useState<Record<string, string>>({});

  // Confirmation before approving all live links on a submission at once —
  // there is no per-platform or reject action available on the API.
  const [pendingLiveApproval, setPendingLiveApproval] = useState<PendingLiveApproval | null>(null);

  function platformName(id: string | null) {
    if (!id) return null;
    return platforms.find((p) => p.id === id)?.name ?? null;
  }

  function handleRequestApprove(submissionId: string, creatorName: string) {
    setPendingApproval({ submissionId, creatorName });
  }

  function handleConfirmApprove() {
    if (!pendingApproval) return;
    vetDraft.mutate(
      { submissionId: pendingApproval.submissionId, decision: 'approved' },
      { onSuccess: () => setPendingApproval(null) },
    );
  }

  function handleRequestRevision(submissionId: string, creatorName: string) {
    setPendingRevision({ submissionId, creatorName });
  }

  function handleSendRevision(feedback: string) {
    if (!pendingRevision) return;
    setFeedbackCache((prev) => ({ ...prev, [pendingRevision.submissionId]: feedback }));
    vetDraft.mutate(
      {
        submissionId: pendingRevision.submissionId,
        decision: 'request_revision',
        brandFeedback: feedback,
      },
      { onSuccess: () => setPendingRevision(null) },
    );
  }

  function handleOpenResolveConflict(submissionId: string, creatorName: string, creatorId: string) {
    setPendingDispute({ submissionId, creatorName, creatorId });
  }

  function handleSendDispute(reason: string) {
    if (!pendingDispute) return;
    raiseDispute.mutate(
      { campaignId: campaign.id, creatorId: pendingDispute.creatorId, reason },
      { onSuccess: () => setPendingDispute(null) },
    );
  }

  function handleSendGeneralDispute(creatorId: string, reason: string) {
    raiseDispute.mutate(
      { campaignId: campaign.id, creatorId, reason },
      { onSuccess: () => setShowRaiseDispute(false) },
    );
  }

  function handleRequestLiveApproval(submissionId: string, creatorName: string) {
    setPendingLiveApproval({ submissionId, creatorName });
  }

  function handleConfirmLiveApproval() {
    if (!pendingLiveApproval) return;
    approveLivePost.mutate(pendingLiveApproval.submissionId, {
      onSuccess: () => setPendingLiveApproval(null),
    });
  }
  function handleOpenReview(sub: CampaignSubmission, creatorName: string) {
    setPendingReview({
      submissionId: sub.id,
      creatorId: sub.creator.id,
      creatorName,
      creatorUsername: sub.creator.username,
      creatorAvatarUrl: sub.creator.avatarUrl,
    });
  }

  function handleSubmitReview(rating: number, comment: string) {
    if (!pendingReview) return;
    createReview.mutate(
      {
        campaignId: campaign.id,
        creatorId: pendingReview.creatorId,
        starRating: rating,
        comment: comment || undefined,
      },
      { onSuccess: () => setPendingReview(null) },
    );
  }

  function handleViewCreatorProfile(creatorId: string) {
    setViewingCreatorId(creatorId);
  }

  const isCampaignFullyComplete =
    !!submissions && submissions.length > 0 && submissions.every((s) => s.status === 'done');
  const actionsDisabled = campaign.status === 'paused' || campaign.status === 'cancelled';

  const disputeCreators = submissions
    ? Array.from(
        new Map(
          submissions.map((s) => [
            s.creator.id,
            { id: s.creator.id, name: `${s.creator.firstName} ${s.creator.lastName}`.trim() },
          ]),
        ).values(),
      )
    : [];
  const canRaiseDispute =
    !actionsDisabled && !isCampaignFullyComplete && disputeCreators.length > 0;

  return (
    <div className="flex flex-col gap-4">
      {actionsDisabled && (
        <div className="flex items-start gap-3 bg-[#fef2f2] rounded-lg px-4 py-3.5">
          <Info size={16} className="text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-[#b91c1c] leading-relaxed capitalize">
            This campaign has been {campaign.status}. Deliverables are read-only and no further
            action can be taken.
          </p>
        </div>
      )}

      {isCampaignFullyComplete ? (
        <div className="flex items-start gap-3 bg-emerald-50 rounded-lg px-4 py-3.5">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">
              Campaign complete
            </p>
            <p className="text-sm text-emerald-700/80 mt-0.5">
              Content is live and verified. No further action needed.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3 bg-[#fff5f9] rounded-lg px-4 py-3.5">
          <Info size={16} className="text-brand-pink shrink-0 mt-0.5" />
          <p className="text-sm text-[#4a4a6a] leading-relaxed">
            Brands have 48 hours to review submitted content. Countdown starts when a creator drops
            their submission.
          </p>
        </div>
      )}

      {isLoading ? (
        <>
          <SubmissionCardSkeleton />
          <SubmissionCardSkeleton />
        </>
      ) : isError ? (
        <div className="border border-[#e8e6f0] rounded-xl p-8 text-center text-sm text-[#9a99b0]">
          Couldn&apos;t load submissions. Please try again.
        </div>
      ) : !submissions || submissions.length === 0 ? (
        <div className="border border-[#e8e6f0] rounded-xl p-8 text-center text-sm text-[#9a99b0]">
          No submissions yet.
        </div>
      ) : (
        submissions.map((sub: CampaignSubmission) => {
          const hasDraft = !!sub.draftLink;
          const badge = STATUS_BADGE[sub.status] ?? {
            label: sub.status,
            cls: 'text-[#7a7a9a] border-[#e8e6f0] bg-white',
          };
          const initials =
            `${sub.creator.firstName?.[0] ?? ''}${sub.creator.lastName?.[0] ?? ''}`.toUpperCase();
          const creatorName = `${sub.creator.firstName} ${sub.creator.lastName}`.trim();
          const platform = platformName(sub.application.primaryPlatformId);

          const isRevisionSent = sub.status === 'revision-sent';
          const isFirstRevisionRequest = sub.status === 'request_revision';

          const originalFeedback = sub.brandFeedback ?? feedbackCache[sub.id] ?? null;

          const hasLiveLinks = LIVE_STATUSES.has(sub.status) && sub.liveLink;
          const liveLinkEntries = hasLiveLinks ? Object.entries(sub.liveLink!) : [];
          const isCampaignComplete = sub.status === 'completed' || sub.status === 'done';

          if (!hasDraft) {
            return (
              <div key={sub.id} className="border border-[#e8e6f0] rounded-xl p-5">
                <div className="bg-[#fffbf0] border border-amber-200 rounded-lg px-4 py-3">
                  <p className="text-xs font-semibold text-amber-700 mb-1">CONTENT LINK</p>
                  <p className="text-sm text-[#4a4a6a]">
                    The creator is currently working on your campaign. You&apos;ll be notified once
                    it&apos;s completed.
                  </p>
                </div>
              </div>
            );
          }

          return (
            <div
              key={sub.id}
              className="border border-[#e8e6f0] rounded-xl p-5 flex flex-col gap-4"
            >
              {/* Creator row */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleViewCreatorProfile(sub.creator.id)}
                    className="flex items-center gap-3 text-left cursor-pointer group"
                  >
                    <UserAvatar
                      size={40}
                      avatarUrl={sub.creator.avatarUrl}
                      initials={initials || 'U'}
                    />
                    <div>
                      <p className="text-sm font-semibold text-[#1a1a2e] group-hover:text-brand-pink transition-colors">
                        {creatorName}
                      </p>
                      <p className="text-xs text-[#9a99b0]">
                        {platform ?? 'Content'} · Submitted {timeAgo(sub.createdAt)}
                      </p>
                    </div>
                  </button>
                </div>
                <span
                  className={cn(
                    'text-xs font-medium px-3 py-1 rounded-full border shrink-0',
                    badge.cls,
                  )}
                >
                  {badge.label}
                </span>
              </div>

              {/* Original content link */}
              {!isRevisionSent && (
                <div className="border border-[#e8e6f0] rounded-lg px-4 py-3">
                  <p className="text-xs font-semibold text-[#9a99b0] mb-1">CONTENT LINK</p>

                  <a
                    href={ensureHttpUrl(sub.draftLink!)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm font-medium text-[#1a1a2e] hover:text-brand-pink break-all"
                  >
                    {sub.draftLink}
                    <ExternalLink size={13} className="shrink-0" />
                  </a>
                  {sub.application.contentIdea && (
                    <p className="text-sm text-[#9a99b0] mt-1">
                      &quot;{sub.application.contentIdea}&quot;
                    </p>
                  )}
                </div>
              )}

              {/* Revision request feedback (shown for both request_revision and revision-sent) */}
              {(isFirstRevisionRequest || isRevisionSent) && originalFeedback && (
                <div className="bg-[#fffbf0] border border-amber-300 rounded-lg px-4 py-3">
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 mb-1 uppercase tracking-wide">
                    <Info size={13} />
                    Revision request
                  </p>
                  <p className="text-sm text-[#4a4a6a] leading-relaxed">{originalFeedback}</p>
                </div>
              )}

              {/* Revised content — only once the creator has resubmitted */}
              {isRevisionSent && (
                <div className="bg-[#f5f3ff] border border-indigo-300 rounded-lg px-4 py-3">
                  <p className="text-xs font-semibold text-indigo-600 mb-1 uppercase tracking-wide">
                    Revised content
                  </p>

                  <a
                    href={sub.draftLink!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm font-medium text-[#1a1a2e] hover:text-brand-pink break-all"
                  >
                    {sub.draftLink}
                    <ExternalLink size={13} className="shrink-0" />
                  </a>
                  {sub.application.contentIdea && (
                    <p className="text-sm text-[#4a4a6a] mt-1">
                      &quot;{sub.application.contentIdea}&quot;
                    </p>
                  )}
                </div>
              )}

              {/* Live content section — read-only list, single approve action */}
              {liveLinkEntries.length > 0 && (
                <div className="border border-[#e8e6f0] rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-[#e8e6f0]">
                    <p className="text-xs font-semibold text-[#9a99b0]">LIVE CONTENT</p>
                    {sub.urlIsLive && (
                      <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                        <ShieldCheck size={12} />
                        Live URL
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col divide-y divide-[#e8e6f0]">
                    {liveLinkEntries.map(([platformKey, entry]) => {
                      const url = typeof entry === 'string' ? entry : entry.url;
                      return (
                        <div key={platformKey} className="px-4 py-3">
                          <p className="text-xs text-[#9a99b0] mb-0.5">
                            {PLATFORM_LABELS[platformKey] ?? platformKey}
                          </p>

                          <a
                            href={ensureHttpUrl(url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sm font-medium text-[#1a1a2e] hover:text-brand-pink break-all"
                          >
                            {url}
                            <ExternalLink size={13} className="shrink-0" />
                          </a>
                        </div>
                      );
                    })}
                  </div>

                  {!isCampaignComplete && !actionsDisabled && (
                    <div className="px-4 py-3 border-t border-[#e8e6f0] bg-[#faf9fc] flex items-center gap-3">
                      <button
                        onClick={() => handleRequestLiveApproval(sub.id, creatorName)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100 transition-colors cursor-pointer"
                      >
                        <CheckCircle2 size={14} />
                        Approve & complete campaign
                      </button>
                      <button
                        onClick={() =>
                          handleOpenResolveConflict(sub.id, creatorName, sub.creator.id)
                        }
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 transition-colors cursor-pointer"
                      >
                        <XCircle size={14} />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* First review — Approve or Request revision */}
              {!actionsDisabled && sub.status === 'pending_approval' && (
                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={() => handleRequestApprove(sub.id, creatorName)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100 transition-colors cursor-pointer"
                  >
                    <CheckCircle2 size={14} />
                    Approve content
                  </button>
                  <button
                    onClick={() => handleRequestRevision(sub.id, creatorName)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-amber-50 text-amber-600 border border-amber-100 hover:bg-amber-100 transition-colors cursor-pointer"
                  >
                    <MessageCircleWarning size={14} />
                    Request revision
                  </button>
                </div>
              )}

              {/* After resubmission — Approve or Resolve conflict (revision quota is spent) */}
              {!actionsDisabled && isRevisionSent && (
                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={() => handleRequestApprove(sub.id, creatorName)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100 transition-colors cursor-pointer"
                  >
                    <CheckCircle2 size={14} />
                    Approve content
                  </button>
                  <button
                    onClick={() => handleOpenResolveConflict(sub.id, creatorName, sub.creator.id)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-[#f4f3f6] text-[#4a4a6a] border border-[#e8e6f0] hover:bg-[#ece9f4] transition-colors cursor-pointer"
                  >
                    <MessageCircleWarning size={14} />
                    Resolve conflict
                  </button>
                </div>
              )}

              {/* Leave a review — once this creator's deliverable is fully complete */}
              {!actionsDisabled && sub.status === 'done' && (
                <div className="pt-1">
                  <button
                    onClick={() => handleOpenReview(sub, creatorName)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 border border-[#e8e6f0] rounded-lg text-sm font-medium text-[#1a1a2e] hover:text-brand-pink hover:border-brand-pink hover:bg-[#faf9fc] transition-colors cursor-pointer"
                  >
                    <Star size={15} />
                    Leave a review
                  </button>
                </div>
              )}
            </div>
          );
        })
      )}

      {/* Confirm approval */}
      {pendingApproval && (
        <FeedbackModal
          icon={Info}
          iconColor="text-amber-500"
          message={
            <>
              Are you sure you want to approve{' '}
              <span className="font-semibold">{pendingApproval.creatorName}</span> content?
            </>
          }
          actions={[
            { label: 'go back', onClick: () => setPendingApproval(null) },
            {
              label: 'approve',
              variant: 'primary',
              onClick: handleConfirmApprove,
              loading: vetDraft.isPending,
            },
          ]}
        />
      )}

      {/* Request revision */}
      {pendingRevision && (
        <RequestRevisionModal
          creatorName={pendingRevision.creatorName}
          isSubmitting={vetDraft.isPending}
          onClose={() => setPendingRevision(null)}
          onSend={handleSendRevision}
        />
      )}

      {/* Resolve conflict / raise dispute */}
      {pendingDispute && (
        <ResolveConflictModal
          creatorName={pendingDispute.creatorName}
          isSubmitting={raiseDispute.isPending}
          onClose={() => setPendingDispute(null)}
          onSend={handleSendDispute}
        />
      )}

      {/* Confirm live-link approval */}
      {pendingLiveApproval && (
        <FeedbackModal
          icon={CheckCircle2}
          iconColor="text-emerald-500"
          message={
            <>
              Are you sure you want to approve the live content from{' '}
              <span className="font-semibold">{pendingLiveApproval.creatorName}</span>? This will
              mark the campaign deliverable as complete.
            </>
          }
          actions={[
            { label: 'go back', onClick: () => setPendingLiveApproval(null) },
            {
              label: 'approve',
              variant: 'primary',
              onClick: handleConfirmLiveApproval,
              loading: approveLivePost.isPending,
            },
          ]}
        />
      )}

      {/* Leave a review */}
      {pendingReview && (
        <LeaveReviewModal
          creatorName={pendingReview.creatorName}
          creatorUsername={pendingReview.creatorUsername}
          creatorAvatarUrl={pendingReview.creatorAvatarUrl}
          isSubmitting={createReview.isPending}
          onClose={() => setPendingReview(null)}
          onSubmit={handleSubmitReview}
        />
      )}

      {/* Creator profile sheet */}
      <CreatorProfileSheet
        creatorId={viewingCreatorId}
        open={!!viewingCreatorId}
        onOpenChange={(open) => !open && setViewingCreatorId(null)}
      />

      {/* Floating chat bubble — opens the raise-a-dispute modal */}
      <button
        onClick={() => canRaiseDispute && setShowRaiseDispute(true)}
        disabled={!canRaiseDispute}
        className="fixed bottom-6 right-6 z-30 w-11 h-11 bg-brand-pink hover:bg-brand-pink/90 text-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-40 disabled:pointer-events-none disabled:hover:scale-100"
        aria-label="Raise a dispute"
      >
        <MessageCircle size={20} className="fill-current text-white" />
      </button>

      {showRaiseDispute && (
        <RaiseDisputeModal
          creators={disputeCreators}
          isSubmitting={raiseDispute.isPending}
          onClose={() => setShowRaiseDispute(false)}
          onSend={handleSendGeneralDispute}
        />
      )}
    </div>
  );
}
