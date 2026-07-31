'use client';

import Image from 'next/image';
import { Check, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import TokenIcon from '@/components/icons/TokenIcon';

interface SocialCampaignCardProps {
  title: string;
  brand: string;
  daysLeft?: string;
  tokens: string;
  image: string;
  showParticipate?: boolean;
  className?: string;
  onParticipate?: () => void;
  onViewBrief?: () => void;
  isParticipating?: boolean;
  hasApplied?: boolean;
  participateLabel?: string;
  appliedLabel?: string;
  badgeLabel?: string;
  badgeClassName?: string;
}

export default function SocialCampaignCard({
  title,
  brand,
  daysLeft,
  tokens,
  image,
  showParticipate = true,
  className,
  onParticipate,
  onViewBrief,
  isParticipating = false,
  hasApplied = false,
  participateLabel = 'Participate',
  appliedLabel = 'Applied',
  badgeLabel = 'Live',
  badgeClassName = 'bg-[#e6f9f1] text-[#00c37b]',
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
        <div
          className={cn(
            'absolute top-3 left-3 text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-sm z-10',
            badgeClassName,
          )}
        >
          {badgeLabel}
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

        {/* Tokens */}
        <div className="flex items-center gap-1.5 text-brand-pink font-bold text-xs sm:text-sm mt-4">
          <TokenIcon size={14} className="text-brand-pink shrink-0" />
          <span>{tokens}</span>
        </div>

        {/* Actions */}
        <div className="flex items-stretch gap-2 mt-3">
          {showParticipate &&
            (hasApplied ? (
              <button
                disabled
                className="flex-1 min-w-0 flex items-center justify-center gap-1.5 bg-[#f4f3f6] text-[#7a7a9a] px-3 py-2 rounded-xl text-xs font-semibold cursor-not-allowed"
              >
                <Check size={13} className="shrink-0" />
                <span className="truncate">{appliedLabel}</span>
              </button>
            ) : (
              <button
                onClick={onParticipate}
                disabled={isParticipating}
                className="flex-1 min-w-0 bg-brand-pink hover:bg-brand-pink/90 text-white transition-all duration-250 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed truncate"
              >
                {isParticipating ? 'Joining…' : participateLabel}
              </button>
            ))}
          <button
            onClick={onViewBrief}
            className="flex-1 min-w-0 bg-[#fef2f6] hover:bg-brand-pink/10 text-brand-pink transition-all duration-250 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer truncate"
          >
            View brief
          </button>
        </div>
      </div>
    </div>
  );
}
