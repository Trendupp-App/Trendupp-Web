import { Skeleton } from '@/components/ui/skeleton';

export default function CampaignDetailSkeleton() {
  return (
    <div className="max-w-[900px] mx-auto px-6 py-8 flex flex-col gap-6">
      {/* Back button */}
      <Skeleton className="h-4 w-32" />

      {/* Cover image */}
      <Skeleton className="w-full h-56 rounded-2xl" />

      {/* Stats row */}
      <div className="border border-[#e8e6f0] rounded-xl p-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>

      {/* Tab switcher */}
      <Skeleton className="h-10 w-64 rounded-xl" />

      {/* Overview content */}
      <div className="flex flex-col gap-4">
        {/* Info boxes row */}
        <div className="border border-[#e8e6f0] rounded-xl p-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="h-3 w-14" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>

        {/* Section blocks */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border border-[#e8e6f0] rounded-xl p-5 flex flex-col gap-3">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
          </div>
        ))}
      </div>
    </div>
  );
}
