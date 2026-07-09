export default function SubmissionCardSkeleton() {
  return (
    <div className="border border-[#e8e6f0] rounded-xl p-5 flex flex-col gap-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#f4f3f6] shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-3.5 w-32 rounded bg-[#f4f3f6]" />
          <div className="h-3 w-24 rounded bg-[#f4f3f6]" />
        </div>
      </div>
      <div className="h-16 rounded-lg bg-[#f4f3f6]" />
    </div>
  );
}
