import { Skeleton } from '@/components/ui/skeleton';

export default function MyWorkPageSkeleton() {
  return (
    <div className="flex flex-col gap-6 w-full pb-12 select-none">
      {/* Page title & subtitle */}
      <div className="flex flex-col gap-1">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-48 mt-1" />
      </div>

      {/* WorkTabs skeleton */}
      <div className="flex flex-col gap-4 w-full">
        <div className="flex gap-6 border-b border-[#e8e6f0]/60 w-full pb-3">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex items-center justify-between gap-3 py-1 w-full">
          <div className="flex items-center gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-24 rounded-full" />
            ))}
          </div>
          <Skeleton className="h-9 w-20 rounded-full shrink-0" />
        </div>
      </div>

      {/* Campaign cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-white border border-[#e8e6f0]/60 rounded-[32px] overflow-hidden flex flex-col"
          >
            <Skeleton className="w-full h-[160px] rounded-none" />
            <div className="p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between w-full">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-4 w-16 rounded-full" />
                </div>
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-5 w-24 mt-1" />
              </div>
              <Skeleton className="h-10 w-full rounded-2xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
