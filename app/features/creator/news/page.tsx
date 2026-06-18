'use client';

export default function CreatorNewsPage() {
  return (
    <div className="flex flex-col gap-6 w-full pb-12 select-none">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-[28px] font-bold text-[#1a1a2e] tracking-tight">News Updates</h1>
        <p className="text-sm font-light text-[#7a7a9a]">
          Stay updated with the latest platform news and creator trends
        </p>
      </div>
      <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-8 text-center text-[#7a7a9a] font-light mt-4">
        News dashboard is coming soon! Check back later for details.
      </div>
    </div>
  );
}
