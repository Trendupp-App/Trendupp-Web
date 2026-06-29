'use client';

import { Megaphone, Tag, Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { DraftCampaign } from '@/components/create-campaign/CampaignDummyData';

interface DraftCampaignCardProps {
  campaign: DraftCampaign;
  onDelete: (id: string) => void;
}

export default function DraftCampaignCard({ campaign, onDelete }: DraftCampaignCardProps) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-4 bg-white border border-[#e8e6f0] rounded-2xl px-5 py-4">
      {/* Icon / cover */}
      <div className="w-16 h-16 rounded-xl bg-[#ede9fb] flex items-center justify-center shrink-0">
        <Megaphone size={24} className="text-[#7c6fe0]" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#1a1a2e] truncate">{campaign.title}</p>
        <div className="flex items-center gap-1.5 mt-1">
          <Tag size={11} className="text-[#9a99b0]" />
          <span className="text-xs text-[#9a99b0]">{campaign.niche}</span>
          <span className="text-[#d4d2e3]">·</span>
          <span className="text-xs text-[#9a99b0]">Last edited {campaign.lastEdited}</span>
        </div>
        <p className="text-xs text-[#9a99b0] mt-1">
          {campaign.sectionsCompleted}/{campaign.totalSections} sections
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => router.push(`/brand/campaigns/create?draft=${campaign.id}`)}
          className="flex items-center gap-1.5 px-3.5 py-2 border border-[#e8e6f0] rounded-lg text-xs text-[#1a1a2e] hover:bg-[#faf9fc] transition-colors"
        >
          <Pencil size={13} />
          Continue
        </button>
        <button
          onClick={() => onDelete(campaign.id)}
          className="w-8 h-8 flex items-center justify-center border border-[#e8e6f0] rounded-lg text-[#c4c2d4] hover:text-red-400 hover:border-red-200 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
