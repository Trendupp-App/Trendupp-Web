'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAds, useRecordAdClick, useRecordAdImpression } from '@/hooks/useAds';

const PLACEMENT = 'Home Page';

interface BannerSlide {
  id: string;
  imageSrc: string;
  imageAlt: string;
  linkUrl: string | null;
  isAd: boolean;
}

const FALLBACK_SLIDES: BannerSlide[] = [
  {
    id: 'fallback-1',
    imageSrc: '/dashboard/banner1.svg',
    imageAlt: 'Trendupp influencer marketing platform',
    linkUrl: null,
    isAd: false,
  },
  {
    id: 'fallback-2',
    imageSrc: '/dashboard/b2.webp',
    imageAlt: 'Connect with top creators',
    linkUrl: null,
    isAd: false,
  },
  {
    id: 'fallback-3',
    imageSrc: '/dashboard/b3.webp',
    imageAlt: 'Launch your next campaign',
    linkUrl: null,
    isAd: false,
  },
];

export default function BrandBannerCarousel() {
  const { data: ads } = useAds(PLACEMENT);
  const recordImpression = useRecordAdImpression();
  const recordClick = useRecordAdClick();

  const slides: BannerSlide[] =
    ads && ads.length > 0
      ? ads.map((ad) => ({
          id: ad.id,
          imageSrc: ad.adImageUrl,
          imageAlt: ad.title,
          linkUrl: ad.linkUrl,
          isAd: true,
        }))
      : FALLBACK_SLIDES;

  const [currentIndex, setCurrentIndex] = useState(0);
  // Clamp in case the slide count shrinks (e.g. ads finish loading with fewer slides) —
  // derived during render instead of synced back with an effect.
  const safeCurrentIndex = currentIndex < slides.length ? currentIndex : 0;

  const current = slides[safeCurrentIndex];

  useEffect(() => {
    if (current?.isAd) recordImpression.mutate(current.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id]);

  function goTo(index: number) {
    setCurrentIndex((index + slides.length) % slides.length);
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
    <div className="relative w-full overflow-hidden rounded-2xl h-48 bg-[#1a1a2e] group">
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          onClick={i === safeCurrentIndex ? handleSlideClick : undefined}
          className={cn(
            'absolute inset-0 transition-opacity duration-700',
            i === safeCurrentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none',
            slide.isAd && 'cursor-pointer',
          )}
        >
          <Image
            src={slide.imageSrc}
            alt={slide.imageAlt}
            fill
            className="object-cover"
            priority={i === 0}
          />
        </div>
      ))}

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(safeCurrentIndex - 1)}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            <ChevronLeft size={18} className="text-white" />
          </button>
          <button
            type="button"
            onClick={() => goTo(safeCurrentIndex + 1)}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            <ChevronRight size={18} className="text-white" />
          </button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              onClick={() => goTo(i)}
              className={cn(
                'rounded-full transition-all duration-300',
                i === safeCurrentIndex ? 'w-4 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40',
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
