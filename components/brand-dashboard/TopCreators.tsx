'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Users, Star, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useTopPerformers } from '@/hooks/useProfile';
import type { TopPerformerCreator } from '@/types/creator';

type CreatorTier = 'Nano' | 'Micro' | 'Macro' | 'Mega';

const TIER_STYLES: Record<CreatorTier, string> = {
  Nano: 'text-pink-500 border-pink-300',
  Micro: 'text-purple-500 border-purple-300',
  Macro: 'text-blue-500 border-blue-300',
  Mega: 'text-amber-500 border-amber-300',
};

function fmtCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return `${n}`;
}

function tierStyleKey(assignedTier: string | null): CreatorTier | null {
  if (!assignedTier) return null;
  const stripped = assignedTier.replace(' Creator', '').trim();
  return (['Nano', 'Micro', 'Macro', 'Mega'] as const).includes(stripped as CreatorTier)
    ? (stripped as CreatorTier)
    : null;
}

function totalFollowers(c: TopPerformerCreator): number {
  return (
    (c.instagramFollowers ?? 0) +
    (c.twitterFollowers ?? 0) +
    (c.tiktokFollowers ?? 0) +
    (c.youtubeFollowers ?? 0)
  );
}

interface CreatorCardProps {
  creator: TopPerformerCreator;
}

function CreatorCard({ creator }: CreatorCardProps) {
  const name = `${creator.firstName} ${creator.lastName}`.trim() || creator.username || 'Creator';
  const initials = name.slice(0, 1).toUpperCase();
  const styleKey = tierStyleKey(creator.assignedTier);

  return (
    <div className="flex-1 min-w-[200px] bg-white border border-[#f0eef8] rounded-2xl p-4 flex flex-col gap-3 shadow-sm">
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-full bg-[#f0eef8] overflow-hidden shrink-0">
          {creator.avatarUrl ? (
            <Image
              src={creator.avatarUrl}
              alt={name}
              width={40}
              height={40}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm font-semibold text-[#7a7a9a]">
              {initials}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#1a1a2e] truncate">{name}</p>
          <p className="text-[11px] text-[#9a99b0] truncate">
            {creator.username ? `@${creator.username}` : '—'}
          </p>
        </div>
      </div>

      {creator.assignedTier && (
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'text-[11px] font-semibold px-2 py-0.5 rounded-full border',
              styleKey ? TIER_STYLES[styleKey] : 'text-[#9a99b0] border-[#e8e6f0]',
            )}
          >
            {creator.assignedTier}
          </span>
        </div>
      )}

      <div className="flex flex-col gap-1.5 pt-1 border-t border-[#f5f4fb]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-[#9a99b0]">
            <Users size={11} />
            Followers
          </div>
          <span className="text-[11px] font-semibold text-[#1a1a2e]">
            {fmtCount(totalFollowers(creator))}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-[#9a99b0]">
            <Star size={11} />
            Rating
          </div>
          <span className="text-[11px] font-semibold text-[#1a1a2e]">
            {creator.avgRating ? creator.avgRating.toFixed(1) : 'New'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-[#9a99b0]">
            <MessageSquare size={11} />
            Reviews
          </div>
          <span className="text-[11px] font-semibold text-[#1a1a2e]">{creator.totalReviews}</span>
        </div>
      </div>
    </div>
  );
}

export default function TopCreatorsSection() {
  const { data: creators = [], isLoading, isError } = useTopPerformers();
  const [page, setPage] = useState(0);
  const perPage = 3;
  const totalPages = Math.ceil(creators.length / perPage);
  const visible = creators.slice(page * perPage, page * perPage + perPage);

  return (
    <div className="bg-white border border-[#f0eef8] rounded-2xl p-5 shadow-sm flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold text-[#1a1a2e]">Top performing creators</h2>
          <p className="text-xs text-[#9a99b0] mt-0.5">
            Discover creators best matched to your brand niche
          </p>
        </div>
        <Link
          href="/brand/explore"
          className="text-sm text-[#9a99b0] hover:text-brand-pink transition-colors"
        >
          See all
        </Link>
      </div>

      {isLoading ? (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 min-w-[200px] h-[168px] bg-gray-50 border border-gray-100 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="py-8 text-center text-xs text-[#9a99b0]">
          Couldn&apos;t load top creators. Please try again.
        </div>
      ) : creators.length === 0 ? (
        <div className="py-8 text-center text-xs text-[#9a99b0]">No creators to show yet.</div>
      ) : (
        <>
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
            {visible.map((c) => (
              <CreatorCard key={c.id} creator={c} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-1.5 pt-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={cn(
                    'rounded-full transition-all duration-300',
                    i === page ? 'w-4 h-1.5 bg-brand-pink' : 'w-1.5 h-1.5 bg-[#e0ddef]',
                  )}
                  aria-label={`Page ${i + 1}`}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
