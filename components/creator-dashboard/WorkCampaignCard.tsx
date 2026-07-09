'use client';

import Image from 'next/image';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface WorkCampaign {
  id: string;
  title: string;
  brand: string;
  budgetMinMax: string; // e.g. "₦150K–₦300K"
  budgetString: string; // e.g. "₦150,000 – 300,000"
  daysLeft: string; // e.g. "4d" or "1d 14h"
  status:
    | 'In progress'
    | 'Under review'
    | 'Revision requested'
    | 'Approved'
    | 'Selected'
    | 'Pending'
    | 'Declined'
    | 'Payment released';
  platform: string; // e.g. "Instagram"
  tier: string; // e.g. "Micro"
  guidelines: string;
  image: string;
  revisionComment?: string;
  escrowReleaseDate?: string;
  actualAmount?: number;
  niches?: string[];
  goal?: 'Content Creation' | 'Amplification' | null;
  createdAt?: string;
  budgetMax?: number;
  daysLeftNumber?: number;
  campaignId?: string;
  submissionId?: string;
}

interface WorkCampaignCardProps {
  campaign: WorkCampaign;
  onShowMoreInfo: (campaign: WorkCampaign) => void;
  onSubmitLink?: (campaign: WorkCampaign) => void;
  onSubmitProof?: (campaign: WorkCampaign) => void;
  onAcceptOffer?: (campaign: WorkCampaign) => void;
  onDeclineOffer?: (campaign: WorkCampaign) => void;
  isSelected?: boolean;
}

export default function WorkCampaignCard({
  campaign,
  onShowMoreInfo,
  isSelected = false,
}: WorkCampaignCardProps) {
  // Status style helper for the badge at top right
  const getStatusBadgeStyles = (status: WorkCampaign['status']) => {
    switch (status) {
      case 'In progress':
        return 'bg-[#eff6ff] text-[#2563eb] border-[#dbeafe]';
      case 'Under review':
        return 'bg-[#f4f3f6] text-[#5a5a7a] border-[#e8e6f0]';
      case 'Revision requested':
        return 'bg-[#fffbeb] text-[#d97706] border-[#fef3c7]';
      case 'Approved':
        return 'bg-[#f0fdf4] text-[#16a34a] border-[#dcfce7]';
      case 'Selected':
        return 'bg-[#f0fdf4] text-[#16a34a] border-[#dcfce7]';
      case 'Pending':
        return 'bg-[#fffbeb] text-[#d97706] border-[#fef3c7]';
      case 'Declined':
        return 'bg-[#fef2f2] text-[#dc2626] border-[#fee2e2]';
      case 'Payment released':
        return 'bg-[#f0fdf4] text-[#16a34a] border-[#dcfce7]';
      default:
        return 'bg-[#f4f3f6] text-[#5a5a7a] border-[#e8e6f0]';
    }
  };

  const getStatusLabel = (status: WorkCampaign['status']) => {
    if (status === 'Under review') return 'Under Brand Review';
    if (status === 'Payment released') return 'Closed';
    return status;
  };

  const formatDaysLeft = (daysLeftStr: string) => {
    if (daysLeftStr.toLowerCase().includes('left')) return daysLeftStr;
    return `${daysLeftStr} left`;
  };

  return (
    <div
      className={cn(
        'bg-white border rounded-[32px] overflow-hidden hover:shadow-[0_8px_30px_rgba(4,0,57,0.06)] transition-all duration-300 flex flex-col h-full group select-none',
        isSelected ? 'border-brand-pink ring-1 ring-brand-pink/20' : 'border-[#e8e6f0]/60',
      )}
    >
      {/* Thumbnail Area */}
      <div className="relative w-full h-[160px] bg-zinc-50 overflow-hidden shrink-0">
        <Image
          src={campaign.image}
          alt={campaign.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 350px"
        />

        {/* Days Left badge (Bottom Right) */}
        {campaign.status !== 'Payment released' && campaign.status !== 'Declined' && (
          <div className="absolute bottom-3.5 right-4 flex items-center gap-1 bg-black/45 backdrop-blur-md text-white text-[10px] font-medium px-2.5 py-1 rounded-full border border-white/10">
            <Clock size={11} className="text-white" />
            <span>{formatDaysLeft(campaign.daysLeft)}</span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col justify-between flex-1 gap-4">
        {/* Title, Brand, Status & Price block */}
        <div className="flex flex-col gap-3">
          {/* Row 1: Title & Budget */}
          <div className="flex justify-between items-start w-full gap-3">
            <h4 className="text-[15px] font-bold text-[#1a1a2e] leading-snug group-hover:text-brand-pink transition-colors">
              {campaign.title}
            </h4>
            <span className="text-[14px] font-bold text-[#1a1a2e] shrink-0 leading-snug">
              {campaign.budgetMinMax}
            </span>
          </div>

          {/* Row 2: Brand & Status badge */}
          <div className="flex items-center justify-between w-full">
            <span className="text-[12px] font-light text-[#7a7a9a]">{campaign.brand}</span>
            <span
              className={cn(
                'text-[10px] font-bold px-2.5 py-0.5 rounded-full border leading-none whitespace-nowrap capitalize',
                getStatusBadgeStyles(campaign.status),
              )}
            >
              {getStatusLabel(campaign.status)}
            </span>
          </div>
        </div>

        {/* Row 3: Action Button */}
        <div className="mt-auto pt-1">
          <button
            onClick={() => onShowMoreInfo(campaign)}
            className="w-full bg-[#f4f4f8] hover:bg-[#eaeaf0] text-[#5a5a7a] font-bold text-xs py-3.5 rounded-2xl transition-all active:scale-98 cursor-pointer text-center border-none"
          >
            Show more info
          </button>
        </div>
      </div>
    </div>
  );
}
