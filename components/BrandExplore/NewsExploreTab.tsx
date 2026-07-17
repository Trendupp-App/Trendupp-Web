'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { NewsCategory } from '@/dummy/news';
import { DUMMY_NEWS } from '@/dummy/news';
import NewsArticleCard from './NewsArticleCard';

const NEWS_FILTERS: { id: NewsCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'industry', label: 'Industry' },
  { id: 'platform_update', label: 'Platform updates' },
  { id: 'brands', label: 'Brands' },
];

export default function NewsExploreTab() {
  const [activeFilter, setActiveFilter] = useState<NewsCategory | 'all'>('all');

  const filtered =
    activeFilter === 'all' ? DUMMY_NEWS : DUMMY_NEWS.filter((n) => n.category === activeFilter);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-bold text-[#1a1a2e]">News & updates</h2>
        <p className="text-sm text-[#7a7a9a] mt-0.5">Creator news updates</p>
      </div>

      <div className="flex items-center gap-2">
        {NEWS_FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={cn(
              'px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors cursor-pointer',
              activeFilter === f.id
                ? 'bg-brand-pink text-white'
                : 'bg-white text-[#5a5a7a] border border-[#e8e6f0] hover:bg-[#faf9fc]',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filtered.map((article) => (
          <NewsArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
