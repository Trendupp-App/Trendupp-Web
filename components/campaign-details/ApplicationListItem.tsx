'use client';

import type { CampaignApplicationDto } from '@/types/campaign';
import UserAvatar from '@/shared/UserAvatar';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/Utilities';

const STATUS_LABEL: Record<CampaignApplicationDto['status'], string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  rejected: 'Rejected',
};

const STATUS_CLASS: Record<CampaignApplicationDto['status'], string> = {
  pending: 'text-amber-600 bg-amber-50',
  accepted: 'text-emerald-600 bg-emerald-50',
  rejected: 'text-red-500 bg-red-50',
};

interface ApplicationListItemProps {
  application: CampaignApplicationDto;
  onView: (application: CampaignApplicationDto) => void;
  selected?: boolean;
  onToggleSelect?: (application: CampaignApplicationDto) => void;
  currency?: string;
}

export default function ApplicationListItem({
  application,
  onView,
  selected = false,
  onToggleSelect,
  currency,
}: ApplicationListItemProps) {
  const user = application?.creator;
  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : 'U';
  const isPending = application.status === 'pending';

  return (
    <div
      className={cn(
        'border rounded-xl p-5 flex items-start justify-between gap-4 transition-colors',
        selected ? 'border-brand-pink bg-[#fdf5fa]' : 'border-[#e8e6f0]',
      )}
    >
      <div className="flex items-start gap-3 min-w-0 flex-1">
        {isPending && onToggleSelect ? (
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onToggleSelect(application)}
            className="mt-1.5 size-4 shrink-0 accent-brand-pink cursor-pointer"
            aria-label="Select application"
          />
        ) : (
          <span
            className={cn(
              'shrink-0 mt-0.5 text-[10px] font-semibold px-2 py-1 rounded-full',
              STATUS_CLASS[application.status],
            )}
          >
            {STATUS_LABEL[application.status]}
          </span>
        )}
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

      <button
        onClick={() => onView(application)}
        className="flex items-center cursor-pointer gap-1.5 px-4 py-2 border border-[#e8e6f0] rounded-lg text-xs text-[#1a1a2e] hover:bg-[#faf9fc] transition-colors shrink-0"
      >
        View application
        <ChevronRight size={14} />
      </button>
    </div>
  );
}
