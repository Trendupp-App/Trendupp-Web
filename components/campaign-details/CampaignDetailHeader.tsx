'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import type { Campaign } from '@/types/campaign';

interface CampaignDetailHeaderProps {
  campaign: Campaign;
}

export default function CampaignDetailHeader({ campaign }: CampaignDetailHeaderProps) {
  const router = useRouter();

  return (
    <>
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-[#7a7a9a] hover:text-[#1a1a2e] transition-colors mb-4"
      >
        <ArrowLeft size={16} />
        Back to campaign
      </button>

      <div className="relative w-full h-64 rounded-2xl overflow-hidden mb-5">
        {campaign.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={campaign.coverImage}
            alt={campaign.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-[#ede9fb]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        <div className="absolute bottom-4 left-5">
          <h1 className="text-2xl font-bold text-white">{campaign.title}</h1>
        </div>

        {campaign.status === 'live' && (
          <span className="absolute bottom-4 right-5 text-xs font-medium text-emerald-600 bg-white px-3 py-1.5 rounded-full">
            Live
          </span>
        )}
      </div>
    </>
  );
}
