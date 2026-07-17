'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface BannerSlide {
  id: string;
  imageSrc: string;
  imageAlt: string;
}

const BANNER_SLIDES: BannerSlide[] = [
  {
    id: '1',
    imageSrc: '/dashboard/banner1.svg',
    imageAlt: 'Trendupp influencer marketing platform',
  },
  { id: '2', imageSrc: '/dashboard/b2.webp', imageAlt: 'Connect with top creators' },
  { id: '3', imageSrc: '/dashboard/b3.webp', imageAlt: 'Launch your next campaign' },
];

interface BrandBannerCarouselProps {
  slides?: BannerSlide[];
  autoPlayInterval?: number;
}

export default function BrandBannerCarousel({
  slides = BANNER_SLIDES,
  autoPlayInterval = 3000,
}: BrandBannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [slides.length, autoPlayInterval]);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl h-48 bg-[#1a1a2e]">
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={cn(
            'absolute inset-0 transition-opacity duration-700',
            i === currentIndex ? 'opacity-100' : 'opacity-0',
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

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={cn(
              'rounded-full transition-all duration-300',
              i === currentIndex ? 'w-4 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40',
            )}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
