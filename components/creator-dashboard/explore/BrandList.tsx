'use client';

import BrandExploreCard from '@/components/BrandExplore/BrandExploreCard';
import type { ExploreBrand } from '@/types/explore';

export default function BrandsList({
  brands,
  isLoading,
  isError,
  onView,
}: {
  brands: ExploreBrand[];
  isLoading: boolean;
  isError: boolean;
  onView: (brand: ExploreBrand) => void;
}) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-[88px] bg-gray-50 border border-gray-100 rounded-2xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[#9a99b0] gap-2">
        <span className="text-sm">Couldn&apos;t load brands. Please try again.</span>
      </div>
    );
  }

  if (brands.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[#9a99b0] gap-2">
        <span className="text-sm">No brands found</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {brands.map((brand) => (
        <BrandExploreCard key={brand.id} brand={brand} onView={onView} />
      ))}
    </div>
  );
}
