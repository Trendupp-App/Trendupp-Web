'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function BannerCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);

  // Auto scroll logic
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 3);
    }, 4500); // Scroll every 4.5 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col w-full select-none">
      {/* Slide Viewport Card */}
      <div className="w-full h-[256px] rounded-[24px] overflow-hidden relative shadow-sm hover:shadow-md transition-shadow duration-300">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              'absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out',
              activeSlide === i ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none',
            )}
          >
            <Image
              src="/dashboard/competed img.png"
              alt={`Creator Fashion Banner - Slide ${i + 1}`}
              fill
              priority={i === 0}
              className="object-cover"
              sizes="(max-w-1024px) 100vw, 500px"
            />
          </div>
        ))}
      </div>

      {/* Slide Indicators - OUTSIDE/UNDERNEATH the card for all slides */}
      <div className="flex justify-center items-center gap-2 mt-4">
        {[0, 1, 2].map((i) => (
          <button
            key={i}
            onClick={() => setActiveSlide(i)}
            className={cn(
              'rounded-full transition-all duration-300 cursor-pointer flex items-center justify-center',
              i === activeSlide
                ? 'w-3.5 h-3.5 border border-[#7c3aed] bg-transparent'
                : 'w-2 h-2 bg-[#d1d1d6]',
            )}
            aria-label={`Go to slide ${i + 1}`}
          >
            {i === activeSlide && <span className="w-1.5 h-1.5 bg-[#7c3aed] rounded-full" />}
          </button>
        ))}
      </div>
    </div>
  );
}
