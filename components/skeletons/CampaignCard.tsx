import { Skeleton } from '@/components/ui/skeleton';

export default function CampaignCardSkeleton() {
  return (
    <div className="bg-white border border-[#e8e6f0] rounded-2xl overflow-hidden flex flex-col">
      {/* Cover image placeholder */}
      <Skeleton className="w-full h-44 rounded-none" />

      {/* Body */}
      <div className="flex flex-col gap-2 p-4 flex-1">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-12 rounded-full shrink-0" />
        </div>

        <Skeleton className="h-3 w-20" />

        <div className="flex items-center justify-between mt-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>

        <Skeleton className="h-9 w-full mt-1 rounded-xl" />
      </div>
    </div>
  );
}
