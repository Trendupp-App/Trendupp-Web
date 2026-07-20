'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useNewsList } from '@/hooks/useNews';
import NewsArticleCard from './NewsArticleCard';

const NEWS_LIMIT = 12;

export default function NewsExploreTab() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [knownCategories, setKnownCategories] = useState<string[]>([]);

  const { data, isLoading } = useNewsList({
    status: 'published',
    category: activeCategory === 'all' ? undefined : activeCategory,
    limit: NEWS_LIMIT,
  });

  const articles = data?.data ?? [];

  // Grow the pill list with any newly-seen category, since categories are admin-defined free text
  useEffect(() => {
    if (!data) return;
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    setKnownCategories((prev) => {
      const next = new Set(prev);
      data.data.forEach((a) => next.add(a.category));
      return Array.from(next).sort();
    });
  }, [data]);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-bold text-[#1a1a2e]">News & updates</h2>
        <p className="text-sm text-[#7a7a9a] mt-0.5">Creator news updates</p>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto auth-scrollbar pb-1">
        <button
          onClick={() => setActiveCategory('all')}
          className={cn(
            'px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors cursor-pointer',
            activeCategory === 'all'
              ? 'bg-brand-pink text-white'
              : 'bg-white text-[#5a5a7a] border border-[#e8e6f0] hover:bg-[#faf9fc]',
          )}
        >
          All
        </button>
        {knownCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              'px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors cursor-pointer',
              activeCategory === cat
                ? 'bg-brand-pink text-white'
                : 'bg-white text-[#5a5a7a] border border-[#e8e6f0] hover:bg-[#faf9fc]',
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#e8e6f0] rounded-2xl overflow-hidden animate-pulse"
            >
              <div className="aspect-[16/10] bg-zinc-100" />
              <div className="p-4 flex flex-col gap-2">
                <div className="h-4 bg-zinc-100 rounded w-full" />
                <div className="h-4 bg-zinc-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && articles.length === 0 && (
        <div className="bg-white border border-[#e8e6f0] rounded-2xl p-10 text-center text-sm text-[#7a7a9a]">
          No news articles found.
        </div>
      )}

      {!isLoading && articles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {articles.map((article) => (
            <NewsArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
