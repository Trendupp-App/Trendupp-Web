import type { ExploreCreator } from '@/types/explore';
import CreatorExploreCard from './CreatorExploreCard';
import ExploreCardSkeleton from '@/components/skeletons/DraftCardSkeleton';
import EmptyState from '@/shared/EmptyState';

interface CreatorsExploreTabProps {
  creators: ExploreCreator[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onView: (creator: ExploreCreator) => void;
}

export default function CreatorsExploreTab({
  creators,
  isLoading,
  isError,
  onView,
}: CreatorsExploreTabProps) {
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
      <div className="py-16 text-center text-sm text-[#9a99b0]">Couldn&apos;t load creators.</div>
    );
  }

  if (!creators || creators.length === 0) {
    return (
      <div className="border border-[#e8e6f0] rounded-2xl">
        <EmptyState title="No creators found" description="Try a different category." />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {creators.map((c) => (
        <CreatorExploreCard key={c.id} creator={c} onView={onView} />
      ))}
    </div>
  );
}
