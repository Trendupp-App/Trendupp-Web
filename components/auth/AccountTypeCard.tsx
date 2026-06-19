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
    <button
      type="button"
      onClick={() => onSelect(value)}
      aria-pressed={selected}
      className={cn(
        'flex items-center gap-5 p-5 rounded-2xl border-[1.5px] text-left transition-all cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.02)] w-full',
        selected
          ? 'border-brand-pink bg-[#fff5f9]'
          : 'border-[#f0eef6] bg-white hover:border-brand-pink/30',
      )}
    >
      <div
        className={cn(
          'flex items-center justify-center w-14 h-14 rounded-xl shrink-0 transition-colors bg-brand-pink-light text-brand-pink',
        )}
      >
        <Icon size={22} strokeWidth={1.5} />
      </div>
      <div className="flex-1">
        <p className="text-[16px] font-semibold text-[#1a1a2e] mb-0.5">{title}</p>
        <p className="text-[13px] font-light text-[#7a7a9a] leading-snug">{description}</p>
      </div>
    </button>
  );
}
