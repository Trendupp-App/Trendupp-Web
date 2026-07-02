'use client';

import Image from 'next/image';
import { Star } from 'lucide-react';
import type { CampaignApplication } from '@/types/application';

function fmt(n: number) {
  return `₦${n.toLocaleString('en-NG')}`;
}

interface ApplicationListItemProps {
  application: CampaignApplication;
  onView: (application: CampaignApplication) => void;
}

export default function ApplicationListItem({ application, onView }: ApplicationListItemProps) {
  const { creator } = application;

  return (
    <div className="border border-[#e8e6f0] rounded-xl p-5 flex items-start justify-between gap-4">
      <div className="flex items-start gap-3 min-w-0 flex-1">
        <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 bg-[#f0eef8]">
          <Image src={creator.avatarUrl} alt={creator.name} fill className="object-cover" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-[#1a1a2e]">{creator.name}</p>
            <span className="text-sm text-[#9a99b0]">{creator.handle}</span>
            <span className="flex items-center gap-0.5 text-xs text-amber-500">
              <Star size={11} fill="currentColor" />
              {creator.rating}
            </span>
          </div>

          <p className="text-sm text-[#4a4a6a] mt-1 leading-relaxed">{application.contentIdea}</p>

          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <span className="text-xs font-medium text-[#7c6fe0] bg-[#ede9fb] px-2.5 py-1 rounded-full">
              {creator.tier}
            </span>
            <span className="text-xs text-[#9a99b0]">
              <strong className="text-[#1a1a2e]">{creator.followers}</strong> followers
            </span>
            <span className="text-xs text-[#9a99b0]">
              <strong className="text-[#1a1a2e]">{creator.engagement}</strong> engagement
            </span>
            <span className="text-xs font-semibold text-[#1a1a2e]">
              {fmt(application.feeRequest)}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={() => onView(application)}
        className="flex items-center cursor-pointer gap-1.5 px-4 py-2 border border-[#e8e6f0] rounded-lg text-xs text-[#1a1a2e] hover:bg-[#faf9fc] transition-colors shrink-0"
      >
        View application
        <span aria-hidden>→</span>
      </button>
    </div>
  );
}
