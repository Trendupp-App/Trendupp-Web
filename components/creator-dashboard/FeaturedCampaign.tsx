'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface FeaturedCampaignProps {
  campaigns?: Array<{
    title: string;
    brand: string;
    budget: string;
    badge: string;
    image: string;
  }>;
}

const DEFAULT_CAMPAIGNS = [
  {
    title: 'Summer Style Collection',
    brand: 'Zara Africa',
    budget: '₦150K–₦300K',
    badge: 'Trendupp CSR',
    image:
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Autumn Footwear Launch',
    brand: 'Zara Africa',
    budget: '₦200K–₦400K',
    badge: 'Zara Exclusive',
    image:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Spring Accessories Showcase',
    brand: 'Zara Africa',
    budget: '₦120K–₦250K',
    badge: 'Trendupp CSR',
    image:
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
  },
];

export default function FeaturedCampaign({ campaigns = DEFAULT_CAMPAIGNS }: FeaturedCampaignProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const activeCampaign = campaigns[currentIndex] || DEFAULT_CAMPAIGNS[0];

  return (
    <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-4 flex flex-col hover:shadow-[0_8px_30px_rgba(4,0,57,0.04)] transition-all duration-300 h-full">
      {/* Image Container */}
      <div className="relative w-full h-[180px] rounded-2xl overflow-hidden bg-zinc-100 shrink-0">
        <Image
          src={activeCampaign.image}
          alt={activeCampaign.title}
          fill
          className="object-cover transition-all duration-500 hover:scale-105"
          sizes="(max-w-780px) 100vw, 400px"
        />

        {/* Top-Right Badge */}
        <span className="absolute top-3 right-3 text-[10px] font-medium text-white bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
          {activeCampaign.badge}
        </span>
      </div>

      {/* Content area */}
      <div className="flex flex-col flex-1 justify-between mt-4">
        <div>
          {/* Title and Budget */}
          <div className="flex justify-between items-start gap-4">
            <h4 className="text-base font-bold text-[#1a1a2e] leading-tight">
              {activeCampaign.title}
            </h4>
            <span className="text-sm font-bold text-brand-pink shrink-0">
              {activeCampaign.budget}
            </span>
          </div>

          {/* Brand */}
          <p className="text-xs text-[#7a7a9a] font-light mt-1">{activeCampaign.brand}</p>
        </div>

        {/* Carousel indicator dots */}
        <div className="flex items-center gap-1.5 mt-4 self-center sm:self-start">
          {campaigns.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                i === currentIndex ? 'w-5 bg-brand-pink' : 'w-2 bg-[#e8e6f0]',
              )}
              aria-label={`Go to featured slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
