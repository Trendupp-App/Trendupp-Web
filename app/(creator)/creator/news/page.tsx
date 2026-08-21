'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Search, Newspaper, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNewsList } from '@/hooks/useNews';
import { useDebouncedValue } from '@/hooks/useDebounceValue';
import { formatRelativeTime, estimateReadTime } from '@/utils/Utilities';
import type { NewsArticle } from '@/types/news';
import NewsDetailsDrawer from '@/components/dashboard/news/NewsDetailsDrawer';

const NEWS_PAGE_LIMIT = 9;
const FALLBACK_COVER_IMAGE =
  'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80';

function getCategoryStyles(category: string) {
  switch (category) {
    case 'Industry':
      return 'bg-[#fde8f0] text-brand-pink';
    case 'Platform Update':
      return 'bg-[#eff6ff] text-[#2563eb]';
    case 'Brands':
      return 'bg-[#f5f3ff] text-[#6366f1]';
    case 'Tips':
      return 'bg-[#ecfdf5] text-[#10b981]';
    default:
      return 'bg-[#f4f3f6] text-[#5a5a7a]';
  }
}

export default function CreatorNewsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [knownCategories, setKnownCategories] = useState<string[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const debouncedSearch = useDebouncedValue(searchQuery);

  const { data, isLoading } = useNewsList({
    status: 'published',
    search: debouncedSearch || undefined,
    category: selectedCategory !== 'All' ? selectedCategory : undefined,
    page,
    limit: NEWS_PAGE_LIMIT,
  });

  const articles = data?.data ?? [];
  const totalPages = data?.meta.totalPages ?? 1;

  // Reset back to page 1 whenever the filters change
  useEffect(() => {
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    setPage(1);
  }, [selectedCategory, debouncedSearch]);

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

  const handleOpenArticle = (article: NewsArticle) => {
    setSelectedArticle(article);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const categoriesList = ['All', ...knownCategories];

  return (
    <div className="flex flex-col gap-6 w-full pb-12 select-none relative">
      {/* Title / Header Area - Desktop View (Header component controls the top bar) */}
      <div className="hidden md:flex flex-col gap-1.5">
        <h1 className="text-[28px] font-bold text-[#1a1a2e] tracking-tight">News & updates</h1>
        <p className="text-sm font-light text-[#7a7a9a]">Creator news updates</p>
      </div>

      {/* Header Area - Mobile View ("News & Insights") */}
      <div className="flex md:hidden flex-col gap-1">
        <h1 className="text-2xl font-bold text-[#1a1a2e] tracking-tight">News & Insights</h1>
        <p className="text-xs font-light text-[#7a7a9a]">Creator economy updates</p>
      </div>

      {/* Filter and Search Bar Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-1">
        {/* Category Pills (Horizontal Scrollable on mobile) */}
        <div className="flex items-center gap-2 overflow-x-auto auth-scrollbar pb-1 sm:pb-0 shrink-0">
          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                'px-4 py-2 text-xs font-medium rounded-full border transition-all cursor-pointer whitespace-nowrap',
                selectedCategory === cat
                  ? 'bg-brand-pink border-brand-pink text-white shadow-sm'
                  : 'bg-white border-[#e8e6f0]/85 hover:border-[#cbc8db] text-[#5a5a7a]',
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input field inside the page content for mobile & desktop fallback */}
        <div className="relative w-full sm:max-w-[280px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9a99b0]" />
          <input
            type="text"
            placeholder="Search news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 bg-white border border-[#e8e6f0]/85 rounded-full pl-9 pr-4 text-xs font-light text-[#1a1a2e] focus:outline-none focus:ring-1 focus:ring-brand-pink/30 placeholder-[#9a99b0] shadow-sm transition-all"
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-3">
          {Array.from({ length: NEWS_PAGE_LIMIT }).map((_, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#e8e6f0]/60 rounded-[28px] overflow-hidden animate-pulse"
            >
              <div className="w-full h-[180px] bg-zinc-100" />
              <div className="p-5 flex flex-col gap-3">
                <div className="h-4 bg-zinc-100 rounded w-full" />
                <div className="h-4 bg-zinc-100 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && articles.length === 0 && (
        <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-12 text-center text-[#7a7a9a] font-light mt-4 shadow-sm flex flex-col items-center justify-center gap-3">
          <Newspaper size={40} className="text-[#9a99b0]" />
          <p className="text-sm">No news articles found matching your criteria.</p>
        </div>
      )}

      {/* ----------------- DESKTOP VIEW LAYOUT (3-column grid) ----------------- */}
      {!isLoading && articles.length > 0 && (
        <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-3">
          {articles.map((article) => (
            <div
              key={article.id}
              onClick={() => handleOpenArticle(article)}
              className="bg-white border border-[#e8e6f0]/60 rounded-[28px] overflow-hidden hover:shadow-[0_12px_32px_rgba(4,0,57,0.06)] transition-all duration-300 flex flex-col group cursor-pointer"
            >
              {/* Thumbnail Image banner with read time */}
              <div className="relative w-full h-[180px] bg-zinc-100 overflow-hidden shrink-0">
                <Image
                  src={article.coverImage || FALLBACK_COVER_IMAGE}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-103"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Read time overlay in bottom right */}
                <div className="absolute bottom-3 right-3 bg-black/55 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-full z-10">
                  {estimateReadTime(article.content)}
                </div>
              </div>

              {/* Title & Metadata Card Details */}
              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <h3 className="text-[15px] font-bold text-[#1a1a2e] leading-snug line-clamp-2 group-hover:text-brand-pink transition-colors">
                  {article.title}
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-[#7a7a9a]">
                      {article.author.firstName} {article.author.lastName}
                    </span>
                    <span className="text-[10px] text-[#cbc8db]">•</span>
                    <span className="text-[10px] text-[#9a99b0] font-light">
                      {formatRelativeTime(article.publishedAt ?? article.createdAt)}
                    </span>
                  </div>
                  {/* Category Pill Tag */}
                  <span
                    className={cn(
                      'text-[9px] font-bold px-2.5 py-1 rounded-full',
                      getCategoryStyles(article.category),
                    )}
                  >
                    {article.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ----------------- MOBILE VIEW LAYOUT (Featured card + vertical feed) ----------------- */}
      {!isLoading && articles.length > 0 && (
        <div className="flex md:hidden flex-col gap-5 mt-2">
          {/* Top Featured Card */}
          <div
            onClick={() => handleOpenArticle(articles[0])}
            className="bg-white border border-[#e8e6f0]/60 rounded-3xl overflow-hidden hover:shadow-[0_8px_30px_rgba(4,0,57,0.05)] transition-all duration-300 flex flex-col group cursor-pointer"
          >
            <div className="relative w-full h-[200px] bg-zinc-100 overflow-hidden shrink-0">
              <Image
                src={articles[0].coverImage || FALLBACK_COVER_IMAGE}
                alt={articles[0].title}
                fill
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute top-3 left-3 bg-brand-pink text-white text-[10px] font-semibold px-2.5 py-1 rounded-full z-10">
                {articles[0].category}
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pt-12 z-10">
                <h4 className="text-sm font-bold text-white leading-snug line-clamp-2">
                  {articles[0].title}
                </h4>
              </div>
              <div className="absolute bottom-3 right-3 bg-black/55 backdrop-blur-md text-white text-[9px] font-semibold px-2.5 py-0.5 rounded-full z-10">
                {estimateReadTime(articles[0].content)}
              </div>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#2563eb]">
                  {articles[0].author.firstName} {articles[0].author.lastName}
                </span>
                <span className="text-[10px] text-[#9a99b0] font-light mt-0.5">
                  {formatRelativeTime(articles[0].publishedAt ?? articles[0].createdAt)}
                </span>
              </div>
              <div className="p-2 rounded-full text-[#9a99b0] group-hover:text-brand-pink transition-colors shrink-0">
                <ExternalLink size={15} />
              </div>
            </div>
          </div>

          {/* Subsequent Vertical Feed list */}
          {articles.length > 1 && (
            <div className="flex flex-col gap-4">
              {articles.slice(1).map((article) => (
                <div
                  key={article.id}
                  onClick={() => handleOpenArticle(article)}
                  className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-3 flex flex-row gap-4 items-center hover:shadow-[0_8px_30px_rgba(4,0,57,0.04)] transition-all duration-300 cursor-pointer group"
                >
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-zinc-100 shrink-0">
                    <Image
                      src={article.coverImage || FALLBACK_COVER_IMAGE}
                      alt={article.title}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col">
                    <span
                      className={cn(
                        'text-[8px] font-bold px-2 py-0.5 rounded-full w-fit',
                        getCategoryStyles(article.category),
                      )}
                    >
                      {article.category}
                    </span>
                    <h5 className="text-xs font-bold text-[#1a1a2e] leading-snug line-clamp-2 mt-1.5 group-hover:text-brand-pink transition-colors">
                      {article.title}
                    </h5>
                    <span className="text-[9px] text-[#9a99b0] font-light mt-1">
                      {formatRelativeTime(article.publishedAt ?? article.createdAt)}
                    </span>
                  </div>
                  <div className="p-2 text-[#9a99b0] group-hover:text-brand-pink transition-colors shrink-0">
                    <ExternalLink size={15} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && articles.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-2">
          <button
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
            className="w-8 h-8 rounded-lg border border-[#e8e6f0] hover:bg-[#fcfbfd] flex items-center justify-center text-xs font-semibold text-[#7a7a9a] disabled:opacity-40 transition-colors cursor-pointer"
          >
            &lt;
          </button>
          {Array.from({ length: totalPages }).map((_, idx) => {
            const pageNum = idx + 1;
            const isActive = pageNum === page;
            return (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all cursor-pointer',
                  isActive
                    ? 'bg-brand-pink text-white shadow-xs'
                    : 'border border-[#e8e6f0] hover:bg-[#fcfbfd] text-[#7a7a9a]',
                )}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page === totalPages}
            className="w-8 h-8 rounded-lg border border-[#e8e6f0] hover:bg-[#fcfbfd] flex items-center justify-center text-xs font-semibold text-[#7a7a9a] disabled:opacity-40 transition-colors cursor-pointer"
          >
            &gt;
          </button>
        </div>
      )}

      {/* Slide-over Detail Drawer Component */}
      <NewsDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        article={selectedArticle}
      />
    </div>
  );
}
