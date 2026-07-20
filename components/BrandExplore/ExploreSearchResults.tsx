'use client';

import CampaignCard from '@/components/create-campaign/CampaignCard';
import type { Campaign } from '@/types/campaign';
import type { ExploreCreator, ExploreBrand, ExploreSearchResponse } from '@/types/explore';

interface ExploreSearchResultsProps {
  query: string;
  results?: ExploreSearchResponse;
  isLoading: boolean;
  isError: boolean;
  onViewCampaign: (campaign: Campaign) => void;
  onViewCreator: (creator: ExploreCreator) => void;
  onViewBrand: (brand: ExploreBrand) => void;
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-64 bg-[#f5f4fa] rounded-2xl animate-pulse" />
      ))}
    </div>
  );
}

export default function ExploreSearchResults({
  query,
  results,
  isLoading,
  isError,
  onViewCampaign,
  onViewCreator,
  onViewBrand,
}: ExploreSearchResultsProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <SkeletonGrid />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-sm text-[#9a99b0] text-center py-10">
        Could not load search results. Please try again.
      </p>
    );
  }

  const campaigns = results?.campaigns.data ?? [];
  const creators = results?.creators.data ?? [];
  const brands = results?.brands.data ?? [];

  const hasNoResults = campaigns.length === 0 && creators.length === 0 && brands.length === 0;

  if (hasNoResults) {
    return (
      <p className="text-sm text-[#9a99b0] text-center py-16">
        No results for &ldquo;{query}&rdquo;
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {campaigns.length > 0 && (
        <section className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-[#1a1a2e]">
            Campaigns{' '}
            <span className="text-[#9a99b0] font-normal">
              ({results!.campaigns.pagination.total})
            </span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} onViewDetails={onViewCampaign} />
            ))}
          </div>
        </section>
      )}

      {creators.length > 0 && (
        <section className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-[#1a1a2e]">
            Creators{' '}
            <span className="text-[#9a99b0] font-normal">
              ({results!.creators.pagination.total})
            </span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {creators.map((creator) => (
              <button
                key={creator.id}
                onClick={() => onViewCreator(creator)}
                className="text-left bg-white border border-[#e8e6f0] rounded-2xl p-4 flex items-center gap-3 hover:bg-[#faf9fc] transition-colors cursor-pointer"
              >
                {creator.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={creator.avatarUrl}
                    alt={creator.username}
                    className="w-11 h-11 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-[#ede9fb] text-[#7c6fe0] font-semibold text-xs flex items-center justify-center shrink-0">
                    {creator.firstName?.[0]}
                    {creator.lastName?.[0]}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#1a1a2e] truncate">
                    {creator.firstName} {creator.lastName}
                  </p>
                  <p className="text-xs text-[#9a99b0] truncate">@{creator.username}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {brands.length > 0 && (
        <section className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-[#1a1a2e]">
            Brands{' '}
            <span className="text-[#9a99b0] font-normal">({results!.brands.pagination.total})</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {brands.map((brand) => (
              <button
                key={brand.id}
                onClick={() => onViewBrand(brand)}
                className="text-left bg-white border border-[#e8e6f0] rounded-2xl p-4 flex items-center gap-3 hover:bg-[#faf9fc] transition-colors cursor-pointer"
              >
                {brand.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={brand.avatarUrl}
                    alt={brand.username}
                    className="w-11 h-11 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-[#ede9fb] text-[#7c6fe0] font-semibold text-xs flex items-center justify-center shrink-0">
                    {brand.username?.[0]}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#1a1a2e] truncate">{brand.username}</p>
                  {brand.city && <p className="text-xs text-[#9a99b0] truncate">{brand.city}</p>}
                </div>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
