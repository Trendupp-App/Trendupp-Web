'use client';

import Image from 'next/image';
import { Clock, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

type CampaignStatus = 'live' | 'content_review' | 'revision' | 'completed' | 'draft';
type CreatorTier = 'Nano' | 'Micro' | 'Macro' | 'Mega';

interface BrandCampaignCardProps {
  id: string;
  title: string;
  category: string;
  budget: number;
  currencySymbol?: string;
  status: CampaignStatus;
  timeLeft: string;
  tier: CreatorTier;
  imageSrc?: string;
  applicantsCount?: number;
  onViewDetails?: (id: string) => void;
}

const STATUS_CONFIG: Record<CampaignStatus, { label: string; className: string }> = {
  live: {
    label: 'Live',
    className: 'bg-green-100 text-green-700',
  },
  content_review: {
    label: 'Content review',
    className: 'bg-amber-100 text-amber-700',
  },
  revision: {
    label: 'Revision',
    className: 'bg-amber-100 text-amber-700',
  },
  completed: {
    label: 'Completed',
    className: 'bg-blue-100 text-blue-700',
  },
  draft: {
    label: 'Draft',
    className: 'bg-gray-100 text-gray-600',
  },
};

const TIER_COLORS: Record<CreatorTier, string> = {
  Nano: 'text-pink-500 border-pink-200 bg-pink-50',
  Micro: 'text-purple-500 border-purple-200 bg-purple-50',
  Macro: 'text-blue-500 border-blue-200 bg-blue-50',
  Mega: 'text-amber-500 border-amber-200 bg-amber-50',
};

export default function BrandCampaignCard({
  id,
  title,
  category,
  budget,
  currencySymbol = '₦',
  status,
  timeLeft,
  tier,
  imageSrc,
  applicantsCount,
  onViewDetails,
}: BrandCampaignCardProps) {
  const statusCfg = STATUS_CONFIG[status];

  return (
    <div className="bg-white rounded-2xl border border-[#f0eef8] overflow-hidden shadow-sm flex flex-col">
      {/* Image */}
      <div className="relative aspect-[16/9] bg-[#1a1a2e] overflow-hidden">
        {imageSrc && <Image src={imageSrc} alt={title} fill className="object-cover" />}

        {/* Time left badge */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-1 rounded-full">
          <Clock size={11} />
          {timeLeft}
        </div>

        {/* Status badge */}
        <div
          className={cn(
            'absolute bottom-2.5 right-2.5 text-[11px] font-semibold px-2.5 py-1 rounded-full',
            statusCfg.className,
          )}
        >
          {statusCfg.label}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#1a1a2e] truncate">{title}</p>
            <p className="text-xs text-[#9a99b0] mt-0.5">{category}</p>
          </div>
          <span
            className={cn(
              'text-[11px] font-semibold px-2.5 py-0.5 rounded-full border shrink-0',
              TIER_COLORS[tier],
            )}
          >
            {tier}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-brand-pink">
            {currencySymbol}
            {budget.toLocaleString()}
          </span>
          {applicantsCount !== undefined && (
            <div className="flex items-center gap-1.5 text-xs text-[#9a99b0]">
              <Users size={13} />
              {applicantsCount} applied
            </div>
          )}
        </div>

        <button
          onClick={() => onViewDetails?.(id)}
          className="w-full py-2.5 rounded-xl border border-[#e0ddef] text-sm font-medium text-[#1a1a2e] hover:bg-[#faf9fc] transition-colors"
        >
          View details
        </button>
      </div>
    </div>
  );
}
