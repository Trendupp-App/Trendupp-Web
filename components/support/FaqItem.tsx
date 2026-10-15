'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FaqItem({
  q,
  a,
  defaultOpen = false,
}: {
  q: string;
  a: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-[#e8e6f0] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full cursor-pointer flex items-center justify-between px-4 py-3.5 text-left hover:bg-[#faf9fc] transition-colors"
      >
        <span className="text-sm font-medium text-[#1a1a2e] pr-4">{q}</span>
        <ChevronDown
          size={16}
          className={cn(
            'text-[#9a99b0] shrink-0 transition-transform duration-200',
            open && 'rotate-180',
          )}
        />
      </button>
      {open && (
        <div className="px-4 pb-4 text-sm text-[#4a4a6a] leading-relaxed border-t border-[#e8e6f0] pt-3 whitespace-pre-line">
          {a}
        </div>
      )}
    </div>
  );
}
