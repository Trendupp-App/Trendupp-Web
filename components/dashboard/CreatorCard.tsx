'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

interface CreatorCardProps {
  name: string;
  handle: string;
  category: string;
  tier: 'Micro' | 'Nano' | 'Macro' | 'Mega';
  rating: number;
  campaignCount: number;
  image: string;
}

export default function CreatorCard({
  name,
  handle,
  category,
  tier,
  rating,
  campaignCount,
  image,
}: CreatorCardProps) {
  // Tier badge color schemas matching designs
  const tierStyles = {
    Micro: 'bg-[#f5f3ff] text-[#7c3aed]',
    Nano: 'bg-[#f0fdf4] text-[#16a34a]',
    Macro: 'bg-[#eff6ff] text-[#2563eb]',
    Mega: 'bg-[#fef3c7] text-[#d97706]',
  };

  return (
    <div className="bg-white border border-[#e8e6f0]/40 rounded-3xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200 select-none">
      {/* Left section: Circular Profile Thumbnail + Text Details */}
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Profile picture (circular) */}
        <div className="relative w-14 h-14 rounded-full bg-zinc-100 overflow-hidden shrink-0">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 56px) 100vw, 56px"
          />
        </div>

        {/* Text descriptions */}
        <div className="flex flex-col min-w-0">
          {/* Name & Tier Badge row */}
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-[#1a1a2e] leading-tight truncate">{name}</h4>
            <span
              className={cn(
                'text-[9.5px] font-semibold px-2 py-0.5 rounded-md leading-none shrink-0',
                tierStyles[tier],
              )}
            >
              {tier}
            </span>
          </div>

          <span className="text-xs text-[#9a99b0] font-light mt-1 leading-none truncate">
            @{handle} &bull; {category}
          </span>

          {/* Star rating & Campaigns */}
          <span className="text-[11px] text-[#7a7a9a] font-light mt-1.5 flex items-center gap-1 leading-none">
            <span className="text-amber-500 font-sans">&#9733;</span>
            <span className="font-bold text-[#1a1a2e]">{rating}</span>
            <span className="text-[#9a99b0] font-light">&bull;</span>
            <span>{campaignCount} campaigns</span>
          </span>
        </div>
      </div>

      {/* Right section: View profile button */}
      <button className="bg-[#fff0f5] text-brand-pink font-semibold text-xs px-5 py-2.5 rounded-xl hover:bg-[#ffe4ee] transition-colors focus:outline-none shrink-0 ml-4">
        View profile
      </button>
    </div>
  );
}
