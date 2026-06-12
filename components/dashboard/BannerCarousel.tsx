'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface BannerCarouselProps {
  onBrowseClick?: () => void;
}

export default function BannerCarousel({ onBrowseClick }: BannerCarouselProps) {
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <div className="bg-gradient-to-br from-[#d7176f] via-[#c20d5f] to-[#990a4d] rounded-[24px] p-6 text-white flex flex-col justify-between h-[200px] relative overflow-hidden hover:shadow-[0_8px_30px_rgba(215,23,111,0.12)] transition-all duration-300">
      {/* Decorative overlapping background circles to give premium glassmorphic/abstract look */}
      <div className="absolute right-[-20px] top-[-20px] w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute right-[40px] bottom-[-45px] w-32 h-32 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute right-[-10px] bottom-[-20px] w-24 h-24 rounded-full bg-white/5 pointer-events-none" />

      <div className="z-10 flex flex-col gap-1.5">
        {/* Category tag */}
        <span className="text-[11px] font-semibold tracking-widest text-[#ffd3e6] uppercase">
          Brand Campaigns
        </span>
        {/* Title */}
        <h3 className="text-[22px] sm:text-[24px] font-bold leading-[1.25] max-w-[420px]">
          Find brands campaigns that match your niche
        </h3>
      </div>

      <div className="z-10 mt-4 flex items-center justify-between">
        {/* Browse Button */}
        <Button
          onClick={onBrowseClick}
          className="bg-white hover:bg-white/95 text-[#bf125d] font-semibold text-sm py-2.5 px-6 rounded-xl h-11 shadow-none border-none active:scale-[0.98] transition-transform"
        >
          Browse campaigns
        </Button>
      </div>

      {/* Carousel indicators - absolute centered at the bottom */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <button
            key={i}
            onClick={() => setActiveSlide(i)}
            className={`transition-all duration-300 rounded-full ${
              i === activeSlide ? 'w-5 h-2 bg-white' : 'w-2 h-2 bg-white/40'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
