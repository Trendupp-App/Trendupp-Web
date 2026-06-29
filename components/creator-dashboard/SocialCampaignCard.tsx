'use client';

import Image from 'next/image';
import { Clock, Ticket } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SocialCampaignCardProps {
  title: string;
  brand: string;
  daysLeft?: string;
  tokens: string;
  image: string;
  showParticipate?: boolean;
  className?: string;
}

export default function SocialCampaignCard({
  title,
  brand,
  daysLeft,
  tokens,
  image,
  showParticipate = true,
  className,
}: SocialCampaignCardProps) {
  return (
    <div
      className={cn(
        'bg-white border border-[#e8e6f0]/60 rounded-3xl p-4 flex flex-col hover:shadow-[0_8px_30px_rgba(4,0,57,0.04)] transition-all duration-300 h-full',
        className,
      )}
    >
      {/* Image Banner */}
      <div className="relative w-full h-[180px] rounded-2xl overflow-hidden bg-zinc-100 shrink-0">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-all duration-500 hover:scale-103"
          sizes="(max-w-768px) 100vw, 350px"
        />
        {/* Image Overlays */}
        {daysLeft && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/45 backdrop-blur-md text-white text-[10px] font-medium px-2.5 py-1 rounded-full border border-white/10 z-10">
            <Clock size={11} className="text-white" />
            <span>{daysLeft}</span>
          </div>
        )}
        <div className="absolute top-3 left-3 bg-[#e6f9f1] text-[#00c37b] text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-sm z-10">
          Live
        </div>
      </div>

      {/* Card Details */}
      <div className="flex flex-col flex-1 justify-between mt-4">
        <div>
          <h4 className="text-base sm:text-lg font-bold text-[#1a1a2e] leading-tight hover:text-brand-pink transition-colors line-clamp-1">
            {title}
          </h4>
          <p className="text-xs sm:text-sm text-[#7a7a9a] font-light mt-1">{brand}</p>
        </div>

        {/* Bottom Row */}
        <div className="flex items-center justify-between mt-4">
          {/* Tokens */}
          <div className="flex items-center gap-1.5 text-brand-pink font-bold text-xs sm:text-sm">
            <Ticket size={14} className="text-brand-pink shrink-0" />
            <span>{tokens}</span>
          </div>

          {/* Participate Action */}
          {showParticipate && (
            <button className="bg-[#fef2f6] hover:bg-brand-pink text-brand-pink hover:text-white transition-all duration-250 px-4 py-1.5 rounded-xl text-xs font-semibold cursor-pointer shrink-0">
              Participate
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
