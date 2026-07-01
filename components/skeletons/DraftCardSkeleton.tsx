import { Skeleton } from '@/components/ui/skeleton';

export default function DraftCampaignCardSkeleton() {
  return (
    <div className="flex items-center gap-4 bg-white border border-[#e8e6f0] rounded-2xl px-5 py-4">
      {/* Icon placeholder */}
      <Skeleton className="w-16 h-16 rounded-xl shrink-0" />

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <Skeleton className="h-4 w-48" />
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-3 w-28" />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <Skeleton className="h-8 w-24 rounded-lg" />
        <Skeleton className="w-8 h-8 rounded-lg" />
      </div>
    </div>
  );
}
