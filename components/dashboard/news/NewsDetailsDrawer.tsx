'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, ExternalLink, Share2, Bookmark } from 'lucide-react';
import { Portal } from '@/components/ui/portal';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { NewsArticle } from '@/app/(creator)/creator/news/mockNewsData';

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

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(article.fullStoryUrl);
    toast.success('Full story link copied to clipboard!');
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
    <Portal>
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
              src={article.detailImage || article.image}
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
                <div className="w-9 h-9 rounded-full bg-[#fde8f0] text-brand-pink font-bold flex items-center justify-center text-xs">
                  {article.brandAvatar || 'TA'}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm font-bold text-[#1a1a2e]">
                    {article.brand}
                  </span>
                  <span className="text-[10px] sm:text-xs text-[#9a99b0] font-light mt-0.5">
                    {article.publishedAt} &nbsp;•&nbsp; {article.readTime}
                  </span>
                </div>
              </div>
            </div>

            {/* Article Text & Sections */}
            <div className="flex flex-col gap-4 text-xs sm:text-sm text-[#3a3a54] font-light leading-relaxed">
              {/* Summary */}
              <p>{article.summary}</p>

              {/* How Trendupp Works Step-Timeline Box */}
              {article.howItWorks && (
                <div className="border border-[#e8e6f0] rounded-[20px] p-5 my-2 bg-[#faf9fc]/30 flex flex-col gap-4">
                  <h4 className="text-xs sm:text-sm font-bold text-[#1a1a2e]">
                    How Trendupp Works
                  </h4>

                  {/* Vertical Step Timeline */}
                  <div className="flex flex-col">
                    {/* Step 1 */}
                    <div className="relative flex gap-3.5 pb-4">
                      <div className="flex flex-col items-center shrink-0">
                        <div className="w-6 h-6 rounded-full bg-[#0000d8] text-white flex items-center justify-center font-bold text-[10px] z-10">
                          1
                        </div>
                        <div className="w-[1px] bg-[#e8e6f0] flex-1 my-1" />
                      </div>
                      <div className="pt-0.5">
                        <h5 className="text-[11px] sm:text-xs font-bold text-[#1a1a2e]">Apply</h5>
                        <p className="text-[10px] sm:text-[11px] text-[#7a7a9a] font-light mt-0.5 leading-snug">
                          Send your application to campaigns that match your niche.
                        </p>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="relative flex gap-3.5 pb-4">
                      <div className="flex flex-col items-center shrink-0">
                        <div className="w-6 h-6 rounded-full bg-[#0000d8] text-white flex items-center justify-center font-bold text-[10px] z-10">
                          2
                        </div>
                        <div className="w-[1px] bg-[#e8e6f0] flex-1 my-1" />
                      </div>
                      <div className="pt-0.5">
                        <h5 className="text-[11px] sm:text-xs font-bold text-[#1a1a2e]">Create</h5>
                        <p className="text-[10px] sm:text-[11px] text-[#7a7a9a] font-light mt-0.5 leading-snug">
                          Produce content for the brand following their brief.
                        </p>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="relative flex gap-3.5">
                      <div className="flex flex-col items-center shrink-0">
                        <div className="w-6 h-6 rounded-full bg-[#0000d8] text-white flex items-center justify-center font-bold text-[10px] z-10">
                          3
                        </div>
                      </div>
                      <div className="pt-0.5">
                        <h5 className="text-[11px] sm:text-xs font-bold text-[#1a1a2e]">
                          Get Paid
                        </h5>
                        <p className="text-[10px] sm:text-[11px] text-[#7a7a9a] font-light mt-0.5 leading-snug">
                          Earn guaranteed payments via escrow — funds secured upfront.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Dynamic Content paragraphs/sections */}
              {article.content.map((sec, idx) => (
                <div key={idx} className="flex flex-col gap-2">
                  {sec.heading && (
                    <h3 className="text-xs sm:text-sm font-bold text-[#1a1a2e] mt-2">
                      {sec.heading}
                    </h3>
                  )}
                  <p>{sec.text}</p>
                </div>
              ))}
            </div>

            {/* Tags List */}
            <div className="flex flex-wrap gap-2 mt-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-[#f4f3f6] text-[#5a5a7a] text-[10px] sm:text-xs font-semibold px-4 py-2 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Centered Read Full Story Button at the bottom */}
            <div className="flex justify-center w-full mt-4">
              <a
                href={article.fullStoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full max-w-[420px] flex items-center justify-center gap-2 bg-[#eff6ff] hover:bg-[#eff6ff]/80 text-[#2563eb] py-3.5 px-6 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 border border-[#e8e6f0]/20 shadow-sm text-center"
              >
                <ExternalLink size={14} />
                <span>Read full news on Trendupp Africa</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}
