'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useIndustries } from '@/hooks/useOnboardingQueries';
import { useUpdateIndustries } from '@/hooks/useOnboardingMutations';
import StepNicheSkeleton from '@/components/skeletons/StepNicheSkeleton';

interface Props {
  onNext: (data: { industries: string[] }) => void;
  onSkip: () => void;
  defaultValues?: { industries?: string[] };
}

export default function StepIndustry({ onNext, onSkip, defaultValues }: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>(defaultValues?.industries ?? []);
  const { data: industries, isLoading, isError } = useIndustries();
  const { mutate: updateIndustries, isPending } = useUpdateIndustries();

  if (isLoading) return <StepNicheSkeleton />;

  if (isError || !industries) {
    return (
      <div className="text-center text-sm text-[#7a7a9a]">
        Couldn&apos;t load industries. Please try again.
      </div>
    );
  }

  function toggle(id: string) {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((n) => n !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  }

  function handleNext() {
    if (selectedIds.length < 1 || selectedIds.length > 3) return;

    updateIndustries(
      { industryIds: selectedIds },
      { onSuccess: () => onNext({ industries: selectedIds }) },
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-wrap gap-2 justify-center">
        {industries.map((industry) => {
          const active = selectedIds.includes(industry.id);
          const disabled = !active && selectedIds.length >= 3;

          return (
            <button
              key={industry.id}
              type="button"
              disabled={disabled}
              aria-pressed={active}
              onClick={() => toggle(industry.id)}
              className={`px-4 py-2 cursor-pointer rounded-full text-sm font-light border transition-all duration-150 ${
                active
                  ? 'bg-brand-pink/10 border-brand-pink text-brand-pink'
                  : disabled
                    ? 'bg-white border-[#e8e6f0] text-[#c4c2d4] cursor-not-allowed'
                    : 'bg-white border-[#e8e6f0] text-[#1a1a2e] hover:border-brand-pink/40'
              }`}
            >
              {industry.name}
            </button>
          );
        })}
      </div>

      {selectedIds.length === 0 && (
        <p className="text-[11px] text-[#9a99b0] text-center">Select 1 to 3 industries</p>
      )}
      {selectedIds.length > 0 && selectedIds.length < 3 && (
        <p className="text-[11px] text-[#9a99b0] text-center">
          You can select up to {3 - selectedIds.length} more{' '}
          {3 - selectedIds.length === 1 ? 'industry' : 'industries'}
        </p>
      )}
      {selectedIds.length === 3 && (
        <p className="text-[11px] text-[#9a99b0] text-center">Maximum of 3 industries selected</p>
      )}

      <Button
        type="button"
        disabled={selectedIds.length < 1 || isPending}
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
