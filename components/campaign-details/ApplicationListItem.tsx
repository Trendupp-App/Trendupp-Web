'use client';

import type { CampaignApplication } from '@/types/campaign';
import UserAvatar from '@/shared/UserAvatar';
import { ChevronRight } from 'lucide-react';

function fmt(n: number) {
  return `₦${n.toLocaleString('en-NG')}`;
}

interface ApplicationListItemProps {
  application: CampaignApplication;
  onView: (application: CampaignApplication) => void;
}

export default function ApplicationListItem({ application, onView }: ApplicationListItemProps) {
  const user = application?.creator;
  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : 'U';

  return (
    <div className="border border-[#e8e6f0] rounded-xl p-5 flex items-start justify-between gap-4">
      <div className="flex items-start gap-3 min-w-0 flex-1">
        <UserAvatar size={36} avatarUrl={user?.avatarUrl} initials={initials} />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-[#1a1a2e]">
              {user?.firstName} {user?.lastName}
            </p>
            {user?.instagramUsername ? (
              <span className="text-sm text-[#9a99b0]">@{user.instagramUsername}</span>
            ) : user?.tiktokUsername ? (
              <span className="text-sm text-[#9a99b0]">@{user.tiktokUsername}</span>
            ) : user?.youtubeUsername ? (
              <span className="text-sm text-[#9a99b0]">@{user.youtubeUsername}</span>
            ) : user?.twitterUsername ? (
              <span className="text-sm text-[#9a99b0]">@{user.twitterUsername}</span>
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
              {fmt(application?.feeRequest || 0)}
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
