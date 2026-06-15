'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ALL_NICHES = [
  'Sports',
  'Fitness',
  'Comedy',
  'Travel',
  'Beauty',
  'Parenting',
  'Finance',
  'Technology',
  'Fashion',
  'Lifestyle',
  'Education',
  'Food & Drink',
  'Activism',
  'Social Good',
  'Wellness',
  'Music',
  'Gaming',
  'Hospitality',
  'Others',
];

interface Props {
  onNext: (data: { niches: string[] }) => void;
  onSkip: () => void;
  defaultValues?: { niches?: string[] };
}

export default function StepNiche({ onNext, onSkip, defaultValues }: Props) {
  const [selected, setSelected] = useState<string[]>(defaultValues?.niches ?? []);
  const [customNiche, setCustomNiche] = useState('');

  function toggle(niche: string) {
    setSelected((prev) =>
      prev.includes(niche) ? prev.filter((n) => n !== niche) : [...prev, niche],
    );
  }

  function handleNext() {
    const finalNiches =
      selected.includes('Others') && customNiche.trim()
        ? [...selected.filter((n) => n !== 'Others'), customNiche.trim()]
        : selected;
    onNext({ niches: finalNiches });
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Pills */}
      <div className="flex flex-wrap gap-2 justify-center">
        {ALL_NICHES.map((niche) => {
          const active = selected.includes(niche);
          return (
            <button
              key={niche}
              type="button"
              onClick={() => toggle(niche)}
              className={`px-4 py-2 rounded-full text-sm font-light border transition-all duration-150 ${
                active
                  ? 'bg-brand-pink/10 border-brand-pink text-brand-pink'
                  : 'bg-white border-[#e8e6f0] text-[#1a1a2e] hover:border-brand-pink/40'
              }`}
            >
              {niche}
            </button>
          );
        })}
      </div>

      {selected.length > 0 && selected.length < 3 && (
        <p className="text-[11px] text-[#9a99b0] text-center">
          Select {3 - selected.length} more niche{3 - selected.length > 1 ? 's' : ''}
        </p>
      )}
      {selected.includes('Others') && (
        <div className="w-full mt-1">
          <Input
            type="text"
            value={customNiche}
            onChange={(e) => setCustomNiche(e.target.value)}
            placeholder="Type your niche..."
            className="w-full border border-[#e8e6f0] rounded-lg h-10 px-3 text-sm font-light text-[#1a1a2e] placeholder:text-[#9a99b0] focus:outline-none focus:border-brand-pink focus:ring-1 focus:ring-brand-pink/30"
          />
        </div>
      )}

      <Button
        type="button"
        disabled={selected.length < 3}
        onClick={handleNext}
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
