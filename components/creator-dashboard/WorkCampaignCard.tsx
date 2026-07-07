'use client';

import Image from 'next/image';
import {
  Clock,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  Link,
  FileText,
  ChevronRight,
} from 'lucide-react';
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
  onSubmitLink,
  onSubmitProof,
  onAcceptOffer,
  onDeclineOffer,
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

        {/* Days Left badge */}
        {campaign.status !== 'Payment released' && campaign.status !== 'Declined' && (
          <div className="absolute bottom-3.5 left-4 flex items-center gap-1 bg-black/45 backdrop-blur-md text-white text-[10px] font-medium px-2.5 py-1 rounded-full border border-white/10">
            <Clock size={11} className="text-white" />
            <span>{campaign.daysLeft} left</span>
          </div>
        )}

        {/* Platform & Tier badges */}
        <div className="absolute bottom-3.5 right-4 flex items-center gap-1.5">
          <span className="bg-white/95 backdrop-blur-xs text-[#1a1a2e] text-[9px] font-bold px-2.5 py-1 rounded-full shadow-sm">
            {campaign.platform}
          </span>
          <span className="bg-brand-pink text-white text-[9px] font-bold px-2.5 py-1 rounded-full shadow-sm">
            {campaign.tier}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col justify-between flex-1 gap-4">
        {/* Title, Brand, Status & Price block */}
        <div className="flex flex-col gap-2">
          {/* Brand & Status badge row */}
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

          {/* Title */}
          <h4 className="text-[15px] font-bold text-[#1a1a2e] leading-snug group-hover:text-brand-pink transition-colors">
            {campaign.title}
          </h4>

          {/* Price and View Brief row */}
          <div className="flex items-center justify-between mt-1">
            <span className="text-[16px] font-extrabold text-[#1a1a2e]">
              ₦{(campaign.actualAmount ?? 300000).toLocaleString()}
            </span>
            <button
              onClick={() => onShowMoreInfo(campaign)}
              className="text-[11px] font-bold text-[#7a7a9a] hover:text-[#5a5a7a] flex items-center gap-0.5 cursor-pointer focus:outline-none"
            >
              <span>View brief</span>
              <ChevronRight size={13} className="text-[#9a99b0]" />
            </button>
          </div>
        </div>

        {/* Guidelines alert box / actions block */}
        <div className="flex flex-col gap-3 mt-auto">
          {/* 1. In progress Guidelines */}
          {campaign.status === 'In progress' && (
            <div className="flex flex-col gap-3 w-full">
              <div className="bg-[#eff6ff] border border-[#dbeafe] rounded-2xl p-3.5 flex flex-col gap-1 text-left">
                <span className="text-[10px] font-bold text-[#2563eb] flex items-center gap-1">
                  <FileText size={12} />
                  Content Guidelines Reminder
                </span>
                <p className="text-[11px] text-[#5a5a7a] font-light leading-relaxed">
                  {campaign.guidelines}
                </p>
              </div>
              <button
                onClick={() => onSubmitLink?.(campaign)}
                className="w-full bg-brand-pink hover:bg-brand-pink/95 text-white text-[11px] font-bold py-3 rounded-2xl transition-all shadow-[0_2px_8px_rgba(215,23,111,0.15)] hover:shadow-[0_4px_12px_rgba(215,23,111,0.22)] active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Link size={12} />
                Submit content link
              </button>
            </div>
          )}

          {/* 2. Under Review */}
          {campaign.status === 'Under review' && (
            <div className="bg-[#f4f3f6] border border-[#e8e6f0] rounded-2xl p-3.5 flex flex-col gap-1 text-left">
              <span className="text-[10px] font-bold text-[#5a5a7a] flex items-center gap-1">
                <RefreshCw size={11} className="animate-spin-slow" />
                Under Brand Review
              </span>
              <p className="text-[11px] text-[#7a7a9a] font-light leading-relaxed">
                The brand has up to 48 hours to review your submission. You&apos;ll receive a push
                notification with their decision.
              </p>
            </div>
          )}

          {/* 3. Revision Requested */}
          {campaign.status === 'Revision requested' && (
            <div className="flex flex-col gap-3 w-full">
              <div className="bg-[#fffbeb] border border-[#fef3c7] rounded-2xl p-3.5 flex flex-col gap-1 text-left">
                <span className="text-[10px] font-bold text-[#d97706] flex items-center gap-1">
                  <AlertCircle size={12} />
                  Brand Revision Request
                </span>
                <p className="text-[11px] text-[#7a7a9a] font-light leading-relaxed italic">
                  &quot;{campaign.revisionComment ?? 'Please adjust lighting and duration.'}&quot;
                </p>
              </div>
              <button
                onClick={() => onSubmitLink?.(campaign)}
                className="w-full border border-amber-500/80 bg-amber-50/50 hover:bg-amber-50 text-amber-700 text-[11px] font-bold py-3 rounded-2xl transition-all active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RefreshCw size={12} />
                Submit revised content
              </button>
            </div>
          )}

          {/* 4. Approved */}
          {campaign.status === 'Approved' && (
            <div className="flex flex-col gap-3 w-full">
              <div className="bg-[#f0fdf4] border border-[#dcfce7] rounded-2xl p-3.5 flex flex-col gap-1 text-left">
                <span className="text-[10px] font-bold text-[#16a34a] flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  Content Approved!
                </span>
                <p className="text-[11px] text-[#5a5a7a] font-light leading-relaxed">
                  Publish your content on YouTube, then come back to submit proof of posting. The
                  post must stay live for 24 hours before payment is released.
                </p>
              </div>
              <button
                onClick={() => onSubmitProof?.(campaign)}
                className="w-full bg-brand-pink hover:bg-brand-pink/95 text-white text-[11px] font-bold py-3 rounded-2xl transition-all shadow-[0_2px_8px_rgba(215,23,111,0.15)] hover:shadow-[0_4px_12px_rgba(215,23,111,0.22)] active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 size={12} />
                Submit Proof of Posting
              </button>
            </div>
          )}

          {/* 5. Selected / Offer Received */}
          {campaign.status === 'Selected' && (
            <div className="flex flex-col gap-2.5 w-full">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onAcceptOffer?.(campaign)}
                  className="bg-[#10b981] hover:bg-[#059669] text-white text-xs font-bold py-3 rounded-2xl flex-1 transition-all active:scale-95 cursor-pointer"
                >
                  Accept Offer
                </button>
                <button
                  onClick={() => onDeclineOffer?.(campaign)}
                  className="bg-[#fee2e2] hover:bg-[#fecaca] text-[#dc2626] text-xs font-bold py-3 rounded-2xl flex-1 transition-all active:scale-95 cursor-pointer"
                >
                  Decline Offer
                </button>
              </div>
            </div>
          )}

          {/* 6. Pending (Applied -> Pending Decision) */}
          {campaign.status === 'Pending' && (
            <div className="bg-[#fffbeb] border border-[#fef3c7] text-[#b45309] py-3 px-3.5 text-[11px] font-medium rounded-2xl flex items-center gap-2 select-none leading-snug">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d97706] shrink-0" />
              <span>Awaiting brand decision - Results within 48hrs</span>
            </div>
          )}

          {/* 7. Declined */}
          {campaign.status === 'Declined' && (
            <div className="bg-[#fef2f2] border border-[#fee2e2] text-[#b91c1c] py-3 px-3.5 text-[11px] font-medium rounded-2xl flex items-center gap-2 select-none leading-snug">
              <AlertCircle size={13} className="text-[#dc2626] shrink-0" />
              <span>Sorry you have not been selected for this campaign</span>
            </div>
          )}

          {/* 8. Closed / Payment Released */}
          {campaign.status === 'Payment released' && (
            <div className="flex flex-col gap-3 w-full">
              {/* Payment released green banner */}
              <div className="bg-[#f0fdf4] border border-[#dcfce7] rounded-2xl p-3.5 flex flex-col gap-1 text-left">
                <span className="text-[10px] font-bold text-[#16a34a] flex items-center gap-1.5">
                  <CheckCircle2 size={12} />
                  Payment Released
                </span>
                <span className="text-[15px] font-extrabold text-[#16a34a] mt-0.5">
                  ₦{(campaign.actualAmount ?? 250000).toLocaleString()}
                </span>
              </div>

              {/* 30-Day hold active amber banner */}
              <div className="bg-[#fffbeb] border border-[#fef3c7] rounded-2xl p-3.5 flex flex-col gap-1 text-left">
                <span className="text-[10px] font-bold text-[#d97706] flex items-center gap-1">
                  <Clock size={12} />
                  30-Day Hold Active
                </span>
                <p className="text-[10.5px] text-[#7a7a9a] font-light leading-relaxed">
                  Funds will be automatically transferred to your bank account starting{' '}
                  {campaign.escrowReleaseDate ?? 'June 28, 2026'}, ensuring a secure process during
                  the dispute period.
                </p>
              </div>

              {/* Footer date info */}
              <div className="flex justify-between items-center text-[10px] text-[#9a99b0] font-light mt-1 px-1">
                <span>Withdrawal date:</span>
                <span className="font-semibold text-[#5a5a7a]">
                  {campaign.escrowReleaseDate ?? 'June 28, 2026'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
