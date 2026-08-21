'use client';

import { cn } from '@/lib/utils';

export type PayoutTab = 'transactions' | 'escrows' | 'needing-funding';

const TABS: { id: PayoutTab; label: string }[] = [
  { id: 'transactions', label: 'Transactions' },
  { id: 'escrows', label: 'Escrows' },
  { id: 'needing-funding', label: 'Needing funding' },
];

interface PayoutTabsProps {
  active: PayoutTab;
  onChange: (tab: PayoutTab) => void;
}

export default function PayoutTabs({ active, onChange }: PayoutTabsProps) {
  return (
    <div className="flex items-center gap-6 border-b border-[#e8e6f0]">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'relative pb-3 text-sm font-medium transition-colors cursor-pointer',
            active === tab.id ? 'text-brand-pink' : 'text-[#9a99b0] hover:text-[#7a7a9a]',
          )}
        >
          {tab.label}
          {active === tab.id && (
            <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-brand-pink rounded-full" />
          )}
        </button>
      ))}
    </div>
  );
}
