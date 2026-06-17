'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ALL_NICHES_INDUSTRIES } from '@/constants/common';

interface Props {
  onNext: (data: { industries: string[] }) => void;
  onSkip: () => void;
  defaultValues?: { industries?: string[] };
}

export default function StepIndustry({ onNext, onSkip, defaultValues }: Props) {
  const [selected, setSelected] = useState<string[]>(defaultValues?.industries ?? []);

  function toggle(industry: string) {
    setSelected((prev) =>
      prev.includes(industry) ? prev.filter((n) => n !== industry) : [...prev, industry],
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-wrap gap-2 justify-center">
        {ALL_NICHES_INDUSTRIES.map((industry) => {
          const active = selected.includes(industry);
          return (
            <button
              key={industry}
              type="button"
              aria-pressed={active}
              onClick={() => toggle(industry)}
              className={`px-4 py-2 rounded-full text-sm font-light border transition-all duration-150 ${
                active
                  ? 'bg-brand-pink/10 border-brand-pink text-brand-pink'
                  : 'bg-white border-[#e8e6f0] text-[#1a1a2e] hover:border-brand-pink/40'
              }`}
            >
              {industry}
            </button>
          );
        })}
      </div>

      {selected.length < 3 && (
        <p className="text-[11px] text-[#9a99b0] text-center">
          Please select at least {3 - selected.length} more{' '}
          {3 - selected.length === 1 ? 'industry' : 'industries'}.
        </p>
      )}
      <Button
        type="button"
        disabled={selected.length < 3}
        onClick={() => onNext({ industries: selected })}
        className="w-full shadow-xl shadow-brand-pink-light bg-brand-pink rounded-md h-12 text-[15px] font-light text-white mt-2 disabled:bg-brand-pink-light"
      >
        Continue
      </Button>

      <button
        type="button"
        onClick={onSkip}
        className="text-sm text-[#7a7a9a] underline underline-offset-2 hover:text-[#1a1a2e] text-center transition-colors"
      >
        I&apos;ll do that later
      </button>
    </div>
  );
}
