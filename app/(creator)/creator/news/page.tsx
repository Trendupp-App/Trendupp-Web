'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Search, Newspaper, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MOCK_NEWS_ARTICLES, NewsArticle } from './mockNewsData';
import NewsDetailsDrawer from '@/components/dashboard/news/NewsDetailsDrawer';

type CategoryFilter = 'All' | 'Industry' | 'Platform Update' | 'Brands' | 'Tips';

export default function CreatorNewsPage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  // Filter articles based on category and search query
  const filteredArticles = MOCK_NEWS_ARTICLES.filter((article) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      article.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenArticle = (article: NewsArticle) => {
    setSelectedArticle(article);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const getCategoryStyles = (category: string) => {
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
  };

  // Define Category Pills mapping for rendering UI labels
  const categoriesList: { label: string; value: CategoryFilter }[] = [
    { label: 'All', value: 'All' },
    { label: 'Industry', value: 'Industry' },
    { label: 'Platform updates', value: 'Platform Update' },
    { label: 'Brands', value: 'Brands' },
    { label: 'Tips', value: 'Tips' },
  ];

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
        {/* Category Pills (Horizontal Scrollable on mobile) */}
        <div className="flex items-center gap-2 overflow-x-auto auth-scrollbar pb-1 sm:pb-0 shrink-0">
          {categoriesList.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={cn(
                'px-4 py-2 text-xs font-medium rounded-full border transition-all cursor-pointer whitespace-nowrap',
                selectedCategory === cat.value
                  ? 'bg-brand-pink border-brand-pink text-white shadow-sm'
                  : 'bg-white border-[#e8e6f0]/85 hover:border-[#cbc8db] text-[#5a5a7a]',
              )}
            >
              {cat.label}
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

      {/* Empty State */}
      {filteredArticles.length === 0 && (
        <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-12 text-center text-[#7a7a9a] font-light mt-4 shadow-sm flex flex-col items-center justify-center gap-3">
          <Newspaper size={40} className="text-[#9a99b0]" />
          <p className="text-sm">No news articles found matching your criteria.</p>
        </div>
      )}

      {/* ----------------- DESKTOP VIEW LAYOUT (3-column grid) ----------------- */}
      {filteredArticles.length > 0 && (
        <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-3">
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              onClick={() => handleOpenArticle(article)}
              className="bg-white border border-[#e8e6f0]/60 rounded-[28px] overflow-hidden hover:shadow-[0_12px_32px_rgba(4,0,57,0.06)] transition-all duration-300 flex flex-col group cursor-pointer"
            >
              {/* Thumbnail Image banner with read time */}
              <div className="relative w-full h-[180px] bg-zinc-100 overflow-hidden shrink-0">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-103"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Read time overlay in bottom right */}
                <div className="absolute bottom-3 right-3 bg-black/55 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-full z-10">
                  {article.readTime}
                </div>
              </div>

              {/* Title & Metadata Card Details */}
              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <h3 className="text-[15px] font-bold text-[#1a1a2e] leading-snug line-clamp-2 group-hover:text-brand-pink transition-colors">
                  {article.title}
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-[#7a7a9a]">{article.brand}</span>
                    <span className="text-[10px] text-[#cbc8db]">•</span>
                    <span className="text-[10px] text-[#9a99b0] font-light">
                      {article.publishedAt}
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
      {filteredArticles.length > 0 && (
        <div className="flex md:hidden flex-col gap-5 mt-2">
          {/* Top Featured Card */}
          <div
            onClick={() => handleOpenArticle(filteredArticles[0])}
            className="bg-white border border-[#e8e6f0]/60 rounded-3xl overflow-hidden hover:shadow-[0_8px_30px_rgba(4,0,57,0.05)] transition-all duration-300 flex flex-col group cursor-pointer"
          >
            <div className="relative w-full h-[200px] bg-zinc-100 overflow-hidden shrink-0">
              <Image
                src={filteredArticles[0].image}
                alt={filteredArticles[0].title}
                fill
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute top-3 left-3 bg-brand-pink text-white text-[10px] font-semibold px-2.5 py-1 rounded-full z-10">
                {filteredArticles[0].category}
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pt-12 z-10">
                <h4 className="text-sm font-bold text-white leading-snug line-clamp-2">
                  {filteredArticles[0].title}
                </h4>
              </div>
              <div className="absolute bottom-3 right-3 bg-black/55 backdrop-blur-md text-white text-[9px] font-semibold px-2.5 py-0.5 rounded-full z-10">
                {filteredArticles[0].readTime}
              </div>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#2563eb]">
                  {filteredArticles[0].brand}
                </span>
                <span className="text-[10px] text-[#9a99b0] font-light mt-0.5">
                  {filteredArticles[0].publishedAt}
                </span>
              </div>
              <div className="p-2 rounded-full text-[#9a99b0] group-hover:text-brand-pink transition-colors shrink-0">
                <ExternalLink size={15} />
              </div>
            </div>
          </div>

          {/* Subsequent Vertical Feed list */}
          {filteredArticles.length > 1 && (
            <div className="flex flex-col gap-4">
              {filteredArticles.slice(1).map((article) => (
                <div
                  key={article.id}
                  onClick={() => handleOpenArticle(article)}
                  className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-3 flex flex-row gap-4 items-center hover:shadow-[0_8px_30px_rgba(4,0,57,0.04)] transition-all duration-300 cursor-pointer group"
                >
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-zinc-100 shrink-0">
                    <Image
                      src={article.image}
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
                      {article.publishedAt}
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

      {/* Slide-over Detail Drawer Component */}
      <NewsDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        article={selectedArticle}
      />
    </div>
  );
}
