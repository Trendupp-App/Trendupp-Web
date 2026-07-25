'use client';

import { cn } from '@/lib/utils';

interface CategoryPillRowProps {
  categories: { id: string; name: string }[];
  activeId: string | null;
  onChange: (id: string | null) => void;
}

export default function CategoryPillRow({ categories, activeId, onChange }: CategoryPillRowProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
      <button
        onClick={() => onChange(null)}
        className={cn(
          'px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors cursor-pointer shrink-0',
          activeId === null
            ? 'bg-brand-pink text-white'
            : 'bg-white text-[#5a5a7a] border border-[#e8e6f0] hover:bg-[#faf9fc]',
        )}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={cn(
            'px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors cursor-pointer shrink-0',
            activeId === cat.id
              ? 'bg-brand-pink text-white'
              : 'bg-white text-[#5a5a7a] border border-[#e8e6f0] hover:bg-[#faf9fc]',
          )}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
