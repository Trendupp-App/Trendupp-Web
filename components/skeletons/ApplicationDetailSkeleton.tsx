export default function ApplicationDetailSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Creator header card */}
      <div className="bg-[#1a1a4d] px-4 py-5 flex items-center gap-4">
        <div className="w-[42px] h-[42px] rounded-full bg-white/20 shrink-0" />
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <div className="h-4 w-32 rounded bg-white/20" />
          <div className="h-3 w-20 rounded bg-white/10" />
        </div>
        <div className="h-6 w-16 rounded-full bg-white/20 shrink-0 mr-6" />
      </div>

      <div className="px-6 py-5 flex flex-col gap-6">
        {/* Application details card */}
        <div className="border border-[#e8e6f0] rounded-xl p-5 flex flex-col gap-4">
          <div className="h-4 w-32 rounded bg-[#e8e6f0]" />

          <div className="flex items-center justify-between">
            <div className="h-3 w-20 rounded bg-[#e8e6f0]" />
            <div className="h-4 w-16 rounded bg-[#e8e6f0]" />
          </div>

          <div className="flex flex-col gap-2">
            <div className="h-3 w-24 rounded bg-[#e8e6f0]" />
            <div className="h-3 w-full rounded bg-[#e8e6f0]" />
            <div className="h-3 w-3/4 rounded bg-[#e8e6f0]" />
          </div>

          <div className="flex items-center justify-between">
            <div className="h-3 w-16 rounded bg-[#e8e6f0]" />
            <div className="h-3 w-20 rounded bg-[#e8e6f0]" />
          </div>

          <div className="flex items-center justify-between">
            <div className="h-3 w-16 rounded bg-[#e8e6f0]" />
            <div className="h-3 w-24 rounded bg-[#e8e6f0]" />
          </div>
        </div>

        {/* Comment card */}
        <div className="border border-[#e8e6f0] rounded-xl p-5 flex flex-col gap-3">
          <div className="h-4 w-36 rounded bg-[#e8e6f0]" />
          <div className="h-3 w-full rounded bg-[#e8e6f0]" />
          <div className="h-3 w-2/3 rounded bg-[#e8e6f0]" />
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-11 rounded-xl bg-[#e8e6f0]" />
          <div className="flex-1 h-11 rounded-xl bg-[#e8e6f0]" />
        </div>
      </div>
    </div>
  );
}
