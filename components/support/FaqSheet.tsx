'use client';

import { useState } from 'react';
import { HelpCircle, Search, X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { useFaqs } from '@/hooks/useSettings';
import FaqItem from './FaqItem';

interface FaqSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Lets users escalate when the FAQs don't answer their question */
  onContactSupport?: () => void;
}

export default function FaqSheet({ open, onOpenChange, onContactSupport }: FaqSheetProps) {
  const [query, setQuery] = useState('');
  const { data: faqs, isLoading } = useFaqs(open);

  const trimmed = query.trim().toLowerCase();
  const filteredFaqs = (faqs ?? []).filter(
    (faq) =>
      !trimmed ||
      faq.question.toLowerCase().includes(trimmed) ||
      faq.answer.toLowerCase().includes(trimmed),
  );

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) setQuery('');
      }}
    >
      <SheetContent side="right" className="px-3 w-full sm:max-w-[600px] overflow-y-auto pb-4">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-base font-semibold text-[#1a1a2e]">
            Frequently asked questions
          </SheetTitle>
          <p className="text-xs text-[#9a99b0]">Quick answers to common questions.</p>
        </SheetHeader>

        <div className="flex flex-col gap-4 px-4">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9a99b0] pointer-events-none"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search FAQs"
              aria-label="Search FAQs"
              className="w-full h-11 pl-10 pr-10 text-sm rounded-xl border border-[#e8e6f0] bg-white text-[#1a1a2e] placeholder:text-[#9a99b0] outline-none focus:border-brand-pink/50 focus:ring-2 focus:ring-brand-pink/10 transition-colors [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9a99b0] hover:text-[#1a1a2e] cursor-pointer"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex flex-col gap-2">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-12 rounded-xl" />
              ))
            ) : filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, i) => (
                <FaqItem
                  key={faq.id}
                  q={faq.question}
                  a={faq.answer}
                  // Expand the top hit when searching so the answer is visible straight away
                  defaultOpen={!!trimmed && i === 0}
                />
              ))
            ) : (
              <div className="flex flex-col items-center gap-2 py-10 text-center">
                <div className="w-11 h-11 rounded-full bg-brand-pink-light flex items-center justify-center">
                  <HelpCircle size={20} className="text-brand-pink" />
                </div>
                <p className="text-sm font-medium text-[#1a1a2e]">
                  {trimmed ? `No results for “${query.trim()}”` : 'No FAQs available right now'}
                </p>
                <p className="text-xs text-[#9a99b0]">
                  {trimmed ? 'Try a different keyword.' : 'Please check back later.'}
                </p>
              </div>
            )}
          </div>

          {onContactSupport && !isLoading && (
            <div className="flex items-center justify-between gap-3 mt-2 p-4 rounded-xl bg-[#faf9fc] border border-[#e8e6f0]">
              <div className="flex flex-col">
                <p className="text-sm font-semibold text-[#1a1a2e]">Still need help?</p>
                <p className="text-xs text-[#9a99b0]">Our support team is happy to assist.</p>
              </div>
              <button
                onClick={onContactSupport}
                className="shrink-0 px-4 py-2 rounded-lg bg-brand-pink text-white text-xs font-semibold hover:bg-brand-pink/90 transition-colors cursor-pointer"
              >
                Contact support
              </button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
