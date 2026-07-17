'use client';

import { cn } from '@/lib/utils';

type ActiveTab = 'overview' | 'deliverables' | 'timeline';

interface ActiveCampaignTabsProps {
  activeTab: ActiveTab;
  onChange: (tab: ActiveTab) => void;
}

const TABS: { id: ActiveTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'deliverables', label: 'Deliverables' },
  { id: 'timeline', label: 'Timeline' },
];

export default function ActiveCampaignTabs({ activeTab, onChange }: ActiveCampaignTabsProps) {
  return (
    <div className="bg-[#f4f3f8] rounded-xl p-1 flex items-center gap-1 mb-6">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'flex-1 px-4 py-2 rounded-lg cursor-pointer text-sm font-medium transition-colors',
            activeTab === tab.id
              ? 'bg-white text-brand-pink shadow-sm'
              : 'text-[#7a7a9a] hover:text-[#1a1a2e]',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
