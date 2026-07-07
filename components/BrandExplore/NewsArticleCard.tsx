import type { NewsArticle, NewsCategory } from '@/dummy/news';
import { cn } from '@/lib/utils';

const CATEGORY_STYLES: Record<NewsCategory, string> = {
  industry: 'bg-red-50 text-red-600',
  platform_update: 'bg-amber-50 text-amber-700',
  brands: 'bg-[#eef0ff] text-[#4f46e5]',
};

const CATEGORY_LABELS: Record<NewsCategory, string> = {
  industry: 'Industry',
  platform_update: 'Platform update',
  brands: 'Brands',
};

export default function NewsArticleCard({ article }: { article: NewsArticle }) {
  return (
    <div className="bg-white border border-[#e8e6f0] rounded-2xl overflow-hidden flex flex-col">
      <div className="relative aspect-[16/10] bg-zinc-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
        <span className="absolute bottom-3 right-3 text-[10px] font-medium text-white bg-black/50 px-2.5 py-1 rounded-full">
          {article.readTime}
        </span>
      </div>
      <div className="p-4 flex flex-col gap-2">
        <p className="text-sm font-bold text-[#1a1a2e] leading-snug">{article.title}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#5a5a7a]">
            <span className="text-brand-pink font-semibold">{article.sourceName}</span>
            {' · '}
            {article.timeAgo}
          </span>
          <span
            className={cn(
              'text-[10px] font-medium px-2.5 py-1 rounded-full shrink-0',
              CATEGORY_STYLES[article.category],
            )}
          >
            {CATEGORY_LABELS[article.category]}
          </span>
        </div>
      </div>
    </div>
  );
}
