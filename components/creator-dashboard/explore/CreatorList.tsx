'use client';

import CreatorExploreCard from '@/components/BrandExplore/CreatorExploreCard';
import type { ExploreCreator } from '@/types/explore';

export default function CreatorsList({
  creators,
  isLoading,
  isError,
  onView,
}: {
  creators: ExploreCreator[];
  isLoading: boolean;
  isError: boolean;
  onView: (creator: ExploreCreator) => void;
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
        <span className="text-sm">Couldn&apos;t load creators. Please try again.</span>
      </div>
    );
  }

  if (creators.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[#9a99b0] gap-2">
        <span className="text-sm">No creators found</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {creators.map((creator) => (
        <CreatorExploreCard key={creator.id} creator={creator} onView={onView} />
      ))}
    </div>
  );
}
