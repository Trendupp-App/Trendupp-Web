export default function CreatorTierSkeleton() {
  return (
    <div className="flex flex-col gap-6 w-full pb-12 px-4 md:px-8 py-6 animate-pulse">
      <div className="h-4 w-16 rounded bg-[#e8e6f0]" />

      {/* Hero card */}
      <div className="rounded-[32px] bg-[#e8e6f0]/60 p-6 md:p-10 flex flex-col items-center gap-4">
        <div className="h-6 w-32 rounded-full bg-white/60" />
        <div className="h-9 w-48 rounded bg-white/60" />
        <div className="h-4 w-56 rounded bg-white/50" />
        <div className="w-full h-24 rounded-2xl bg-white/40 mt-2" />
      </div>

      {/* Connected accounts */}
      <div className="flex flex-col gap-3">
        <div className="h-4 w-44 rounded bg-[#e8e6f0]" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 rounded-2xl bg-[#e8e6f0]/60" />
          ))}
        </div>
        <div className="h-14 rounded-2xl bg-[#e8e6f0]/60" />
      </div>

      {/* All tiers grid */}
      <div className="flex flex-col gap-3">
        <div className="h-4 w-24 rounded bg-[#e8e6f0]" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-3xl bg-[#e8e6f0]/60" />
          ))}
        </div>
      </div>

      {/* Need help */}
      <div className="h-28 rounded-3xl bg-[#e8e6f0]/60" />
    </div>
  );
}
