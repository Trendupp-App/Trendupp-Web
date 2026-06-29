'use client';

import { Clock, Users, Megaphone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { LiveCampaign } from '@/components/create-campaign/CampaignDummyData';

interface LiveCampaignCardProps {
  campaign: LiveCampaign;
}

function fmt(n: number) {
  return `₦${n.toLocaleString('en-NG')}`;
}

export default function LiveCampaignCard({ campaign }: LiveCampaignCardProps) {
  const router = useRouter();

  return (
    <div className="bg-white border border-[#e8e6f0] rounded-2xl overflow-hidden flex flex-col">
      {/* Cover image / placeholder */}
      <div className="relative w-full h-44 bg-[#ede9fb] flex items-center justify-center shrink-0">
        {campaign.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={campaign.coverImage}
            alt={campaign.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <Megaphone size={32} className="text-[#7c6fe0]" />
        )}

        {/* Timer badge */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-full">
          <Clock size={10} />
          {campaign.daysLeft} days left
        </div>

        {/* Live badge */}
        <div className="absolute bottom-2 right-2 bg-white text-emerald-600 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-emerald-100">
          Live
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-2 p-4 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold text-[#1a1a2e] leading-snug">{campaign.title}</p>
          <span className="text-[10px] font-medium text-[#7c6fe0] bg-[#ede9fb] px-2 py-0.5 rounded-full shrink-0">
            {campaign.tier}
          </span>
        </div>

        <p className="text-xs text-[#9a99b0]">{campaign.niche}</p>

        <div className="flex items-center justify-between mt-1">
          <span className="text-sm font-semibold text-brand-pink">{fmt(campaign.budget)}</span>
          <div className="flex items-center gap-1 text-xs text-[#9a99b0]">
            <Users size={12} />
            {campaign.applicants} applied
          </div>
        </div>

        <button
          onClick={() => router.push(`/brand/campaigns/${campaign.id}/applications`)}
          className="w-full mt-1 py-2.5 border border-[#e8e6f0] rounded-xl text-xs text-[#1a1a2e] font-light hover:bg-[#faf9fc] transition-colors"
        >
          Review application
        </button>
      </div>
    </div>
  );
}
