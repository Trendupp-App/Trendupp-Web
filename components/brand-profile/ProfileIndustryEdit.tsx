'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useIndustries } from '@/hooks/useOnboardingQueries';
import { useUpdateProfileIndustries } from '@/hooks/useBrandProfileMutations';
import { useAuthStore } from '@/store/authStore';
import StepNicheSkeleton from '@/components/skeletons/StepNicheSkeleton';

interface ProfileIndustryEditProps {
  onSaved?: () => void;
}

export default function ProfileIndustryEdit({ onSaved }: ProfileIndustryEditProps) {
  const user = useAuthStore((s) => s.user);
  const [selectedIds, setSelectedIds] = useState<string[]>(
    user?.industries?.map((i) => i.id) ?? [],
  );
  const { data: industries, isLoading, isError } = useIndustries();
  const { mutate: updateIndustries, isPending } = useUpdateProfileIndustries();

  if (isLoading) return <StepNicheSkeleton />;
  if (isError || !industries) {
    return <div className="text-center text-sm text-[#7a7a9a]">Couldn&apos;t load industries.</div>;
  }

  function toggle(id: string) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]));
  }

  function handleSave() {
    updateIndustries({ industryIds: selectedIds }, { onSuccess: () => onSaved?.() });
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-wrap gap-2 justify-center">
        {industries.map((industry) => {
          const active = selectedIds.includes(industry.id);
          return (
            <button
              key={industry.id}
              type="button"
              onClick={() => toggle(industry.id)}
              className={`px-4 py-2 cursor-pointer rounded-full text-sm font-light border transition-all duration-150 ${
                active
                  ? 'bg-brand-pink/10 border-brand-pink text-brand-pink'
                  : 'bg-white border-[#e8e6f0] text-[#1a1a2e] hover:border-brand-pink/40'
              }`}
            >
              {industry.name}
            </button>
          );
        })}
      </div>

      <Button
        type="button"
        disabled={selectedIds.length === 0 || isPending}
        onClick={handleSave}
        className="w-full bg-brand-pink rounded-md h-12 text-[15px] font-light text-white mt-2 disabled:bg-brand-pink/40"
      >
        {isPending ? 'Saving...' : 'Save'}
      </Button>
    </div>
  );
}
