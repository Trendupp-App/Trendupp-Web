'use client';

import Image from 'next/image';
import { Users, TrendingUp, BarChart2 } from 'lucide-react';
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
  followers?: string;
  reach?: string;
  engagement?: string;
  onClick?: () => void;
}

export default function CreatorCard({
  name,
  handle,
  tier,
  rating,
  image,
  followers,
  reach,
  engagement,
  onClick,
}: CreatorCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white border border-[#e8e6f0]/60 rounded-[24px] p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-all duration-200 select-none cursor-pointer active:scale-[0.99] w-full"
    >
      {/* Top Section: Avatar + Text details + Right Rating */}
      <div className="flex items-center justify-between w-full">
        {/* Left: Avatar + Name/Handle */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative w-14 h-14 rounded-full bg-zinc-100 overflow-hidden shrink-0">
            <Image src={image} alt={name} fill className="object-cover" sizes="56px" />
          </div>

          <div className="flex flex-col min-w-0">
            {/* Name + Tier badge */}
            <div className="flex items-center gap-1.5 min-w-0">
              <h4 className="text-sm font-bold text-[#1a1a2e] leading-none truncate">{name}</h4>
              <span
                className={cn(
                  'text-[10px] font-bold px-2 py-0.5 rounded-full leading-none shrink-0 capitalize',
                  tier === 'Micro' && 'bg-[#f5f3ff] text-[#7c3aed]',
                  tier === 'Nano' && 'bg-[#f0fdf4] text-[#16a34a]',
                  tier === 'Macro' && 'bg-[#eff6ff] text-[#2563eb]',
                  tier === 'Mega' && 'bg-[#fff7ed] text-[#ea580c]',
                )}
              >
                {tier}
              </span>
            </div>
            {/* Handle */}
            <span className="text-[11px] text-[#9a99b0] font-light mt-1.5 leading-none truncate">
              @{handle}
            </span>
          </div>
        </div>

        {/* Right: Star Rating */}
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-[#f59e0b] text-base leading-none">&#9733;</span>
          <span className="text-xs font-bold text-[#1a1a2e] leading-none">{rating}</span>
        </div>
      </div>

      {/* Middle Section: Stats row */}
      <div className="flex items-center gap-4 text-[11px] text-[#7a7a9a] font-light mt-1 flex-wrap">
        <div className="flex items-center gap-1">
          <Users className="w-3.5 h-3.5 text-[#9a99b0]" />
          <span>
            Followers: <span className="font-bold text-[#1a1a2e]">{followers ?? '284K'}</span>
          </span>
        </div>
        <div className="flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5 text-[#9a99b0]" />
          <span>
            Reach <span className="font-bold text-[#1a1a2e]">{reach ?? '1.2M'}</span>
          </span>
        </div>
        <div className="flex items-center gap-1">
          <BarChart2 className="w-3.5 h-3.5 text-[#9a99b0]" />
          <span>
            Engagement <span className="font-bold text-[#1a1a2e]">{engagement ?? '7.2%'}</span>
          </span>
        </div>
      </div>

      {/* Bottom Section: Full-width button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
        className="w-full py-3 bg-[#f4f4f8] hover:bg-[#eaeaf0] text-[#1a1a2e] font-semibold text-xs rounded-2xl transition-colors focus:outline-none cursor-pointer border-none text-center"
      >
        View Profile
      </button>
    </div>
  );
}
