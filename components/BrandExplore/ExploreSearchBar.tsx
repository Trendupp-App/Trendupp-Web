'use client';

import { Search } from 'lucide-react';

interface ExploreSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ExploreSearchBar({ value, onChange }: ExploreSearchBarProps) {
  return (
    <div className="relative w-64 rounded-full">
      <Search size={16} className="absolute left-4 top-3.5 text-[#9a99b0]" />
      <input
        type="text"
        placeholder="Search..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        // TODO: wire to /users/explore/search once the endpoint is fixed on the backend
        className="w-full h-11 pl-11 pr-4 bg-white border border-[#e8e6f0] rounded-full shadow text-sm text-[#1a1a2e] placeholder-[#9a99b0] focus:outline-none focus:ring-1 focus:ring-brand-pink/30"
      />
    </div>
  );
}
