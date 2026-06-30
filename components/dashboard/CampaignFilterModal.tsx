'use client';

import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
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
  const [sortBy, setSortBy] = useState<FilterState['sortBy']>(currentFilters.sortBy ?? 'Newest');
  const [platforms, setPlatforms] = useState<string[]>(currentFilters.platforms);
  const [niches, setNiches] = useState<string[]>(currentFilters.niches);
  const [campaignGoal, setCampaignGoal] = useState<FilterState['campaignGoal']>(
    currentFilters.campaignGoal,
  );

  // Local state for niche dropdown search & toggle (default true to show expanded niche list)
  const [isNicheOpen, setIsNicheOpen] = useState(true);
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
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-[440px] max-h-[90vh] overflow-y-auto rounded-[24px] bg-white border border-[#e8e6f0]/60 p-6 flex flex-col gap-6 shadow-xl scrollbar-hide select-none"
      >
        {/* Header with Title and Circle Close Icon */}
        <div className="flex items-center justify-between w-full pb-1">
          <h2 className="text-[18px] font-bold text-[#1a1a2e] tracking-tight">Filter & Sort</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#f4f4f8] hover:bg-[#eaeaf0] flex items-center justify-center text-[#1a1a2e] transition-colors focus:outline-none cursor-pointer border-none"
            aria-label="Close modal"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

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
                    'px-4 py-2.5 text-[13px] font-semibold rounded-full border transition-all duration-200 cursor-pointer leading-none',
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
                    'px-5 py-2.5 text-[13px] font-semibold rounded-full border transition-all duration-200 cursor-pointer leading-none',
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

        {/* NICHE */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider">
            Niche
          </span>
          <div className="border border-[#e8e6f0] rounded-[20px] p-4 flex flex-col bg-white">
            {/* Header Select Trigger */}
            <button
              onClick={() => setIsNicheOpen(!isNicheOpen)}
              className="flex items-center justify-between w-full text-xs font-semibold text-[#1a1a2e] cursor-pointer focus:outline-none border-none bg-transparent"
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
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9a99b0]" />
                  <input
                    type="text"
                    placeholder="Search niche"
                    value={nicheSearch}
                    onChange={(e) => setNicheSearch(e.target.value)}
                    className="w-full h-10 bg-white border border-[#e8e6f0] rounded-[14px] pl-10 pr-3 text-xs font-light text-[#1a1a2e] focus:outline-none focus:ring-1 focus:ring-brand-pink/30 placeholder-[#9a99b0]"
                  />
                </div>

                {/* Checkboxes List */}
                <div className="max-h-48 overflow-y-auto flex flex-col gap-3.5 pt-2 select-none pr-1 scrollbar-hide">
                  {filteredNiches.length > 0 ? (
                    filteredNiches.map((niche) => {
                      const isChecked = niches.includes(niche);
                      return (
                        <label
                          key={niche}
                          className="flex items-center gap-3 cursor-pointer text-xs font-light text-[#1a1a2e] hover:text-black"
                        >
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={() => toggleNiche(niche)}
                            className="w-[18px] h-[18px] border-[#e8e6f0] rounded-[5px] data-[state=checked]:bg-[#040039] data-[state=checked]:border-[#040039]"
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

        {/* CAMPAIGN GOAL (Segmented Horizontal Control) */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider">
            Campaign Goal
          </span>
          <div className="bg-[#f4f2fa] rounded-[18px] p-1.5 flex items-center w-full">
            {GOAL_OPTIONS.map((option) => {
              const isSelected = campaignGoal === option;
              return (
                <button
                  key={option}
                  onClick={() => setCampaignGoal(isSelected ? null : option)}
                  className={cn(
                    'flex-1 py-3 text-[13px] font-semibold rounded-[14px] transition-all cursor-pointer border-none text-center leading-none',
                    isSelected
                      ? 'bg-[#040039] text-white shadow-sm'
                      : 'bg-transparent text-[#7a7a9a] hover:text-[#5e5c7a]',
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 mt-4 w-full">
          <Button
            onClick={handleApply}
            className="w-full py-6 rounded-[18px] bg-brand-pink text-white hover:bg-brand-pink/90 font-bold text-sm transition-colors shadow-sm cursor-pointer border-none"
          >
            Apply Filters
          </Button>
          <Button
            onClick={handleLocalReset}
            className="w-full py-6 rounded-[18px] bg-[#f4f2fa] text-[#040039] hover:bg-[#eaeaf0] font-bold text-sm transition-colors cursor-pointer border-none shadow-none"
          >
            Reset
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
