'use client';

import Link from 'next/link';
import { useRef, useState, useSyncExternalStore } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNewsList } from '@/hooks/useNews';
import { formatRelativeTime } from '@/utils/Utilities';
import type { NewsArticle } from '@/types/news';
import NewsDetailsDrawer from '@/components/dashboard/news/NewsDetailsDrawer';
import NewsCoverImage from '@/components/dashboard/news/NewsCoverImage';

const SLIDE_DURATION_MS = 6000;
const SWIPE_THRESHOLD_PX = 40;

function subscribeReducedMotion(callback: () => void) {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)');
  query.addEventListener('change', callback);
  return () => query.removeEventListener('change', callback);
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false,
  );
}

function NewsSlide({
  article,
  isActive,
  onClick,
}: {
  article: NewsArticle;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <div
      role="button"
      tabIndex={isActive ? 0 : -1}
      aria-hidden={!isActive}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className="w-full shrink-0 cursor-pointer group"
    >
      <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-[#1a1a2e] mb-3">
        <NewsCoverImage
          src={article.coverImage}
          alt={article.title}
          category={article.category}
          className="transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <span className="absolute bottom-2.5 right-2.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-brand-pink text-white">
          {article.category}
        </span>
      </div>

      <p className="text-sm font-semibold text-[#1a1a2e] leading-snug line-clamp-2">
        {article.title}
      </p>

      <p className="text-xs text-brand-pink font-medium mt-1 truncate">
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
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const pointerStartX = useRef<number | null>(null);
  const didSwipe = useRef(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const { data, isLoading } = useNewsList({ status: 'published', isTopNews: true, limit: 5 });
  const articles = data?.data ?? [];
  const count = articles.length;
  const hasMultiple = count > 1;
  // Clamp in case the list shrinks after a refetch
  const activeIndex = count ? Math.min(page, count - 1) : 0;

  const isPaused = isHovered || isFocused || isDrawerOpen;
  const isAutoplaying = hasMultiple && !prefersReducedMotion;

  const goTo = (index: number) => setPage(((index % count) + count) % count);
  const goNext = () => goTo(activeIndex + 1);
  const goPrev = () => goTo(activeIndex - 1);

  const handleOpenArticle = (article: NewsArticle) => {
    if (didSwipe.current) return;
    setSelectedArticle(article);
    setIsDrawerOpen(true);
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Top news"
      className="bg-white border border-[#f0eef8] rounded-2xl p-5 shadow-sm flex flex-col gap-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setIsFocused(false);
      }}
      onKeyDown={(e) => {
        if (!hasMultiple) return;
        if (e.key === 'ArrowRight') goNext();
        if (e.key === 'ArrowLeft') goPrev();
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-[#1a1a2e]">Top news</h2>
          {hasMultiple && (
            <span className="text-[11px] font-medium text-[#9a99b0] tabular-nums">
              {activeIndex + 1}/{count}
            </span>
          )}
        </div>
        <Link
          href="/brand/explore?tab=news"
          className="text-sm text-[#9a99b0] hover:text-brand-pink transition-colors"
        >
          See all
        </Link>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-2">
          <div className="aspect-[16/9] rounded-xl bg-[#f4f3f6] animate-pulse" />
          <div className="h-4 w-3/4 rounded bg-[#f4f3f6] animate-pulse" />
          <div className="h-3 w-1/2 rounded bg-[#f4f3f6] animate-pulse" />
        </div>
      )}

      {!isLoading && count === 0 && (
        <p className="text-sm text-[#9a99b0] text-center py-6">No top news yet.</p>
      )}

      {!isLoading && count > 0 && (
        <div className="relative">
          <div
            className="overflow-hidden touch-pan-y"
            onPointerDown={(e) => {
              pointerStartX.current = e.clientX;
              didSwipe.current = false;
            }}
            onPointerUp={(e) => {
              if (pointerStartX.current === null || !hasMultiple) return;
              const delta = e.clientX - pointerStartX.current;
              pointerStartX.current = null;
              if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return;
              didSwipe.current = true;
              if (delta < 0) goNext();
              else goPrev();
            }}
          >
            <div
              aria-live={isAutoplaying && !isPaused ? 'off' : 'polite'}
              className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {articles.map((article, i) => (
                <NewsSlide
                  key={article.id}
                  article={article}
                  isActive={i === activeIndex}
                  onClick={() => handleOpenArticle(article)}
                />
              ))}
            </div>
          </div>

          {/* Arrows sit over the image area so the carousel is obviously navigable */}
          {hasMultiple && (
            <div className="pointer-events-none absolute inset-x-0 top-0 aspect-[16/9] flex items-center justify-between px-2">
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous news"
                className="pointer-events-auto w-8 h-8 rounded-full bg-white/90 text-[#1a1a2e] shadow-md flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next news"
                className="pointer-events-auto w-8 h-8 rounded-full bg-white/90 text-[#1a1a2e] shadow-md flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Indicators: the active one fills up and advances the carousel when it completes */}
      {!isLoading && hasMultiple && (
        <div className="flex justify-center gap-1.5">
          {articles.map((article, i) => {
            const isActive = i === activeIndex;
            return (
              <button
                key={article.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to news ${i + 1} of ${count}`}
                aria-current={isActive}
                className="py-1.5 cursor-pointer"
              >
                <span
                  className={cn(
                    'relative block h-1.5 rounded-full overflow-hidden transition-all duration-300',
                    isActive ? 'w-8 bg-[#f6d3e3]' : 'w-1.5 bg-[#e0ddef] hover:bg-[#c9c5de]',
                  )}
                >
                  {isActive && (
                    <span
                      key={`${article.id}-${activeIndex}`}
                      className={cn(
                        'absolute inset-0 origin-left bg-brand-pink',
                        isAutoplaying && 'animate-slide-progress',
                      )}
                      style={
                        {
                          '--slide-duration': `${SLIDE_DURATION_MS}ms`,
                          animationPlayState: isPaused ? 'paused' : 'running',
                        } as React.CSSProperties
                      }
                      onAnimationEnd={goNext}
                    />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      )}

      <NewsDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        article={selectedArticle}
      />
    </section>
  );
}
