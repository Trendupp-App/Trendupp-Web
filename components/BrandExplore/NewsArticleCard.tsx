import type { NewsArticle } from '@/types/news';
import { cn } from '@/lib/utils';
import { formatRelativeTime, estimateReadTime } from '@/utils/Utilities';

const FALLBACK_COVER_IMAGE =
  'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80';

function categoryStyles(category: string) {
  switch (category) {
    case 'Industry':
      return 'bg-red-50 text-red-600';
    case 'Platform Update':
      return 'bg-amber-50 text-amber-700';
    case 'Brands':
      return 'bg-[#eef0ff] text-[#4f46e5]';
    default:
      return 'bg-[#f4f3f6] text-[#5a5a7a]';
  }
}

export default function NewsArticleCard({
  article,
  onClick,
}: {
  article: NewsArticle;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="bg-white border border-[#e8e6f0] rounded-2xl overflow-hidden flex flex-col cursor-pointer hover:shadow-sm transition-shadow"
    >
      <div className="relative aspect-[16/10] bg-zinc-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={article.coverImage || FALLBACK_COVER_IMAGE}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <span className="absolute bottom-3 right-3 text-[10px] font-medium text-white bg-black/50 px-2.5 py-1 rounded-full">
          {estimateReadTime(article.content)}
        </span>
      </div>
      <div className="p-4 flex flex-col gap-2">
        <p className="text-sm font-bold text-[#1a1a2e] leading-snug">{article.title}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#5a5a7a]">
            <span className="text-brand-pink font-semibold">
              {article.author.firstName} {article.author.lastName}
            </span>
            {' · '}
            {formatRelativeTime(article.publishedAt ?? article.createdAt)}
          </span>
          <span
            className={cn(
              'text-[10px] font-medium px-2.5 py-1 rounded-full shrink-0',
              categoryStyles(article.category),
            )}
          >
            {article.category}
          </span>
        </div>
      </div>
    </div>
  );
}
