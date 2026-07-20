'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Share2, Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { NewsArticle } from '@/types/news';
import { formatRelativeTime, estimateReadTime } from '@/utils/Utilities';

const FALLBACK_COVER_IMAGE =
  'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80';

interface NewsDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  article: NewsArticle | null;
}

export default function NewsDetailsDrawer({ isOpen, onClose, article }: NewsDetailsDrawerProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Lock scrolling when the drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!article) return null;

  const authorName = `${article.author.firstName} ${article.author.lastName}`.trim();
  const authorInitials =
    `${article.author.firstName?.[0] ?? ''}${article.author.lastName?.[0] ?? ''}`.toUpperCase() ||
    'TA';

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked((prev) => {
      const next = !prev;
      if (next) {
        toast.success('Article bookmarked!');
      } else {
        toast.success('Bookmark removed');
      }
      return next;
    });
  };

  return (
    <>
      {/* Backdrop with soft blur */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/40 backdrop-blur-[3px] transition-opacity duration-300 ease-out',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        onClick={onClose}
      />

      {/* Right-aligned Slide-over Drawer Panel */}
      <div
        className={cn(
          'fixed right-0 top-0 bottom-0 h-full w-full max-w-[560px] bg-white z-50 flex flex-col shadow-2xl transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* Sticky Header with Close Button X */}
        <div className="flex justify-end p-5 shrink-0 bg-white">
          <button
            onClick={onClose}
            className="text-[#1a1a2e] hover:text-[#7a7a9a] transition-colors focus:outline-none cursor-pointer p-1"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content Container (Padded, single column) */}
        <div className="flex-1 overflow-y-auto auth-scrollbar px-6 md:px-8 pb-10 select-none flex flex-col">
          {/* Hero Image Section (Nested inside padding, rounded, not full-bleed) */}
          <div className="relative w-full h-[200px] md:h-[240px] rounded-[24px] overflow-hidden bg-zinc-100 shrink-0 mb-5">
            <Image
              src={article.coverImage || FALLBACK_COVER_IMAGE}
              alt={article.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 560px) 100vw, 560px"
            />
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20 pointer-events-none" />

            {/* Share & Bookmark Actions inside image top-left */}
            <div className="absolute top-4 left-4 flex gap-2 z-10">
              <button
                onClick={handleShare}
                className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-all cursor-pointer"
                aria-label="Share article"
              >
                <Share2 size={14} />
              </button>
              <button
                onClick={handleBookmarkToggle}
                className={cn(
                  'w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-all cursor-pointer',
                  isBookmarked && 'text-brand-pink',
                )}
                aria-label="Bookmark article"
              >
                <Bookmark size={14} fill={isBookmarked ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Category Tag Overlay in bottom-right corner of image */}
            <div className="absolute bottom-4 right-4 bg-brand-pink text-white text-[10px] sm:text-xs font-bold px-3.5 py-1 rounded-full z-10">
              {article.category}
            </div>
          </div>

          {/* Article details content */}
          <div className="flex flex-col gap-5">
            {/* Title and Metadata */}
            <div className="flex flex-col gap-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a2e] leading-snug tracking-tight">
                {article.title}
              </h2>

              {/* Publisher Row */}
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-full bg-[#fde8f0] text-brand-pink font-bold flex items-center justify-center text-xs overflow-hidden shrink-0">
                  {article.author.avatarUrl ? (
                    <Image
                      src={article.author.avatarUrl}
                      alt={authorName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    authorInitials
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm font-bold text-[#1a1a2e]">{authorName}</span>
                  <span className="text-[10px] sm:text-xs text-[#9a99b0] font-light mt-0.5">
                    {formatRelativeTime(article.publishedAt ?? article.createdAt)} &nbsp;•&nbsp;{' '}
                    {estimateReadTime(article.content)}
                  </span>
                </div>
              </div>
            </div>

            {/* Article Text & Sections */}
            <div className="flex flex-col gap-4 text-xs sm:text-sm text-[#3a3a54] font-light leading-relaxed">
              {/* Summary */}
              {article.summary && <p>{article.summary}</p>}

              {/* Rich content from the CMS */}
              <div
                className="prose prose-sm max-w-none prose-p:my-2 prose-headings:text-[#1a1a2e] prose-headings:font-bold"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
