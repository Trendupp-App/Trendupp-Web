'use client';

import Image from 'next/image';

interface BrandCardProps {
  name: string;
  category: string;
  campaignCount: number;
  followerCount: string;
  image: string;
}

export default function BrandCard({
  name,
  category,
  campaignCount,
  followerCount,
  image,
}: BrandCardProps) {
  return (
    <div className="bg-white border border-[#e8e6f0]/40 rounded-3xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200 select-none">
      {/* Left section: Thumbnail Profile + Text Details */}
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Profile picture with circular pink social badge */}
        <div className="relative w-14 h-14 rounded-2xl bg-zinc-50 overflow-hidden shrink-0">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 56px) 100vw, 56px"
          />
          {/* Overlay badge (matches design snippet circle) */}
          <div className="absolute bottom-0.5 right-0.5 bg-brand-pink text-white w-4.5 h-4.5 rounded-full flex items-center justify-center text-[8.5px] border-2 border-white font-bold">
            @
          </div>
        </div>

        {/* Text descriptions */}
        <div className="flex flex-col min-w-0">
          <h4 className="text-sm font-bold text-[#1a1a2e] leading-tight truncate">{name}</h4>
          <span className="text-xs text-[#9a99b0] font-light mt-0.5 leading-none">{category}</span>
          <span className="text-[11px] text-[#7a7a9a] font-light mt-1.5 whitespace-nowrap leading-none">
            {campaignCount} campaigns &bull; {followerCount} followers
          </span>
        </div>
      </div>

      {/* Right section: Action button */}
      <button className="bg-[#fff0f5] text-brand-pink font-semibold text-xs px-5 py-2.5 rounded-xl hover:bg-[#ffe4ee] transition-colors focus:outline-none shrink-0 ml-4">
        View
      </button>
    </div>
  );
}
