'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

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

const SORT_BY_OPTIONS = ['Newest', 'Closing Soon', 'Highest Budget'] as const;
const PLATFORM_OPTIONS = ['Instagram', 'TikTok', 'YouTube', 'X (Twitter)'] as const;
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
  const [sortBy, setSortBy] = useState<FilterState['sortBy']>(currentFilters.sortBy);
  const [platforms, setPlatforms] = useState<string[]>(currentFilters.platforms);
  const [niches, setNiches] = useState<string[]>(currentFilters.niches);
  const [campaignGoal, setCampaignGoal] = useState<FilterState['campaignGoal']>(
    currentFilters.campaignGoal,
  );

  // Local state for niche dropdown search & toggle
  const [isNicheOpen, setIsNicheOpen] = useState(true); // Default open as in screenshot
  const [nicheSearch, setNicheSearch] = useState('');

  const handleApply = () => {
    onApply({
      sortBy,
      platforms,
      niches,
      campaignGoal,
    });
    onClose();
  };

  const handleLocalReset = () => {
    setSortBy('Newest');
    setPlatforms([]);
    setNiches([]);
    setCampaignGoal(null);
    setNicheSearch('');
    onReset();
  };

  const togglePlatform = (platform: string) => {
    setPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform],
    );
  };

  const toggleNiche = (niche: string) => {
    setNiches((prev) =>
      prev.includes(niche) ? prev.filter((n) => n !== niche) : [...prev, niche],
    );
  };

  // Filter niches dynamically
  const filteredNiches = NICHE_OPTIONS.filter((niche) =>
    niche.toLowerCase().includes(nicheSearch.toLowerCase()),
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[460px] max-h-[90vh] overflow-y-auto rounded-[24px] bg-white border border-[#e8e6f0]/60 p-6 flex flex-col gap-6 shadow-xl scrollbar-hide">
        <DialogHeader className="flex flex-row items-center justify-between pb-2 border-b border-[#e8e6f0]/40">
          <DialogTitle className="text-base font-bold text-[#1a1a2e] tracking-tight">
            Filter & Sort
          </DialogTitle>
        </DialogHeader>

        {/* SORT BY */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider">
            Sort By
          </span>
          <div className="flex flex-wrap gap-2">
            {SORT_BY_OPTIONS.map((option) => {
              const isSelected = sortBy === option;
              return (
                <button
                  key={option}
                  onClick={() => setSortBy(option)}
                  className={cn(
                    'px-4 py-2 text-xs font-semibold rounded-2xl border transition-all duration-200 cursor-pointer',
                    isSelected
                      ? 'bg-[#040039] text-white border-[#040039] shadow-sm'
                      : 'bg-white text-[#1a1a2e] border-[#e8e6f0] hover:bg-[#fcfbfd]',
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        {/* PLATFORMS */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider">
            Platforms
          </span>
          <div className="flex flex-wrap gap-2">
            {PLATFORM_OPTIONS.map((option) => {
              const isSelected = platforms.includes(option);
              return (
                <button
                  key={option}
                  onClick={() => togglePlatform(option)}
                  className={cn(
                    'px-4 py-2 text-xs font-semibold rounded-2xl border transition-all duration-200 cursor-pointer',
                    isSelected
                      ? 'bg-[#040039] text-white border-[#040039] shadow-sm'
                      : 'bg-white text-[#1a1a2e] border-[#e8e6f0] hover:bg-[#fcfbfd]',
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        {/* NICHE (Custom Collapsible Select) */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider">
            Niche
          </span>
          <div className="border border-[#e8e6f0] rounded-[18px] p-4 flex flex-col bg-white">
            {/* Header Select Trigger */}
            <button
              onClick={() => setIsNicheOpen(!isNicheOpen)}
              className="flex items-center justify-between w-full text-xs font-semibold text-[#1a1a2e] cursor-pointer focus:outline-none"
            >
              <span>
                {niches.length > 0
                  ? `${niches.length} Niche${niches.length > 1 ? 's' : ''} Selected`
                  : 'Select Niche'}
              </span>
              {isNicheOpen ? (
                <ChevronUp className="w-4 h-4 text-[#7a7a9a]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#7a7a9a]" />
              )}
            </button>

            {/* Dropdown Content */}
            {isNicheOpen && (
              <div className="flex flex-col gap-3 mt-3">
                <hr className="border-[#e8e6f0]/40 -mx-4" />

                {/* Search Box */}
                <div className="relative w-full">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9a99b0]" />
                  <input
                    type="text"
                    placeholder="Search niche"
                    value={nicheSearch}
                    onChange={(e) => setNicheSearch(e.target.value)}
                    className="w-full h-9 bg-white border border-[#e8e6f0] rounded-xl pl-9 pr-3 text-xs font-light text-[#1a1a2e] focus:outline-none focus:ring-1 focus:ring-brand-pink/30 placeholder-[#9a99b0]"
                  />
                </div>

                {/* Checkboxes List */}
                <div className="max-h-36 overflow-y-auto flex flex-col gap-3 pt-1 select-none pr-1">
                  {filteredNiches.length > 0 ? (
                    filteredNiches.map((niche) => {
                      const isChecked = niches.includes(niche);
                      return (
                        <label
                          key={niche}
                          className="flex items-center gap-2.5 cursor-pointer text-xs font-light text-[#5e5e5e] hover:text-[#1a1a2e]"
                        >
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={() => toggleNiche(niche)}
                            className="w-4 h-4 border-[#e8e6f0] data-[state=checked]:bg-[#040039] data-[state=checked]:border-[#040039]"
                          />
                          <span>{niche}</span>
                        </label>
                      );
                    })
                  ) : (
                    <span className="text-[11px] font-light text-[#9a99b0] py-2">
                      No niches found
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CAMPAIGN GOAL */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider">
            Campaign Goal
          </span>
          <div className="flex flex-wrap gap-2">
            {GOAL_OPTIONS.map((option) => {
              const isSelected = campaignGoal === option;
              return (
                <button
                  key={option}
                  onClick={() => setCampaignGoal(isSelected ? null : option)}
                  className={cn(
                    'px-4 py-2 text-xs font-semibold rounded-2xl border transition-all duration-200 cursor-pointer',
                    isSelected
                      ? 'bg-[#040039] text-white border-[#040039] shadow-sm'
                      : 'bg-white text-[#1a1a2e] border-[#e8e6f0] hover:bg-[#fcfbfd]',
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions Stack */}
        <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-[#e8e6f0]/40">
          <Button
            onClick={handleApply}
            className="w-full py-5 rounded-[18px] bg-brand-pink text-white hover:bg-brand-pink/90 font-semibold text-xs transition-colors shadow-sm cursor-pointer border-none"
          >
            Apply Filters
          </Button>
          <Button
            onClick={handleLocalReset}
            className="w-full py-5 rounded-[18px] bg-[#f0effb] text-[#040039] hover:bg-[#e4e2fa] font-semibold text-xs transition-colors cursor-pointer border-none shadow-none"
          >
            Reset
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
