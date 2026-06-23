'use client';

import Image from 'next/image';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface WorkCampaign {
  id: number;
  title: string;
  brand: string;
  budgetMinMax: string; // e.g. "₦150K–₦300K"
  budgetString: string; // e.g. "₦150,000 – 300,000"
  daysLeft: string; // e.g. "4d" or "1d 14h"
  status:
    | 'In progress'
    | 'Revision requested'
    | 'Selected'
    | 'Pending'
    | 'Declined'
    | 'Done'
    | 'Payment released'
    | 'Awaiting payment';
  platform: string; // e.g. "Instagram"
  tier: string; // e.g. "Micro"
  guidelines: string;
  image: string;
}

interface WorkCampaignCardProps {
  campaign: WorkCampaign;
  onShowMoreInfo: (campaign: WorkCampaign) => void;
  isSelected?: boolean;
}

export default function WorkCampaignCard({
  campaign,
  onShowMoreInfo,
  isSelected = false,
}: WorkCampaignCardProps) {
  const statusStyles = {
    'In progress': 'bg-[#eff6ff] text-[#2563eb]',
    'Revision requested': 'bg-[#fef3c7] text-[#d97706]',
    Selected: 'bg-[#f0fdf4] text-[#16a34a]',
    Pending: 'bg-[#fef3c7] text-[#d97706]',
    Declined: 'bg-[#fef2f2] text-[#dc2626]',
    Done: 'bg-[#f0fdf4] text-[#16a34a]',
    'Payment released': 'bg-[#f0fdf4] text-[#16a34a]',
    'Awaiting payment': 'bg-[#fef3c7] text-[#d97706]',
  };

  return (
    <div
      className={cn(
        'bg-white border rounded-3xl overflow-hidden hover:shadow-[0_8px_30px_rgba(4,0,57,0.04)] transition-all duration-300 flex flex-col h-full group select-none',
        isSelected ? 'border-[#2563eb] ring-1 ring-[#2563eb]/20' : 'border-[#e8e6f0]/50',
      )}
    >
      {/* Thumbnail area */}
      <div className="relative w-full h-[150px] bg-zinc-50 overflow-hidden shrink-0">
        <Image
          src={campaign.image}
          alt={campaign.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 350px"
        />

        {/* Days left badge overlay */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/45 backdrop-blur-md text-white text-[10px] font-medium px-2.5 py-1 rounded-full border border-white/10">
          <Clock size={11} className="text-white" />
          <span>{campaign.daysLeft} left</span>
        </div>
      </div>

      {/* Content details */}
      <div className="p-4 flex flex-col justify-between flex-1 gap-4">
        <div className="flex items-start justify-between gap-2">
          {/* Left section: Title & Brand */}
          <div className="flex flex-col min-w-0">
            <h4 className="text-sm font-bold text-[#1a1a2e] leading-snug truncate">
              {campaign.title}
            </h4>
            <p className="text-[11px] font-light text-[#7a7a9a] mt-0.5">{campaign.brand}</p>
          </div>

          {/* Right section: Budget & Status Badge */}
          <div className="flex flex-col items-end shrink-0 gap-1.5">
            <span className="text-xs font-bold text-[#1a1a2e]">{campaign.budgetMinMax}</span>
            <span
              className={cn(
                'text-[10px] font-semibold px-2 py-0.5 rounded-md leading-none whitespace-nowrap',
                statusStyles[campaign.status],
              )}
            >
              {campaign.status}
            </span>
          </div>
        </div>

        {/* Actions Rendering depending on status */}
        {(campaign.status === 'In progress' ||
          campaign.status === 'Revision requested' ||
          campaign.status === 'Done' ||
          campaign.status === 'Payment released' ||
          campaign.status === 'Awaiting payment') && (
          <button
            onClick={() => onShowMoreInfo(campaign)}
            className="w-full bg-[#f8f7fa] hover:bg-[#e8e7ee] text-[#7a7a9a] text-xs font-semibold py-2.5 rounded-2xl transition-colors mt-auto"
          >
            Show more info
          </button>
        )}

        {campaign.status === 'Selected' && (
          <div className="flex flex-col gap-2.5 mt-auto w-full">
            <div className="flex items-center gap-2">
              <button className="bg-[#10b981] hover:bg-[#059669] text-white text-xs font-bold py-2.5 px-4 rounded-xl flex-1 transition-colors">
                Accept offer
              </button>
              <button className="bg-[#fee2e2] hover:bg-[#fecaca] text-[#dc2626] text-xs font-bold py-2.5 px-4 rounded-xl flex-1 transition-colors">
                Decline offer
              </button>
            </div>
            <button
              onClick={() => onShowMoreInfo(campaign)}
              className="text-[11px] font-semibold text-[#9a99b0] hover:text-[#d7176f] transition-all text-center block"
            >
              More details &gt;
            </button>
          </div>
        )}

        {campaign.status === 'Pending' && (
          <div className="flex flex-col gap-2.5 mt-auto w-full">
            <div className="bg-[#fffbeb] border border-[#fef3c7] text-[#b45309] py-2 px-3 text-[10px] font-medium rounded-xl flex items-center gap-1.5 select-none leading-snug">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d97706] shrink-0" />
              <span>Awaiting brand decision - Results within 48hrs</span>
            </div>
            <button
              onClick={() => onShowMoreInfo(campaign)}
              className="text-[11px] font-semibold text-[#9a99b0] hover:text-[#d7176f] transition-all text-center block"
            >
              More details &gt;
            </button>
          </div>
        )}

        {campaign.status === 'Declined' && (
          <div className="flex flex-col gap-2.5 mt-auto w-full">
            <div className="bg-[#fef2f2] border border-[#fee2e2] text-[#b91c1c] py-2 px-3 text-[10px] font-medium rounded-xl flex items-center gap-1.5 select-none leading-snug">
              <span className="w-1.5 h-1.5 rounded-full bg-[#dc2626] shrink-0" />
              <span>Sorry you have not been selected for this campaign</span>
            </div>
            <button
              onClick={() => onShowMoreInfo(campaign)}
              className="text-[11px] font-semibold text-[#9a99b0] hover:text-[#d7176f] transition-all text-center block"
            >
              More details &gt;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
