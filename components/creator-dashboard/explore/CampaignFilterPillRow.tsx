'use client';

import { cn } from '@/lib/utils';

export type CampaignStatusFilter = 'all' | 'live' | 'past';

const FILTERS: { id: CampaignStatusFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'live', label: 'Live' },
  { id: 'past', label: 'Past' },
];

export default function CampaignFilterPillRow({
  active,
  onChange,
}: {
  active: CampaignStatusFilter;
  onChange: (id: CampaignStatusFilter) => void;
}) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide shrink-0 mb-3">
      {FILTERS.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onChange(filter.id)}
          className={cn(
            'px-4 py-1.5 text-xs cursor-pointer font-semibold rounded-full border transition-all whitespace-nowrap shrink-0',
            active === filter.id
              ? 'bg-[#040039] text-white border-[#040039] shadow-sm'
              : 'bg-white text-[#7a7a9a] border-[#e8e6f0]/70 hover:border-[#040039]/20',
          )}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
