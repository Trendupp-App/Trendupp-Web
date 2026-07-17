import type { ExploreBrand } from '@/types/explore';
import BrandExploreCard from './BrandExploreCard';
import ExploreCardSkeleton from '@/components/skeletons/DraftCardSkeleton';
import EmptyState from '@/shared/EmptyState';

interface BrandsExploreTabProps {
  brands: ExploreBrand[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onView: (brand: ExploreBrand) => void;
}

export default function BrandsExploreTab({
  brands,
  isLoading,
  isError,
  onView,
}: BrandsExploreTabProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <ExploreCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-16 text-center text-sm text-[#9a99b0]">Couldn&apos;t load brands.</div>
    );
  }

  if (!brands || brands.length === 0) {
    return (
      <div className="border border-[#e8e6f0] rounded-2xl">
        <EmptyState title="No brands found" description="Try a different category." />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {brands.map((b) => (
        <BrandExploreCard key={b.id} brand={b} onView={onView} />
      ))}
    </div>
  );
}
