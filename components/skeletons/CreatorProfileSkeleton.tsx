// components/skeletons/CreatorProfileSkeleton.tsx
export default function CreatorProfileSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-[#1a1a4d] px-4 py-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-white/20 shrink-0" />
        <div className="flex-1 flex flex-col gap-2">
          <div className="h-4 w-32 rounded bg-white/20" />
          <div className="h-3 w-24 rounded bg-white/10" />
          <div className="h-3 w-28 rounded bg-white/10" />
        </div>
      </div>

      <div className="px-4 py-5">
        <div className="border border-[#e8e6f0] rounded-2xl p-4 grid grid-cols-3 sm:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="h-3 w-12 rounded bg-[#e8e6f0]" />
              <div className="h-4 w-10 rounded bg-[#e8e6f0]" />
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 flex flex-col gap-4">
        <div className="h-10 rounded-full bg-[#f4f3f6]" />
        <div className="h-20 rounded-2xl border border-[#e8e6f0] bg-[#faf9fc]" />
        <div className="h-16 rounded-2xl border border-[#e8e6f0] bg-[#faf9fc]" />
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-xl bg-[#f4f3f6]" />
          ))}
        </div>
      </div>
    </div>
  );
}
