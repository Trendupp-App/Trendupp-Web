import type { ExploreCreator } from '@/types/explore';
import UserAvatar from '@/shared/UserAvatar';

function fmtFollowers(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return `${n}`;
}

interface CreatorExploreCardProps {
  creator: ExploreCreator;
  onView: (creator: ExploreCreator) => void;
}

export default function CreatorExploreCard({ creator, onView }: CreatorExploreCardProps) {
  const initials = `${creator.firstName?.[0] ?? ''}${creator.lastName?.[0] ?? ''}`.toUpperCase();

  return (
    <div className="bg-white border border-[#e8e6f0] rounded-2xl p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <UserAvatar size={56} avatarUrl={creator.avatarUrl} initials={initials || 'U'} />
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-bold text-[#1a1a2e] truncate">
              {creator.firstName} {creator.lastName}
            </p>
            <span className="text-xs text-[#9a99b0]">@{creator.username}</span>
            {creator.assignedTier && (
              <span className="text-[10px] font-medium text-[#4f46e5] bg-[#eef0ff] px-2 py-0.5 rounded-full">
                {creator.assignedTier}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 mt-1 text-xs text-[#7a7a9a] flex-wrap">
            <span>
              <strong className="text-[#1a1a2e]">{fmtFollowers(creator.followersCount)}</strong>{' '}
              Followers
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={() => onView(creator)}
        className="px-5 py-2 bg-brand-pink-light text-brand-pink text-sm font-semibold rounded-lg hover:bg-[#ffe3ec] transition-colors cursor-pointer shrink-0"
      >
        View
      </button>
    </div>
  );
}
