'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface NewsArticle {
  id: string;
  title: string;
  source: string;
  timeAgo: string;
  imageSrc?: string;
  category: string;
  href?: string;
}

const DUMMY_NEWS: NewsArticle[] = [
  {
    id: '1',
    title: 'TikTok Nigeria launches creator fund — ₦500M available for Q3',
    source: 'Trendupp Africa',
    timeAgo: '2 hours ago',
    category: 'Industry',
    href: '/brand/news/tiktok-nigeria-creator-fund',
    imageSrc: '/dashboard/img2.jpg',
  },
  {
    id: '2',
    title: 'Meta unveils new creator monetisation tools for African markets',
    source: 'Trendupp Africa',
    timeAgo: '5 hours ago',
    category: 'Platform',
    href: '/brand/news/meta-creator-tools',
    imageSrc: '/dashboard/img2.jpg',
  },
  {
    id: '3',
    title: 'How micro-influencers are driving 3x ROI for Nigerian brands in 2025',
    source: 'Trendupp Africa',
    timeAgo: '1 day ago',
    category: 'Insight',
    href: '/brand/news/micro-influencer-roi',
    imageSrc: '/dashboard/img2.jpg',
  },
];

const CATEGORY_STYLES: Record<string, string> = {
  Industry: 'bg-brand-pink text-white',
  Platform: 'bg-purple-500 text-white',
  Insight: 'bg-blue-500 text-white',
};

interface NewsCardProps {
  article: NewsArticle;
}

function NewsCard({ article }: NewsCardProps) {
  const categoryClass = CATEGORY_STYLES[article.category] ?? 'bg-gray-500 text-white';

  return (
    <a
      href={article.href ?? '#'}
      className="block group"
      target={article.href?.startsWith('http') ? '_blank' : undefined}
      rel={article.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-[#1a1a2e] mb-3">
        {article.imageSrc && (
          <Image
            src={article.imageSrc}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
        <span
          className={cn(
            'absolute bottom-2.5 right-2.5 text-[11px] font-semibold px-2.5 py-1 rounded-full',
            categoryClass,
          )}
        >
          {article.category}
        </span>
      </div>

      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-[#1a1a2e] leading-snug group-hover:text-brand-pink transition-colors">
          {article.title}
        </p>
        <ExternalLink size={14} className="shrink-0 text-[#9a99b0] mt-0.5" />
      </div>

      <p className="text-xs text-brand-pink font-medium mt-1">
        {article.source}
        <span className="text-[#9a99b0] font-normal"> • {article.timeAgo}</span>
      </p>
    </a>
  );
}

interface TopNewsSectionProps {
  articles?: NewsArticle[];
}

export default function TopNewsSection({ articles = DUMMY_NEWS }: TopNewsSectionProps) {
  const [page, setPage] = useState(0);

  return (
    <div className="bg-white border border-[#f0eef8] rounded-2xl p-5 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-[#1a1a2e]">Top news</h2>
        <Link
          href="/brand/news"
          className="text-sm text-[#9a99b0] hover:text-brand-pink transition-colors"
        >
          See all
        </Link>
      </div>

      <NewsCard article={articles[page]} />

      {/* Dots */}
      <div className="flex justify-center gap-1.5">
        {articles.map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i)}
            className={cn(
              'rounded-full transition-all duration-300',
              i === page ? 'w-4 h-1.5 bg-brand-pink' : 'w-1.5 h-1.5 bg-[#e0ddef]',
            )}
            aria-label={`News item ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
