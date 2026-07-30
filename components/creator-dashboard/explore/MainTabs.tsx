'use client';

import { cn } from '@/lib/utils';

export type MainTab = 'campaigns' | 'brands' | 'creators' | 'social-impact';

const TABS: { id: MainTab; label: string }[] = [
  { id: 'campaigns', label: 'Campaigns' },
  { id: 'social-impact', label: 'Social Impact' },
  { id: 'brands', label: 'Brands' },
  { id: 'creators', label: 'Creators' },
];

export default function MainTabs({
  active,
  onChange,
}: {
  active: MainTab;
  onChange: (tab: MainTab) => void;
}) {
  return (
    <div className="border-b cursor-pointer border-[#e8e6f0]/40 flex w-full md:w-auto md:justify-start gap-0 md:gap-8 text-sm font-medium text-[#7a7a9a] shrink-0 mb-4">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'flex-1 md:flex-none cursor-pointer text-center pb-2.5 transition-all relative focus:outline-none whitespace-nowrap',
            active === tab.id
              ? 'text-brand-pink font-semibold border-b-2 border-brand-pink'
              : 'hover:text-brand-pink',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
