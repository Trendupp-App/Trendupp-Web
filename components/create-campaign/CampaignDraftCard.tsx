'use client';

import { Megaphone, Tag, Pencil, Trash2, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Campaign } from '@/types/campaign';

interface DraftCampaignCardProps {
  campaign: Campaign;
  onDelete: (id: string) => void;
}

function timeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// Each draft has 3 sections (currentStep maxes at 3 before submit triggers step 4)
const TOTAL_SECTIONS = 3;

export default function DraftCampaignCard({ campaign, onDelete }: DraftCampaignCardProps) {
  const router = useRouter();
  const isSubmitted = campaign.status === 'submitted';
  const sectionsCompleted = Math.min(campaign.currentStep, TOTAL_SECTIONS);

  function handleContinue() {
    if (isSubmitted) {
      // Skip straight to the payment step rather than re-opening the wizard from step 1
      router.push(`/brand/campaign/create?draft=${campaign.id}&step=5`);
    } else {
      router.push(`/brand/campaign/create?draft=${campaign.id}`);
    }
  }

  return (
    <div className="flex items-center gap-4 bg-white border border-[#e8e6f0] rounded-2xl px-5 py-4">
      <div className="w-16 h-16 rounded-xl bg-[#ede9fb] flex items-center justify-center shrink-0">
        <Megaphone size={24} className="text-[#7c6fe0]" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-[#1a1a2e] truncate">{campaign.title}</p>
          {isSubmitted && (
            <span className="flex items-center gap-1 shrink-0 px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 text-[10px] font-medium">
              <Clock size={10} />
              Awaiting payment
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 mt-1">
          <Tag size={11} className="text-[#9a99b0]" />
          <span className="text-xs text-[#9a99b0]">{campaign.goal}</span>
          <span className="text-[#d4d2e3]">·</span>
          <span className="text-xs text-[#9a99b0]">Last edited {timeAgo(campaign.updatedAt)}</span>
        </div>
        {!isSubmitted && (
          <p className="text-xs text-[#9a99b0] mt-1">
            {sectionsCompleted}/{TOTAL_SECTIONS} sections
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleContinue}
          className="flex items-center gap-1.5 px-3.5 py-2 border border-[#e8e6f0] rounded-lg text-xs text-[#1a1a2e] hover:bg-[#faf9fc] transition-colors"
        >
          <Pencil size={13} />
          {isSubmitted ? 'Pay now' : 'Continue'}
        </button>
        {!isSubmitted && (
          <button
            onClick={() => onDelete(campaign.id)}
            className="w-8 h-8 flex cursor-pointer items-center justify-center border border-[#e8e6f0] rounded-lg text-[#c4c2d4] hover:text-red-400 hover:border-red-200 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
