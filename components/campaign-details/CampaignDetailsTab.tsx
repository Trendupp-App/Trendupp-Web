'use client';

import { cn } from '@/lib/utils';

type DetailTab = 'overview' | 'applications' | 'timeline';

interface CampaignDetailTabsProps {
  activeTab: DetailTab;
  onChange: (tab: DetailTab) => void;
  applicationsCount: number;
}

export default function CampaignDetailTabs({
  activeTab,
  onChange,
  applicationsCount,
}: CampaignDetailTabsProps) {
  return (
    <div className="bg-[#f4f3f8] rounded-xl p-1 flex items-center gap-1 mb-6 w-fit">
      <button
        onClick={() => onChange('overview')}
        className={cn(
          'px-4 py-2 rounded-lg cursor-pointer text-sm font-medium transition-colors',
          activeTab === 'overview'
            ? 'bg-white text-brand-pink shadow-sm'
            : 'text-[#7a7a9a] hover:text-[#1a1a2e]',
        )}
      >
        Campaign Details
      </button>
      <button
        onClick={() => onChange('applications')}
        className={cn(
          'flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-colors',
          activeTab === 'applications'
            ? 'bg-white text-brand-pink shadow-sm'
            : 'text-[#7a7a9a] hover:text-[#1a1a2e]',
        )}
      >
        Applications
        <span
          className={cn(
            'w-5 h-5 rounded-full text-[10px] font-semibold flex items-center justify-center',
            activeTab === 'applications'
              ? 'bg-brand-pink text-white'
              : 'bg-[#e8e6f0] text-[#7a7a9a]',
          )}
        >
          {applicationsCount}
        </span>
      </button>
      <button
        onClick={() => onChange('timeline')}
        className={cn(
          'px-4 py-2 rounded-lg cursor-pointer text-sm font-medium transition-colors',
          activeTab === 'timeline'
            ? 'bg-white text-brand-pink shadow-sm'
            : 'text-[#7a7a9a] hover:text-[#1a1a2e]',
        )}
      >
        Timeline
      </button>
    </div>
  );
}
