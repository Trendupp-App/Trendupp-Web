'use client';

import { Globe } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useExternalLinks } from '@/hooks/useSettings';
import { resolveExternalLinks } from '@/lib/platformLinks';

function InstagramGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TwitterGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.261 5.636 5.903-5.636Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedinGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.446-2.136 2.94v5.666H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.114 20.452H3.558V9h3.556z" />
    </svg>
  );
}

function YoutubeGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
      <rect x="2" y="5" width="20" height="14" rx="4" fill="currentColor" />
      <polygon points="10,8 10,16 17,12" fill="white" />
    </svg>
  );
}

interface ConnectWithUsSectionProps {
  enabled?: boolean;
}

export default function ConnectWithUsSection({ enabled = true }: ConnectWithUsSectionProps) {
  const { data, isLoading } = useExternalLinks(enabled);
  const links = resolveExternalLinks(data);

  const items = [
    {
      key: 'website',
      label: 'Website',
      href: links.website,
      icon: <Globe size={15} />,
      color: 'bg-slate-50 text-slate-600',
    },
    {
      key: 'instagram',
      label: 'Instagram',
      href: links.instagram,
      icon: <InstagramGlyph />,
      color: 'bg-pink-50 text-pink-600',
    },
    {
      key: 'twitter',
      label: 'X (Twitter)',
      href: links.twitter,
      icon: <TwitterGlyph />,
      color: 'bg-slate-100 text-slate-900',
    },
    {
      key: 'linkedin',
      label: 'LinkedIn',
      href: links.linkedin,
      icon: <LinkedinGlyph />,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      key: 'youtube',
      label: 'YouTube',
      href: links.youtube,
      icon: <YoutubeGlyph />,
      color: 'bg-red-50 text-red-600',
    },
  ].filter((item) => item.href);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold text-[#9a99b0] uppercase tracking-wider">
          Connect with us
        </p>
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[72px] w-[72px] rounded-xl shrink-0" />
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold text-[#9a99b0] uppercase tracking-wider">
        Connect with us
      </p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <a
            key={item.key}
            href={item.href!}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1.5 border border-[#e8e6f0] rounded-xl px-3 py-2.5 hover:border-brand-pink/30 hover:bg-[#faf9fc] transition-colors"
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}
            >
              {item.icon}
            </div>
            <span className="text-[10px] font-medium text-[#1a1a2e] whitespace-nowrap">
              {item.label}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
