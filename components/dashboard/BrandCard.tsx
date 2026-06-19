'use client';

import Image from 'next/image';

interface BrandCardProps {
  name: string;
  category: string;
  campaignCount: number;
  followerCount: string;
  image: string;
  onClick?: () => void;
}

export default function BrandCard({
  name,
  category,
  campaignCount,
  followerCount,
  image,
  onClick,
}: BrandCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white border border-[#e8e6f0]/40 rounded-2xl p-3.5 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200 select-none cursor-pointer active:scale-[0.99]"
    >
      {/* Left: Image + Text */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Square rounded image with overlapping pink hashtag badge */}
        <div className="relative w-14 h-14 shrink-0 select-none">
          <div className="w-full h-full rounded-xl bg-zinc-100 overflow-hidden">
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 56px) 100vw, 56px"
            />
          </div>
          {/* Overlapping Pink Badge */}
          <div className="absolute -bottom-0.5 -left-0.5 w-5 h-5 rounded-full bg-brand-pink border-2 border-white flex items-center justify-center shadow-sm">
            <span className="text-[7px] text-white font-bold leading-none">#</span>
          </div>
        </div>

        {/* Text */}
        <div className="flex flex-col min-w-0">
          <h4 className="text-sm font-bold text-[#1a1a2e] leading-tight truncate">{name}</h4>
          <span className="text-[11px] text-[#9a99b0] font-light mt-0.5 leading-none">
            {category}
          </span>
          <span className="text-[11px] text-[#7a7a9a] font-light mt-1.5 whitespace-nowrap leading-none">
            {campaignCount} campaigns &nbsp;&middot;&nbsp; {followerCount} followers
          </span>
        </div>
      </div>

      {/* Right: View button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
        className="bg-[#fff0f5] text-brand-pink font-semibold text-xs px-4 py-2 rounded-xl hover:bg-[#ffe4ee] transition-colors focus:outline-none shrink-0 ml-3"
      >
        View
      </button>
    </div>
  );
}
