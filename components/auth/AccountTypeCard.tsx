'use client';

import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface AccountTypeCardProps {
  value: string;
  selected: boolean;
  icon: LucideIcon;
  title: string;
  description: string;
  onSelect: (value: string) => void;
}

export default function AccountTypeCard({
  value,
  selected,
  icon: Icon,
  title,
  description,
  onSelect,
}: AccountTypeCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onClick={() => onSelect(value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onSelect(value);
      }}
      className={cn(
        'flex items-start shadow-lg gap-4 p-4 rounded-xl border-[1.5px] text-left transition-all cursor-pointer',
        selected
          ? 'border-brand-pink bg-[#fff5f9]'
          : 'border-[#e8e6f0] bg-white hover:border-brand-pink/30',
      )}
    >
      <span
        className={cn(
          'flex items-center justify-center w-10 h-10 rounded-xl shrink-0 transition-colors',
          selected ? 'bg-brand-pink-light text-primary' : 'bg-brand-pink-light text-primary',
        )}
      >
        <Icon size={18} />
      </span>
      <div>
        <p className="text-[15px] font-extralight text-[#1a1a2e] mb-1">{title}</p>
        <p className="text-[13px] font-light text-[#7a7a9a] leading-snug">{description}</p>
      </div>
    </div>
  );
}
