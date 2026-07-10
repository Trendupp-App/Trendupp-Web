'use client';

import Image from 'next/image';
import {
  Clock,
  Link as LinkIcon,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface WorkCampaign {
  id: string;
  title: string;
  brand: string;
  budgetMinMax: string;
  budgetString: string;
  daysLeft: string;
  status:
    | 'In progress'
    | 'Under review'
    | 'Revision requested'
    | 'Approved'
    | 'Selected'
    | 'Pending'
    | 'Declined'
    | 'Payment released';
  platform: string;
  tier: string;
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
  deliverables: string[];
  contentDirection: string[];
  contentDos: string[];
  contentDonts: string[];
  usageRights: string;
  successLooksLike: string;
  draftLink?: string | null;
  liveLink?: Record<string, { url: string; isLive: boolean; checkedAt: string }> | null;
  contentIdea?: string;
  applicationsCount: number;
}

interface WorkCampaignCardProps {
  campaign: WorkCampaign;
  onOpenStatusSheet: (campaign: WorkCampaign) => void;
  isSelected?: boolean;
}

function getStatusBadgeStyles(status: WorkCampaign['status']) {
  switch (status) {
    case 'In progress':
      return 'bg-[#eff6ff] text-[#2563eb] border-[#dbeafe]';
    case 'Under review':
      return 'bg-[#f4f3f6] text-[#5a5a7a] border-[#e8e6f0]';
    case 'Revision requested':
      return 'bg-[#fffbeb] text-[#d97706] border-[#fef3c7]';
    case 'Approved':
    case 'Selected':
    case 'Payment released':
      return 'bg-[#f0fdf4] text-[#16a34a] border-[#dcfce7]';
    case 'Pending':
      return 'bg-[#fffbeb] text-[#d97706] border-[#fef3c7]';
    case 'Declined':
      return 'bg-[#fef2f2] text-[#dc2626] border-[#fee2e2]';
    default:
      return 'bg-[#f4f3f6] text-[#5a5a7a] border-[#e8e6f0]';
  }
}

function getStatusLabel(status: WorkCampaign['status']) {
  if (status === 'Under review') return 'Under Brand Review';
  if (status === 'Payment released') return 'Closed';
  return status;
}

// Single CTA per status — every status opens the same CampaignStatusSheet.
function getPrimaryAction(status: WorkCampaign['status']) {
  switch (status) {
    case 'In progress':
      return { label: 'Submit content link', icon: LinkIcon, style: 'solid' as const };
    case 'Under review':
      return { label: 'View submission status', icon: RefreshCw, style: 'neutral' as const };
    case 'Revision requested':
      return { label: 'View revision request', icon: AlertCircle, style: 'amber' as const };
    case 'Approved':
      return { label: 'Submit proof of posting', icon: CheckCircle2, style: 'solid' as const };
    case 'Selected':
      return { label: 'Respond to offer', icon: ChevronRight, style: 'emerald' as const };
    case 'Pending':
      return { label: 'View application status', icon: Clock, style: 'neutral' as const };
    case 'Declined':
      return { label: 'View details', icon: AlertCircle, style: 'red' as const };
    case 'Payment released':
      return { label: 'View payout details', icon: CheckCircle2, style: 'green' as const };
    default:
      return { label: 'View details', icon: ChevronRight, style: 'neutral' as const };
  }
}

const buttonStyles = {
  solid: 'bg-brand-pink hover:bg-brand-pink/95 text-white shadow-[0_2px_8px_rgba(215,23,111,0.15)]',
  amber: 'border border-amber-500/80 bg-amber-50/50 hover:bg-amber-50 text-amber-700',
  emerald: 'bg-[#10b981] hover:bg-[#059669] text-white',
  neutral: 'bg-[#f4f3f6] hover:bg-[#eceaf0] text-[#5a5a7a]',
  red: 'border border-red-200 bg-red-50/50 hover:bg-red-50 text-red-600',
  green: 'border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-700',
};

export default function WorkCampaignCard({
  campaign,
  onOpenStatusSheet,
  isSelected = false,
}: WorkCampaignCardProps) {
  const action = getPrimaryAction(campaign.status);
  const ActionIcon = action.icon;

  return (
    <div
      className={cn(
        'bg-white border rounded-[32px] overflow-hidden hover:shadow-[0_8px_30px_rgba(4,0,57,0.06)] transition-all duration-300 flex flex-col h-full group select-none',
        isSelected ? 'border-brand-pink ring-1 ring-brand-pink/20' : 'border-[#e8e6f0]/60',
      )}
    >
      {/* Thumbnail */}
      <div className="relative w-full h-[160px] bg-zinc-50 overflow-hidden shrink-0">
        <Image
          src={campaign.image}
          alt={campaign.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 350px"
        />
        {campaign.status !== 'Payment released' && campaign.status !== 'Declined' && (
          <div className="absolute bottom-3.5 left-4 flex items-center gap-1 bg-black/45 backdrop-blur-md text-white text-[10px] font-medium px-2.5 py-1 rounded-full border border-white/10">
            <Clock size={11} className="text-white" />
            <span>{campaign.daysLeft} left</span>
          </div>
        )}
        <div className="absolute bottom-3.5 right-4 flex items-center gap-1.5">
          <span className="bg-white/95 backdrop-blur-xs text-[#1a1a2e] text-[9px] font-bold px-2.5 py-1 rounded-full shadow-sm">
            {campaign.platform}
          </span>
          <span className="bg-brand-pink text-white text-[9px] font-bold px-2.5 py-1 rounded-full shadow-sm">
            {campaign.tier}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col justify-between flex-1 gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between w-full">
            <span className="text-[10px] sm:text-xs font-bold text-brand-pink uppercase tracking-wider">
              {campaign.brand}
            </span>
            <span
              className={cn(
                'text-[10px] font-bold px-2.5 py-0.5 rounded-full border leading-none whitespace-nowrap capitalize',
                getStatusBadgeStyles(campaign.status),
              )}
            >
              {getStatusLabel(campaign.status)}
            </span>
          </div>

          <h4 className="text-[15px] font-bold text-[#1a1a2e] leading-snug group-hover:text-brand-pink transition-colors">
            {campaign.title}
          </h4>

          <span className="text-[16px] font-extrabold text-[#1a1a2e] mt-1">
            ₦{(campaign.actualAmount ?? 300000).toLocaleString()}
          </span>
        </div>

        {/* Single status-aware CTA — opens CampaignStatusSheet */}
        <button
          onClick={() => onOpenStatusSheet(campaign)}
          className={cn(
            'w-full text-[11px] font-bold py-3 rounded-2xl transition-all active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer mt-auto',
            buttonStyles[action.style],
          )}
        >
          <ActionIcon size={12} />
          {action.label}
        </button>
      </div>
    </div>
  );
}
