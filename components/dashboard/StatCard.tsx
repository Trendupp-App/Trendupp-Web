'use client';

import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type StatColor = 'pink' | 'blue' | 'yellow' | 'green';

interface StatCardProps {
  amount: string;
  label: string;
  color: StatColor;
  onClick?: () => void;
}

export default function StatCard({ amount, label, color, onClick }: StatCardProps) {
  const bgColors: Record<StatColor, string> = {
    pink: 'bg-[#fdf2f6] text-[#d7176f]',
    blue: 'bg-[#edf2fe] text-[#2f63eb]',
    yellow: 'bg-[#fef9e7] text-[#ca8a04]',
    green: 'bg-[#f0fdf4] text-[#16a34a]',
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col justify-between h-[120px] relative hover:shadow-[0_4px_20px_-4px_rgba(4,0,57,0.05)] transition-all duration-300 group cursor-pointer',
      )}
    >
      {/* Top row */}
      <div className="flex justify-between items-start">
        {/* Icon square wrapper */}
        <div
          className={cn(
            'w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base',
            bgColors[color],
          )}
        >
          ₦
        </div>

        {/* Up-Right Arrow Link indicator */}
        <ArrowUpRight
          size={16}
          className="text-[#9a99b0] group-hover:text-brand-pink group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
        />
      </div>

      {/* Stats details */}
      <div className="flex flex-col gap-0.5 mt-3">
        <span className="text-xl font-bold text-[#1a1a2e]">{amount}</span>
        <span className="text-xs text-[#7a7a9a] font-light">{label}</span>
      </div>
    </div>
  );
}
