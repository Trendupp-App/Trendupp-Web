import type { ExploreBrand } from '@/types/explore';
import UserAvatar from '@/shared/UserAvatar';

function fmtFollowers(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return `${n}`;
}

interface BrandExploreCardProps {
  brand: ExploreBrand;
  onView: (brand: ExploreBrand) => void;
}

export default function BrandExploreCard({ brand, onView }: BrandExploreCardProps) {
  const displayName = brand.username || `${brand.firstName} ${brand.lastName}`.trim() || 'Brand';
  const initials = displayName.slice(0, 2).toUpperCase();
  const industryLabel = brand.industries[0]?.name ?? '—';

  return (
    <div className="bg-white border border-[#e8e6f0] rounded-2xl p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <UserAvatar size={56} avatarUrl={brand.avatarUrl} initials={initials} />
        <div className="min-w-0">
          <p className="text-sm font-bold text-[#1a1a2e] truncate">{displayName}</p>
          <p className="text-xs text-[#9a99b0] mt-0.5">{industryLabel}</p>
          <div className="flex items-center gap-2 mt-1 text-xs text-[#7a7a9a]">
            <span>
              <strong className="text-[#1a1a2e]">{brand.totalCampaigns}</strong> campaigns
            </span>
            <span className="text-[#e8e6f0]">•</span>
            <span>
              <strong className="text-[#1a1a2e]">{fmtFollowers(brand.followersCount)}</strong>{' '}
              followers
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={() => onView(brand)}
        className="px-5 py-2 bg-brand-pink-light text-brand-pink text-sm font-semibold rounded-lg hover:bg-[#ffe3ec] transition-colors cursor-pointer shrink-0"
      >
        View
      </button>
    </div>
  );
}
