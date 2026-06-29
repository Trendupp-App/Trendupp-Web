'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

interface CreatorCardProps {
  name: string;
  handle: string;
  category: string;
  displayCategory?: string;
  tier: 'Micro' | 'Nano' | 'Macro' | 'Mega';
  rating: number;
  campaignCount: number;
  image: string;
  onClick?: () => void;
}

export default function CreatorCard({
  name,
  handle,
  category,
  displayCategory,
  tier,
  rating,
  campaignCount,
  image,
  onClick,
}: CreatorCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white border border-[#e8e6f0]/40 rounded-2xl p-3.5 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200 select-none cursor-pointer active:scale-[0.99]"
    >
      {/* Left: Circular avatar + Text */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Circular avatar */}
        <div className="relative w-12 h-12 rounded-full bg-zinc-100 overflow-hidden shrink-0">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 48px) 100vw, 48px"
          />
        </div>

        {/* Text */}
        <div className="flex flex-col min-w-0">
          {/* Name & Tier Badge Inline */}
          <div className="flex items-center gap-1.5 min-w-0">
            <h4 className="text-sm font-bold text-[#1a1a2e] leading-none truncate">{name}</h4>
            <span
              className={cn(
                'text-[9px] font-bold px-2 py-0.5 rounded-full leading-none shrink-0 uppercase tracking-wider',
                tier === 'Micro' && 'bg-[#f5f3ff] text-[#7c3aed]',
                tier === 'Nano' && 'bg-[#f0fdf4] text-[#16a34a]',
                tier === 'Macro' && 'bg-[#eff6ff] text-[#2563eb]',
                tier === 'Mega' && 'bg-[#fff7ed] text-[#ea580c]',
              )}
            >
              {tier}
            </span>
          </div>
          <span className="text-[11px] text-[#9a99b0] font-light mt-1.5 leading-none truncate">
            @{handle} &middot; {displayCategory || category}
          </span>
          {/* Star rating & campaigns */}
          <span className="text-[11px] text-[#7a7a9a] font-light mt-1.5 flex items-center gap-1 leading-none">
            <span className="text-[#f59e0b]">&#9733;</span>
            <span className="font-bold text-[#1a1a2e]">{rating}</span>
            <span className="text-[#c8c6d8]">&middot;</span>
            <span>{campaignCount} campaigns</span>
          </span>
        </div>
      </div>

      {/* Right: Profile button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
        className="bg-[#fff0f5] text-brand-pink font-semibold text-xs px-4 py-2 rounded-xl hover:bg-[#ffe4ee] transition-colors focus:outline-none shrink-0 ml-3 whitespace-nowrap"
      >
        View profile
      </button>
    </div>
  );
}
