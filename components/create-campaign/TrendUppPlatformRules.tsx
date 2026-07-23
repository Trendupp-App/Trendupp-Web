'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const PLATFORM_RULES = [
  'Content must not contain explicit, hateful, or politically sensitive material.',
  'All sponsored content must be clearly disclosed (#ad or Paid Partnership).',
  'Creators retain copyright; brands receive usage rights as specified.',
  'Content must go live within 7 days of approval.',
  'Trendupp reserves the right to flag content that violates community standards.',
];

export default function TrendUppPlatformRules() {
  const [rulesOpen, setRulesOpen] = useState(true);

  return (
    <div className="border border-[#e8e6f0] rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setRulesOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-[#faf9fc] transition-colors"
      >
        <span className="text-sm font-medium text-[#1a1a2e]">Trendupp platform rules</span>
        {rulesOpen ? (
          <ChevronUp size={16} className="text-[#9a99b0]" />
        ) : (
          <ChevronDown size={16} className="text-[#9a99b0]" />
        )}
      </button>

      {rulesOpen && (
        <div className="px-4 pb-4 flex flex-col gap-2.5 border-t border-[#e8e6f0] pt-3">
          {PLATFORM_RULES.map((rule, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-brand-pink text-white text-[10px] font-medium flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="text-sm font-light text-[#4a4a6a]">{rule}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
