'use client';

import { useState } from 'react';
import { Newspaper } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Fills its (relatively positioned) parent with the article cover.
 * The image is absolutely positioned so its intrinsic size can never stretch
 * the parent's aspect ratio, and a branded placeholder replaces missing or
 * broken images.
 */
export default function NewsCoverImage({
  src,
  alt,
  category,
  className,
}: {
  src?: string | null;
  alt: string;
  category?: string;
  className?: string;
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = !!src && failedSrc !== src;

  if (!showImage) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          'absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#fde7f1] via-[#f6f0ff] to-[#eef0ff]',
          className,
        )}
      >
        <div className="w-11 h-11 rounded-full bg-white/80 flex items-center justify-center shadow-sm">
          <Newspaper size={20} className="text-brand-pink" />
        </div>
        {category && (
          <span className="text-[11px] font-medium text-[#5a5a7a] uppercase tracking-wide">
            {category}
          </span>
        )}
      </div>
    );
  }

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailedSrc(src)}
      className={cn('absolute inset-0 w-full h-full object-cover', className)}
    />
  );
}
