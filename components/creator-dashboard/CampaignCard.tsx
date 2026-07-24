'use client';

import Image from 'next/image';
import { Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CampaignCardProps {
  title: string;
  brand: string;
  budget: string;
  daysLeft: string;
  tier: string;
  appliedCount: number;
  image: string;
  hideApplied?: boolean;
  status?: string;
}

export default function CampaignCard({
  title,
  brand,
  budget,
  daysLeft,
  tier,
  appliedCount,
  image,
  hideApplied = false,
  status,
}: CampaignCardProps) {
  const isClosed = daysLeft.toLowerCase() === 'closed';

  return (
    <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl overflow-hidden hover:shadow-[0_8px_30px_rgba(4,0,57,0.05)] transition-all duration-300 flex flex-col h-full group cursor-pointer select-none">
      {/* Thumbnail area */}
      <div className="relative w-full h-[160px] bg-zinc-100 overflow-hidden shrink-0">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-w-768px) 100vw, 300px"
        />

        {/* Bottom-right Overlay Badge (Live or Creator Tier for Closed campaigns) */}
        {isClosed ? (
          <div
            className={cn(
              'absolute bottom-3 right-3 text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-sm z-10',
              tier === 'Nano' ? 'bg-[#e6f9f1] text-[#00c37b]' : 'bg-[#f5f3ff] text-[#7c3aed]',
            )}
          >
            {tier}
          </div>
        ) : (
          <div
            className={cn(
              'absolute bottom-3 right-3 text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-sm z-10 capitalize select-none',
              status === 'live'
                ? 'bg-[#e6f9f1] text-[#00c37b]'
                : status === 'submitted'
                  ? 'bg-[#eff6ff] text-[#2563eb]'
                  : 'bg-[#fef3c7] text-[#d97706]',
            )}
          >
            {status || 'Live'}
          </div>
        )}
      </div>

      {/* Content details */}
      <div className="p-4 flex flex-col justify-between flex-1">
        {/* Title and Tier / Brand */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-start gap-2">
            <h4 className="text-sm sm:text-base font-bold text-[#1a1a2e] group-hover:text-brand-pink transition-colors line-clamp-1 leading-snug">
              {title}
            </h4>
            <span className="text-[10px] sm:text-xs font-semibold text-[#7c3aed] bg-[#f5f3ff] px-2 py-0.5 rounded-md shrink-0 hidden lg:inline-block">
              {tier}
            </span>
          </div>
          <p className="text-[11px] sm:text-xs font-light text-[#7a7a9a]">{brand}</p>
        </div>

        {/* Budget & Applied count */}
        <div className="flex items-center justify-between mt-3.5">
          <span className="text-xs sm:text-sm font-extrabold text-brand-pink">{budget}</span>

          {!hideApplied && (
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-light text-[#7a7a9a]">
              <Users size={12} className="text-[#9a99b0] sm:w-3.5 sm:h-3.5" />
              <span>{appliedCount} applied</span>
            </div>
          )}
        </div>

        {/* Apply / View Details Button */}
        <button className="w-full bg-[#f5f3ff] text-[#4c49d8] hover:bg-brand-pink hover:text-white transition-colors duration-200 font-bold text-xs sm:text-sm py-2.5 sm:py-3 rounded-xl text-center mt-4 cursor-pointer">
          {isClosed ? 'View Details' : 'Apply'}
        </button>
      </div>
    </div>
  );
}
