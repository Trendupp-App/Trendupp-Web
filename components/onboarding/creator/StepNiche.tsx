'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNiches } from '@/hooks/useOnboardingQueries';
import { useUpdateNiches } from '@/hooks/useOnboardingMutations';
import StepNicheSkeleton from '@/components/skeletons/StepNicheSkeleton';
interface Props {
  onNext: (data: { niches: string[] }) => void;
  onSkip: () => void;
  defaultValues?: { niches?: string[] };
}

export default function StepNiche({ onNext, onSkip, defaultValues }: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>(defaultValues?.niches ?? []);
  const [customNiche, setCustomNiche] = useState('');
  const { data: niches, isLoading, isError } = useNiches();
  const { mutate: updateNiches, isPending } = useUpdateNiches();

  if (isLoading) return <StepNicheSkeleton />;

  if (isError || !niches) {
    return (
      <div className="text-center text-sm text-[#7a7a9a]">
        Couldn&apos;t load niches. Please try again.
      </div>
    );
  }

  const othersNiche = niches.find((n) => n.name.toLowerCase() === 'others');

  function toggle(id: string) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]));
  }

  function handleNext() {
    if (selectedIds.length < 3) return;

    updateNiches(
      { nicheIds: selectedIds },
      {
        onSuccess: () => onNext({ niches: selectedIds }),
      },
    );
  }
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Pills */}
      <div className="flex flex-wrap gap-2 justify-center">
        {niches?.map((niche) => {
          const active = selectedIds.includes(niche?.id);
          return (
            <button
              key={niche?.id}
              type="button"
              onClick={() => toggle(niche?.id)}
              className={`px-4 py-2 rounded-full text-sm font-light border transition-all duration-150 ${
                active
                  ? 'bg-brand-pink/10 border-brand-pink text-brand-pink'
                  : 'bg-white border-[#e8e6f0] text-[#1a1a2e] hover:border-brand-pink/40'
              }`}
            >
              {niche?.name}
            </button>
          );
        })}
      </div>

      {selectedIds.length > 0 && selectedIds.length < 3 && (
        <p className="text-[11px] text-[#9a99b0] text-center">
          Select {3 - selectedIds.length} more niche{3 - selectedIds.length > 1 ? 's' : ''}
        </p>
      )}

      {othersNiche && selectedIds.includes(othersNiche.id) && (
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
        disabled={selectedIds.length < 3 || isPending}
        onClick={handleNext}
        className="w-full shadow-xl shadow-brand-pink-light bg-brand-pink rounded-md h-12 text-[15px] font-light text-white mt-2 disabled:bg-brand-pink/40"
      >
        {isPending ? 'Saving...' : 'Continue'}
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
