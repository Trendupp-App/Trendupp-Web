'use client';

import type { CampaignApplicationDto } from '@/types/campaign';
import UserAvatar from '@/shared/UserAvatar';
import { Check, ChevronRight, Loader2, Undo2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/Utilities';

/** Statuses a brand can set from the list; 'pending' undoes an accept/reject */
export type ReviewDecision = 'selected' | 'rejected' | 'pending';

// 'selected' is the brand's accept before the campaign is activated; 'accepted' is after
const STATUS_LABEL: Record<CampaignApplicationDto['status'], string> = {
  pending: 'Pending',
  selected: 'Accepted',
  accepted: 'Accepted',
  rejected: 'Rejected',
};

const STATUS_CLASS: Record<CampaignApplicationDto['status'], string> = {
  pending: 'text-amber-600 bg-amber-50',
  selected: 'text-emerald-600 bg-emerald-50',
  accepted: 'text-emerald-600 bg-emerald-50',
  rejected: 'text-red-500 bg-red-50',
};

interface ApplicationListItemProps {
  application: CampaignApplicationDto;
  onView: (application: CampaignApplicationDto) => void;
  /** Omit to hide the accept/reject actions (e.g. paused or cancelled campaigns) */
  onReview?: (application: CampaignApplicationDto, decision: ReviewDecision) => void;
  /** A review request for this application is in flight */
  reviewing?: boolean;
  currency?: string;
}

export default function ApplicationListItem({
  application,
  onView,
  onReview,
  reviewing = false,
  currency,
}: ApplicationListItemProps) {
  const user = application?.creator;
  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : 'U';
  const { status } = application;
  const canReview = !!onReview && status !== 'accepted';

  return (
    <div
      className={cn(
        'border rounded-xl p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 transition-colors',
        status === 'selected'
          ? 'border-emerald-200 bg-emerald-50/30'
          : status === 'rejected'
            ? 'border-[#e8e6f0] bg-[#faf9fc]'
            : 'border-[#e8e6f0]',
      )}
    >
      <div className="flex items-start gap-3 min-w-0 flex-1">
        <UserAvatar size={36} avatarUrl={user?.avatarUrl} initials={initials} />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-[#1a1a2e]">
              {user?.firstName} {user?.lastName}
            </p>
            {user?.instagramUsername ? (
              <span className="text-sm text-[#9a99b0]">{user.instagramUsername}</span>
            ) : user?.tiktokUsername ? (
              <span className="text-sm text-[#9a99b0]">{user.tiktokUsername}</span>
            ) : user?.youtubeUsername ? (
              <span className="text-sm text-[#9a99b0]">{user.youtubeUsername}</span>
            ) : user?.twitterUsername ? (
              <span className="text-sm text-[#9a99b0]">{user.twitterUsername}</span>
            ) : null}
            <span
              className={cn(
                'text-[10px] font-semibold px-2 py-0.5 rounded-full',
                STATUS_CLASS[status],
              )}
            >
              {STATUS_LABEL[status]}
            </span>
          </div>
          <p className="text-sm text-[#4a4a6a] mt-1 leading-relaxed">{application?.contentIdea}</p>

          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <span className="text-xs font-medium text-[#7c6fe0] bg-[#ede9fb] px-2.5 py-1 rounded-full">
              {user?.assignedTier || ''}
            </span>
            <span className="text-xs text-[#9a99b0]">
              {user?.instagramFollowers ? (
                <strong className="text-[#1a1a2e]">{user?.instagramFollowers}</strong>
              ) : user?.tiktokFollowers ? (
                <strong className="text-[#1a1a2e]">{user?.tiktokFollowers}</strong>
              ) : user?.youtubeFollowers ? (
                <strong className="text-[#1a1a2e]">{user?.youtubeFollowers}</strong>
              ) : user?.twitterFollowers ? (
                <strong className="text-[#1a1a2e]">{user?.twitterFollowers}</strong>
              ) : null}{' '}
              followers
            </span>
            <span className="text-xs font-semibold text-[#1a1a2e]">
              {formatCurrency(
                application?.feeRequest || 0,
                application.campaign?.currency ?? currency ?? 'NGN',
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-stretch sm:items-end gap-2 shrink-0">
        <button
          onClick={() => onView(application)}
          className="flex items-center justify-center cursor-pointer gap-1.5 px-4 py-2 border border-[#e8e6f0] rounded-lg text-xs text-[#1a1a2e] hover:bg-[#faf9fc] transition-colors"
        >
          View application
          <ChevronRight size={14} />
        </button>

        {canReview &&
          (reviewing ? (
            <div className="flex items-center justify-center gap-1.5 h-8 text-xs text-[#9a99b0]">
              <Loader2 size={14} className="animate-spin text-brand-pink" />
              Updating…
            </div>
          ) : status === 'pending' ? (
            <div className="flex gap-2">
              <button
                onClick={() => onReview(application, 'rejected')}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 h-8 rounded-lg text-xs font-medium border border-red-100 bg-red-50 text-red-500 hover:bg-red-100 transition-colors cursor-pointer"
              >
                <X size={13} />
                Reject
              </button>
              <button
                onClick={() => onReview(application, 'selected')}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 h-8 rounded-lg text-xs font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors cursor-pointer"
              >
                <Check size={13} />
                Accept
              </button>
            </div>
          ) : (
            // Accepted (before activation) or rejected — let the brand change their mind
            <button
              onClick={() => onReview(application, 'pending')}
              className="flex items-center justify-center gap-1 h-8 px-2 text-xs text-[#7a7a9a] hover:text-[#1a1a2e] transition-colors cursor-pointer"
            >
              <Undo2 size={13} />
              Undo
            </button>
          ))}
      </div>
    </div>
  );
}
