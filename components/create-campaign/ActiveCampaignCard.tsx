'use client';

import { Clock, ExternalLink, Megaphone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { ActiveCampaign } from '@/components/create-campaign/CampaignDummyData';

interface ActiveCampaignCardProps {
  campaign: ActiveCampaign;
}

const STATUS_CONFIG = {
  in_progress: { label: 'In progress', className: 'bg-blue-50 text-blue-600 border-blue-100' },
  content_review: {
    label: 'Content review',
    className: 'bg-amber-50 text-amber-600 border-amber-100',
  },
  revision: { label: 'Revision', className: 'bg-orange-50 text-orange-600 border-orange-100' },
  live_content: {
    label: 'Live content',
    className: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  },
};

function fmt(n: number) {
  return `₦${n.toLocaleString('en-NG')}`;
}

export default function ActiveCampaignCard({ campaign }: ActiveCampaignCardProps) {
  const router = useRouter();
  const status = STATUS_CONFIG[campaign.status];

  return (
    <div className="bg-white border border-[#e8e6f0] rounded-2xl overflow-hidden flex flex-col">
      {/* Cover */}
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
          {campaign.daysLeft} hour{campaign.daysLeft !== 1 ? 's' : ''} left
        </div>

        {/* Status badge */}
        <div
          className={cn(
            'absolute bottom-2 right-2 text-[10px] font-semibold px-2.5 py-1 rounded-full border',
            status.className,
          )}
        >
          {status.label}
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
        <span className="text-sm font-semibold text-brand-pink">{fmt(campaign.budget)}</span>

        {/* Live link */}
        <a
          href={campaign.liveLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-brand-pink hover:underline w-fit"
        >
          {campaign.liveLink}
          <ExternalLink size={10} />
        </a>

        {/* Brief excerpt */}
        <p className="text-xs text-[#9a99b0] leading-relaxed line-clamp-2">{campaign.brief}</p>

        <button
          onClick={() => router.push(`/brand/campaigns/${campaign.id}`)}
          className="w-full mt-1 py-2.5 border border-[#e8e6f0] rounded-xl text-xs text-[#1a1a2e] font-light hover:bg-[#faf9fc] transition-colors"
        >
          View more details
        </button>
      </div>
    </div>
  );
}
