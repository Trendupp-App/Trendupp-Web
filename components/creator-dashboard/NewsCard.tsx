'use client';

import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NewsCardProps {
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  image: string;
}

export default function NewsCard({ title, excerpt, category, publishedAt, image }: NewsCardProps) {
  const categoryStyles: Record<string, string> = {
    Tips: 'bg-emerald-50 text-emerald-600',
    Platform: 'bg-purple-50 text-purple-600',
    Updates: 'bg-blue-50 text-blue-600',
  };

  return (
    <div className="group bg-white border border-[#e8e6f0]/40 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row h-full md:h-48 select-none">
      {/* Left section: Thumbnail Image with zoom effect */}
      <div className="relative w-full md:w-48 h-40 md:h-full overflow-hidden shrink-0">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 192px"
        />
      </div>

      {/* Right section: Details */}
      <div className="p-5 flex flex-col justify-between flex-1 min-w-0">
        <div className="flex flex-col gap-2.5">
          {/* Category & Time */}
          <div className="flex items-center justify-between">
            <span
              className={cn(
                'text-[10px] font-semibold px-2.5 py-0.5 rounded-full leading-none shrink-0',
                categoryStyles[category] || 'bg-zinc-100 text-zinc-600',
              )}
            >
              {category}
            </span>
            <span className="text-[11px] text-[#9a99b0] font-light">{publishedAt}</span>
          </div>

          {/* Title */}
          <h4 className="text-sm font-bold text-[#1a1a2e] leading-snug line-clamp-2 group-hover:text-brand-pink transition-colors">
            {title}
          </h4>

          {/* Excerpt */}
          <p className="text-xs text-[#7a7a9a] font-light leading-relaxed line-clamp-2">
            {excerpt}
          </p>
        </div>

        {/* Action link */}
        <div className="flex items-center gap-1 text-[11px] font-bold text-brand-pink mt-3 cursor-pointer select-none shrink-0 w-fit">
          <span>Read article</span>
          <ArrowUpRight
            size={13}
            className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
          />
        </div>
      </div>
    </div>
  );
}
