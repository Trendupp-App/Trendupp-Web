'use client';

import { Search } from 'lucide-react';

interface ExploreSearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export default function ExploreSearchAndFilter({
  searchQuery,
  onSearchChange,
}: ExploreSearchAndFilterProps) {
  return (
    <div className="flex items-center gap-3 mb-5 shrink-0 w-full">
      {/* Search — always rendered, resized per breakpoint instead of hidden/shown */}
      <div className="relative flex-1 md:flex-none md:w-[320px]">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9a99b0] pointer-events-none"
        />
        <input
          type="text"
          placeholder="Search campaigns, brands..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full h-11 md:h-10 bg-white border border-[#e8e6f0]/80 rounded-[18px] md:rounded-2xl pl-11 pr-4 text-xs font-light text-[#1a1a2e] focus:outline-none focus:ring-1 focus:ring-brand-pink/30 placeholder-[#9a99b0] shadow-sm"
        />
      </div>
    </div>
  );
}
