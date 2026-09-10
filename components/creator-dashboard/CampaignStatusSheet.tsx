'use client';

import Image from 'next/image';
import { toast } from 'sonner';
import { Drawer, DrawerContent, DrawerClose } from '@/components/ui/drawer';
import {
  X,
  Clock,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  Link as LinkIcon,
  FileText,
  ChevronRight,
  MessageCircle,
  Megaphone,
  Copy,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { canRaiseDispute, type WorkCampaign } from './WorkCampaignCard';
import { formatCurrency, ensureHttpUrl } from '@/utils/Utilities';

interface CampaignStatusSheetProps {
  campaign: WorkCampaign | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitLink?: (campaign: WorkCampaign) => void;
  onSubmitProof?: (campaign: WorkCampaign) => void;
  onAcceptOffer?: (campaign: WorkCampaign) => void;
  onDeclineOffer?: (campaign: WorkCampaign) => void;
  onRaiseDispute?: (campaign: WorkCampaign) => void;
  onViewBrief: (campaign: WorkCampaign) => void;
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

function Stat({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-0.5 p-3.5 min-w-0">
      <span className="text-xs font-light text-[#9a99b0]">{label}</span>
      <span
        className={cn('text-[10px] font-extralight', accent ? 'text-brand-pink' : 'text-[#1a1a2e]')}
      >
        {value}
      </span>
    </div>
  );
}

export default function CampaignStatusSheet({
  campaign,
  open,
  onOpenChange,
  onSubmitLink,
  onSubmitProof,
  onAcceptOffer,
  onDeclineOffer,
  onRaiseDispute,
  onViewBrief,
}: CampaignStatusSheetProps) {
  if (!campaign) return null;

  const showTimer = campaign.status !== 'Payment released' && campaign.status !== 'Declined';
  const isPausedOrCancelled =
    campaign.campaignStatus === 'paused' || campaign.campaignStatus === 'cancelled';
  const isAmplify = campaign.goal === 'Amplification';

  function handleCopyAmplificationAsset() {
    if (!campaign?.amplificationAsset) return;
    navigator.clipboard.writeText(campaign.amplificationAsset);
    toast.success('Link copied to clipboard!');
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="w-full sm:max-w-[520px] h-full">
        <div className="mx-auto h-full  flex flex-col overflow-y-auto px-5 pb-6 scrollbar-hide">
          {/* Close button */}
          <div className="flex justify-end pt-2">
            <DrawerClose className="w-7 h-7 rounded-full bg-[#f4f4f8] hover:bg-[#eaeaf0] flex items-center justify-center text-[#7a7a9a] transition-colors cursor-pointer">
              <X size={15} />
            </DrawerClose>
          </div>

          {/* Cover image header */}
          <div className="relative w-full h-[180px] rounded-2xl overflow-hidden bg-zinc-100 mt-1 shrink-0">
            <Image
              src={campaign.image}
              alt={campaign.title}
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
              <div className="min-w-0">
                <p className="text-lg font-bold text-white truncate">{campaign.title}</p>
                <p className="flex items-center gap-1.5 text-xs text-white/80 mt-0.5">
                  <span className="truncate">{campaign.brand}</span>
                  {showTimer && (
                    <>
                      <span>•</span>
                      <Clock size={12} className="shrink-0" />
                      <span className="shrink-0">{campaign.daysLeft} left</span>
                    </>
                  )}
                </p>
              </div>
              <span
                className={cn(
                  'text-[10px] font-bold px-3 py-1.5 rounded-full leading-none capitalize shrink-0 border bg-white/90',
                  getStatusBadgeStyles(campaign.status),
                )}
              >
                {getStatusLabel(campaign.status)}
              </span>
            </div>
          </div>

          {/* Stats row */}
          <div className="border border-[#e8e6f0] rounded-2xl grid grid-cols-3 divide-x divide-[#e8e6f0] mt-4 shrink-0">
            <Stat label="Budget" value={campaign.budgetMinMax} />
            {/* <Stat label="Platform" value={campaign.platform} /> */}
            <Stat label="Status" value={getStatusLabel(campaign.status)} accent />
            <Stat label="Tier" value={campaign.tier} />
          </div>

          {/* Status-specific body */}
          <div className="mt-5 flex flex-col gap-3">
            {campaign.status === 'In progress' && (
              <div className="bg-[#eff6ff] border border-[#dbeafe] rounded-2xl p-4 flex flex-col gap-1 text-left">
                <span className="text-xs font-bold text-[#2563eb] flex items-center gap-1.5">
                  <FileText size={13} />
                  Content Guidelines Reminder
                </span>
                <p className="text-xs text-[#5a5a7a] font-light leading-relaxed">
                  {campaign.guidelines}
                </p>
              </div>
            )}

            {campaign.status === 'Under review' && (
              <div className="bg-[#f4f3f6] border border-[#e8e6f0] rounded-2xl p-4 flex flex-col gap-1 text-left">
                <span className="text-xs font-bold text-[#5a5a7a] flex items-center gap-1.5">
                  <RefreshCw size={13} className="animate-spin-slow" />
                  Under Brand Review
                </span>
                <p className="text-xs text-[#7a7a9a] font-light leading-relaxed">
                  The brand has up to 48 hours to review your submission. You&apos;ll receive a push
                  notification with their decision.
                </p>
              </div>
            )}

            {campaign.status === 'Revision requested' && (
              <div className="bg-[#fffbeb] border border-[#fef3c7] rounded-2xl p-4 flex flex-col gap-1 text-left">
                <span className="text-xs font-bold text-[#d97706] flex items-center gap-1.5">
                  <AlertCircle size={13} />
                  Brand Revision Request
                </span>
                <p className="text-xs text-[#7a7a9a] font-light leading-relaxed italic">
                  &quot;{campaign.revisionComment ?? 'Please adjust lighting and duration.'}&quot;
                </p>
              </div>
            )}

            {campaign.status === 'Approved' && (
              <div className="bg-[#f0fdf4] border border-[#dcfce7] rounded-2xl p-4 flex flex-col gap-1 text-left">
                <span className="text-xs font-bold text-[#16a34a] flex items-center gap-1.5">
                  <CheckCircle2 size={13} />
                  Content Approved!
                </span>
                <p className="text-xs text-[#5a5a7a] font-light leading-relaxed">
                  Publish your content on{' '}
                  <span className="font-bold">the agreed social platform(s)</span>, submit proof of
                  posting below. The post must remain on your social media for at least{' '}
                  <span className="font-bold"> 3months</span> before payment is released.
                </p>
              </div>
            )}

            {campaign.status === 'Selected' && (
              <div className="bg-[#f0fdf4] border border-[#dcfce7] rounded-2xl p-4 flex flex-col gap-1 text-left">
                <span className="text-xs font-bold text-[#16a34a] flex items-center gap-1.5">
                  <CheckCircle2 size={13} />
                  You&apos;ve been offered this campaign!
                </span>
                <p className="text-xs text-[#5a5a7a] font-light leading-relaxed">
                  Review the brief below, then accept or decline the offer.
                </p>
              </div>
            )}

            {campaign.status === 'Pending' && (
              <div className="bg-[#fffbeb] border border-[#fef3c7] rounded-2xl p-4 flex items-center gap-2 text-left">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d97706] shrink-0" />
                <p className="text-xs font-medium text-[#b45309]">
                  Awaiting brand decision — results within 48hrs
                </p>
              </div>
            )}

            {campaign.status === 'Declined' && (
              <div className="bg-[#fef2f2] border border-[#fee2e2] rounded-2xl p-4 flex items-center gap-2 text-left">
                <AlertCircle size={15} className="text-[#dc2626] shrink-0" />
                <p className="text-xs font-medium text-[#b91c1c]">
                  Sorry, you have not been selected for this campaign.
                </p>
              </div>
            )}

            {campaign.status === 'Payment released' && (
              <>
                <div className="bg-[#f0fdf4] border border-[#dcfce7] rounded-2xl p-4 flex flex-col gap-1 text-left">
                  <span className="text-xs font-bold text-[#16a34a] flex items-center gap-1.5">
                    <CheckCircle2 size={13} />
                    Payment Released
                  </span>
                  <span className="text-lg font-extrabold text-[#16a34a] mt-0.5">
                    {formatCurrency(campaign.actualAmount ?? 250000, campaign.currency ?? 'NGN')}
                  </span>
                </div>
                <div className="bg-[#fffbeb] border border-[#fef3c7] rounded-2xl p-4 flex flex-col gap-1 text-left">
                  <span className="text-xs font-bold text-[#d97706] flex items-center gap-1.5">
                    <Clock size={13} />
                    30-Day Hold Active
                  </span>
                  <p className="text-[11px] text-[#7a7a9a] font-light leading-relaxed">
                    Funds will be automatically transferred to your bank account starting{' '}
                    {campaign.escrowReleaseDate ?? 'June 28, 2026'}.
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Amplification asset — only relevant for Amplify Content campaigns */}
          {isAmplify && campaign.amplificationAsset && (
            <div className="mt-5 border border-[#e8e6f0] rounded-2xl p-4 flex flex-col gap-2 text-left">
              <h4 className="text-sm font-bold text-[#1a1a2e] flex items-center gap-1.5">
                <Megaphone size={14} />
                Content to Amplify
              </h4>
              <div className="flex items-center gap-2 bg-[#f4f3f6] rounded-xl px-3 py-2.5">
                <a
                  href={ensureHttpUrl(campaign.amplificationAsset)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-xs font-medium text-[#1a1a2e] hover:text-brand-pink break-all"
                >
                  {campaign.amplificationAsset}
                </a>
                <button
                  type="button"
                  onClick={handleCopyAmplificationAsset}
                  className="shrink-0 w-7 h-7 rounded-lg bg-white border border-[#e8e6f0] flex items-center justify-center text-[#7a7a9a] hover:text-brand-pink hover:border-brand-pink/30 transition-colors cursor-pointer"
                  aria-label="Copy link"
                >
                  <Copy size={13} />
                </button>
              </div>
            </div>
          )}

          {/* Comments from creator + brand response */}
          {campaign.campaignComment && (
            <div className="mt-5 border border-[#e8e6f0] rounded-2xl p-4 flex flex-col gap-2.5 text-left">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1a1a2e] flex items-center gap-1.5">
                  <MessageCircle size={13} />
                  Your comment
                </span>
                {campaign.campaignComment.response ? (
                  <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                    <CheckCircle2 size={12} />
                    Brand responded
                  </span>
                ) : (
                  <span className="text-[11px] font-medium text-[#9a99b0]">Awaiting response</span>
                )}
              </div>
              <p className="text-xs text-[#4a4a6a] leading-relaxed">
                {campaign.campaignComment.comment}
              </p>
              {campaign.campaignComment.response && (
                <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5">
                  <p className="text-[11px] text-amber-700 italic leading-relaxed">
                    {campaign.campaignComment.response}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="mt-5 flex flex-col gap-3">
            {isPausedOrCancelled && (
              <div className="bg-[#fef2f2] border border-[#fee2e2] rounded-2xl p-4 flex items-center gap-2 text-left">
                <AlertCircle size={15} className="text-[#dc2626] shrink-0" />
                <p className="text-xs font-medium text-[#b91c1c] capitalize">
                  This campaign has been {campaign.campaignStatus} by the brand. No further action
                  can be taken on it right now.
                </p>
              </div>
            )}

            {!isPausedOrCancelled && campaign.status === 'In progress' && (
              <button
                onClick={() => onSubmitLink?.(campaign)}
                className="w-full bg-brand-pink hover:bg-brand-pink/95 text-white text-xs font-bold py-3.5 rounded-2xl transition-all shadow-[0_2px_8px_rgba(215,23,111,0.15)] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LinkIcon size={13} />
                Submit content link
              </button>
            )}

            {!isPausedOrCancelled && campaign.status === 'Revision requested' && (
              <button
                onClick={() => onSubmitLink?.(campaign)}
                className="w-full border border-amber-500/80 bg-amber-50/50 hover:bg-amber-50 text-amber-700 text-xs font-bold py-3.5 rounded-2xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RefreshCw size={13} />
                Submit revised content
              </button>
            )}

            {!isPausedOrCancelled && campaign.status === 'Approved' && (
              <button
                onClick={() => onSubmitProof?.(campaign)}
                className="w-full bg-brand-pink hover:bg-brand-pink/95 text-white text-xs font-bold py-3.5 rounded-2xl transition-all shadow-[0_2px_8px_rgba(215,23,111,0.15)] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 size={13} />
                Submit Proof of Posting
              </button>
            )}

            {!isPausedOrCancelled && campaign.status === 'Selected' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onAcceptOffer?.(campaign)}
                  className="flex-1 bg-[#10b981] hover:bg-[#059669] text-white text-xs font-bold py-3.5 rounded-2xl transition-all cursor-pointer"
                >
                  Accept Offer
                </button>
                <button
                  onClick={() => onDeclineOffer?.(campaign)}
                  className="flex-1 bg-[#fee2e2] hover:bg-[#fecaca] text-[#dc2626] text-xs font-bold py-3.5 rounded-2xl transition-all cursor-pointer"
                >
                  Decline Offer
                </button>
              </div>
            )}

            <button
              onClick={() => onViewBrief(campaign)}
              className="w-full bg-[#f4f3f6] hover:bg-[#eceaf0] text-[#5a5a7a] text-xs font-bold py-3.5 rounded-2xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              View brief
              <ChevronRight size={14} />
            </button>

            {!isPausedOrCancelled && onRaiseDispute && canRaiseDispute(campaign.status) && (
              <button
                onClick={() => onRaiseDispute(campaign)}
                className="w-full border border-[#e8e6f0] text-[#7a7a9a] hover:text-brand-pink hover:border-brand-pink/30 text-xs font-semibold py-3.5 rounded-2xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MessageCircle size={14} />
                Raise a dispute
              </button>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
