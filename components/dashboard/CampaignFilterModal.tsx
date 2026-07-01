'use client';

import { useState, useCallback } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ModalHeader } from '@/components/ui/modal-header';
import { ToggleButtonGroup } from '@/components/ui/toggle-button-group';
import { CheckboxList } from '@/components/ui/checkbox-list';
import { ModalActionButton } from '@/components/ui/modal-action-button';
import { ChevronDown, ChevronUp } from 'lucide-react';

export interface FilterState {
  sortBy: 'Newest' | 'Closing Soon' | 'Highest Budget' | null;
  platforms: string[];
  niches: string[];
  campaignGoal: 'Content Creation' | 'Amplification' | null;
}

interface CampaignFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  onReset: () => void;
  currentFilters: FilterState;
}

const SORT_BY_OPTIONS = ['Newest', 'Highest Budget', 'Closing Soon'] as const;
const PLATFORM_OPTIONS = ['Instagram', 'TikTok', 'YouTube', 'X'] as const;
const NICHE_OPTIONS = [
  'Fashion',
  'Tech',
  'Food',
  'Beauty',
  'Lifestyle',
  'Finance',
  'Music',
  'Sport',
  'Travel',
] as const;
const GOAL_OPTIONS = ['Content Creation', 'Amplification'] as const;

export default function CampaignFilterModal({
  isOpen,
  onClose,
  onApply,
  onReset,
  currentFilters,
}: CampaignFilterModalProps) {
  // State
  const [sortBy, setSortBy] = useState<FilterState['sortBy']>(currentFilters.sortBy ?? 'Newest');
  const [platforms, setPlatforms] = useState<string[]>(currentFilters.platforms);
  const [niches, setNiches] = useState<string[]>(currentFilters.niches);
  const [campaignGoal, setCampaignGoal] = useState<FilterState['campaignGoal']>(
    currentFilters.campaignGoal,
  );
  const [isNicheOpen, setIsNicheOpen] = useState(true);
  const [nicheSearch, setNicheSearch] = useState('');

  // Synchronize local states when the modal is opened
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setSortBy(currentFilters.sortBy ?? 'Newest');
      setPlatforms(currentFilters.platforms ?? []);
      setNiches(currentFilters.niches ?? []);
      setCampaignGoal(currentFilters.campaignGoal ?? null);
    }
  }

  // Helpers
  const togglePlatform = useCallback(
    (platform: string) =>
      setPlatforms((prev) =>
        prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform],
      ),
    [],
  );

  const toggleNiche = useCallback(
    (niche: string) =>
      setNiches((prev) =>
        prev.includes(niche) ? prev.filter((n) => n !== niche) : [...prev, niche],
      ),
    [],
  );

  // Actions
  const handleApply = () => {
    onApply({ sortBy, platforms, niches, campaignGoal });
    onClose();
  };

  const handleReset = () => {
    setSortBy('Newest');
    setPlatforms([]);
    setNiches([]);
    setCampaignGoal(null);
    setNicheSearch('');
    onReset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-[440px] max-h-[90vh] overflow-y-auto rounded-[24px] bg-white border border-[#e8e6f0]/60 p-6 flex flex-col gap-6 shadow-xl scrollbar-hide select-none"
      >
        <ModalHeader title="Filter & Sort" onClose={onClose} />

        {/* SORT BY */}
        <section className="flex flex-col gap-2.5">
          <span className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider">
            Sort By
          </span>
          <ToggleButtonGroup
            options={SORT_BY_OPTIONS}
            selected={sortBy ?? ''}
            onSelect={setSortBy}
          />
        </section>

        {/* PLATFORMS */}
        <section className="flex flex-col gap-2.5">
          <span className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider">
            Platforms
          </span>
          <ToggleButtonGroup
            options={PLATFORM_OPTIONS}
            selected={platforms}
            multiple
            onSelect={togglePlatform}
          />
        </section>

        {/* NICHE */}
        <section className="flex flex-col gap-2.5">
          <span className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider">
            Niche
          </span>
          <div className="border border-[#e8e6f0] rounded-[20px] p-4 flex flex-col bg-white">
            <button
              onClick={() => setIsNicheOpen(!isNicheOpen)}
              className="flex items-center justify-between w-full text-xs font-semibold text-[#1a1a2e] cursor-pointer focus:outline-none border-none bg-transparent"
            >
              <span>
                {niches.length
                  ? `${niches.length} Niche${niches.length > 1 ? 's' : ''} Selected`
                  : 'Select Niche'}
              </span>
              {isNicheOpen ? (
                <ChevronUp className="w-4 h-4 text-[#7a7a9a]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#7a7a9a]" />
              )}
            </button>
            <CheckboxList
              options={NICHE_OPTIONS}
              selected={niches}
              onToggle={toggleNiche}
              open={isNicheOpen}
              search={nicheSearch}
              setSearch={setNicheSearch}
              placeholder="Search niche"
            />
          </div>
        </section>

        {/* CAMPAIGN GOAL */}
        <section className="flex flex-col gap-2.5">
          <span className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider">
            Campaign Goal
          </span>
          <ToggleButtonGroup
            options={GOAL_OPTIONS}
            selected={campaignGoal ?? ''}
            variant="segmented"
            onSelect={(opt) => setCampaignGoal(campaignGoal === opt ? null : opt)}
          />
        </section>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col gap-3 mt-4 w-full">
          <ModalActionButton variant="primary" onClick={handleApply}>
            Apply Filters
          </ModalActionButton>
          <ModalActionButton variant="secondary" onClick={handleReset}>
            Reset
          </ModalActionButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
