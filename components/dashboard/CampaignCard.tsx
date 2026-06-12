'use client';

import Image from 'next/image';
import { Clock, Users } from 'lucide-react';

interface CampaignCardProps {
  title: string;
  brand: string;
  budget: string;
  daysLeft: string;
  tier: string;
  appliedCount: number;
  image: string;
}

export default function CampaignCard({
  title,
  brand,
  budget,
  daysLeft,
  tier,
  appliedCount,
  image,
}: CampaignCardProps) {
  return (
    <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl overflow-hidden hover:shadow-[0_8px_30px_rgba(4,0,57,0.05)] transition-all duration-300 flex flex-col h-full group cursor-pointer">
      {/* Thumbnail area */}
      <div className="relative w-full h-[150px] bg-zinc-100 overflow-hidden shrink-0">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-w-768px) 100vw, 300px"
        />

        {/* Days left badge overlay */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-md text-white text-[10px] font-medium px-2.5 py-1 rounded-full border border-white/10">
          <Clock size={11} className="text-white" />
          <span>{daysLeft} left</span>
        </div>
      </div>

      {/* Content details */}
      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          <h4 className="text-sm font-semibold text-[#1a1a2e] group-hover:text-brand-pink transition-colors line-clamp-1 leading-snug">
            {title}
          </h4>
          <p className="text-[11px] font-light text-[#7a7a9a] mt-0.5">{brand}</p>
        </div>

        {/* Bottom row: budget & details */}
        <div className="flex items-center justify-between border-t border-[#e8e6f0]/60 pt-3.5 mt-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase font-semibold text-brand-pink tracking-wide">
              Budget
            </span>
            <span className="text-xs font-bold text-brand-pink">{budget}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Tier Badge */}
            <span className="text-[10px] font-semibold text-[#7c3aed] bg-[#f5f3ff] px-2 py-0.5 rounded-md">
              {tier}
            </span>

            {/* Applied count */}
            <div className="flex items-center gap-1 text-[10px] font-light text-[#7a7a9a]">
              <Users size={12} className="text-[#9a99b0]" />
              <span>{appliedCount} applied</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
