'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useNewsList } from '@/hooks/useNews';
import { formatRelativeTime } from '@/utils/Utilities';
import type { NewsArticle } from '@/types/news';
import NewsDetailsDrawer from '@/components/dashboard/news/NewsDetailsDrawer';

const FALLBACK_COVER_IMAGE =
  'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80';

function NewsCard({ article, onClick }: { article: NewsArticle; onClick: () => void }) {
  return (
    <div onClick={onClick} className="cursor-pointer">
      <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-[#1a1a2e] mb-3">
        <Image
          src={article.coverImage || FALLBACK_COVER_IMAGE}
          alt={article.title}
          fill
          className="object-cover"
        />
        <span className="absolute bottom-2.5 right-2.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-brand-pink text-white">
          {article.category}
        </span>
      </div>

      <p className="text-sm font-semibold text-[#1a1a2e] leading-snug">{article.title}</p>

      <p className="text-xs text-brand-pink font-medium mt-1">
        {article.author.firstName} {article.author.lastName}
        <span className="text-[#9a99b0] font-normal">
          {' '}
          • {formatRelativeTime(article.publishedAt ?? article.createdAt)}
        </span>
      </p>
    </div>
  );
}

export default function TopNewsSection() {
  const [page, setPage] = useState(0);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { data, isLoading } = useNewsList({ status: 'published', isTopNews: true, limit: 5 });
  const articles = data?.data ?? [];
  const activeArticle = articles[page];

  const handleOpenArticle = (article: NewsArticle) => {
    setSelectedArticle(article);
    setIsDrawerOpen(true);
  };

  return (
    <div className="bg-white border border-[#f0eef8] rounded-2xl p-5 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-[#1a1a2e]">Top news</h2>
        <Link
          href="/brand/news"
          className="text-sm text-[#9a99b0] hover:text-brand-pink transition-colors"
        >
          See all
        </Link>
      </div>

      {isLoading && <div className="aspect-[16/9] rounded-xl bg-[#f4f3f6] animate-pulse" />}

      {!isLoading && !activeArticle && (
        <p className="text-sm text-[#9a99b0] text-center py-6">No top news yet.</p>
      )}

      {!isLoading && activeArticle && (
        <NewsCard article={activeArticle} onClick={() => handleOpenArticle(activeArticle)} />
      )}

      {/* Dots */}
      {articles.length > 1 && (
        <div className="flex justify-center gap-1.5">
          {articles.map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={cn(
                'rounded-full transition-all duration-300',
                i === page ? 'w-4 h-1.5 bg-brand-pink' : 'w-1.5 h-1.5 bg-[#e0ddef]',
              )}
              aria-label={`News item ${i + 1}`}
            />
          ))}
        </div>
      )}

      <NewsDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        article={selectedArticle}
      />
    </div>
  );
}
