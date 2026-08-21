'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAds, useRecordAdClick, useRecordAdImpression } from '@/hooks/useAds';

const PLACEMENT = 'Home Page';

const FALLBACK_SLIDES = [0, 1, 2].map((i) => ({
  id: `fallback-${i}`,
  imageSrc: '/dashboard/competed img.png',
  imageAlt: `Creator Fashion Banner - Slide ${i + 1}`,
  linkUrl: null as string | null,
  isAd: false,
}));

export default function BannerCarousel() {
  const { data: ads } = useAds(PLACEMENT);
  const recordImpression = useRecordAdImpression();
  const recordClick = useRecordAdClick();

  const slides =
    ads && ads.length > 0
      ? ads.map((ad) => ({
          id: ad.id,
          imageSrc: ad.adImageUrl,
          imageAlt: ad.title,
          linkUrl: ad.linkUrl,
          isAd: true,
        }))
      : FALLBACK_SLIDES;

  const [activeSlide, setActiveSlide] = useState(0);
  // Clamp in case the slide count shrinks (e.g. ads finish loading with fewer slides) —
  // derived during render instead of synced back with an effect.
  const safeActiveSlide = activeSlide < slides.length ? activeSlide : 0;

  const current = slides[safeActiveSlide];

  useEffect(() => {
    if (current?.isAd) recordImpression.mutate(current.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id]);

  function goTo(index: number) {
    setActiveSlide((index + slides.length) % slides.length);
  }

  function handleSlideClick() {
    if (!current.isAd) return;
    recordClick.mutate(current.id, {
      onSuccess: ({ linkUrl }) => {
        if (linkUrl) window.open(linkUrl, '_blank', 'noopener,noreferrer');
      },
    });
  }

  return (
    <div className="flex flex-col w-full select-none">
      {/* Slide Viewport Card */}
      <div className="w-full h-[256px] rounded-[24px] overflow-hidden relative shadow-sm hover:shadow-md transition-shadow duration-300 group">
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            onClick={i === safeActiveSlide ? handleSlideClick : undefined}
            className={cn(
              'absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out',
              safeActiveSlide === i ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none',
              slide.isAd && 'cursor-pointer',
            )}
          >
            <Image
              src={slide.imageSrc}
              alt={slide.imageAlt}
              fill
              priority={i === 0}
              className="object-cover"
              sizes="(max-w-1024px) 100vw, 500px"
            />
          </div>
        ))}

        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(safeActiveSlide - 1)}
              aria-label="Previous slide"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <ChevronLeft size={18} className="text-[#1a1a2e]" />
            </button>
            <button
              type="button"
              onClick={() => goTo(safeActiveSlide + 1)}
              aria-label="Next slide"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <ChevronRight size={18} className="text-[#1a1a2e]" />
            </button>
          </>
        )}
      </div>

      {/* Slide Indicators - OUTSIDE/UNDERNEATH the card for all slides */}
      {slides.length > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              onClick={() => goTo(i)}
              className={cn(
                'rounded-full transition-all duration-300 cursor-pointer flex items-center justify-center',
                i === safeActiveSlide
                  ? 'w-3.5 h-3.5 border border-[#7c3aed] bg-transparent'
                  : 'w-2 h-2 bg-[#d1d1d6]',
              )}
              aria-label={`Go to slide ${i + 1}`}
            >
              {i === safeActiveSlide && <span className="w-1.5 h-1.5 bg-[#7c3aed] rounded-full" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
