'use client';

import { useEffect, useRef } from 'react';

interface InfiniteScrollSentinelProps {
  onIntersect: () => void;
  enabled: boolean;
  isLoading?: boolean;
}

// A near-invisible marker placed at the bottom of a list — once it scrolls
// into view, it fires onIntersect() to load the next page. Kept generic so
// every infinite-scrolling list in the app shares one observer
// implementation instead of each hand-rolling its own scroll listener.
export default function InfiniteScrollSentinel({
  onIntersect,
  enabled,
  isLoading = false,
}: InfiniteScrollSentinelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const onIntersectRef = useRef(onIntersect);

  useEffect(() => {
    onIntersectRef.current = onIntersect;
  }, [onIntersect]);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onIntersectRef.current();
      },
      { rootMargin: '200px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled]);

  if (!enabled && !isLoading) return null;

  return (
    <div ref={ref} className="w-full py-6 flex items-center justify-center">
      {isLoading && (
        <div className="w-5 h-5 border-2 border-brand-pink border-t-transparent rounded-full animate-spin" />
      )}
    </div>
  );
}
