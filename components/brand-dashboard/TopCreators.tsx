'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Users, TrendingUp, BarChart2 } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

type CreatorTier = 'Nano' | 'Micro' | 'Macro' | 'Mega';

interface TopCreator {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string;
  tier: CreatorTier;
  niche: string;
  followers: string;
  reach: string;
  engagement: string;
}

const TIER_STYLES: Record<CreatorTier, string> = {
  Nano: 'text-pink-500 border-pink-300',
  Micro: 'text-purple-500 border-purple-300',
  Macro: 'text-blue-500 border-blue-300',
  Mega: 'text-amber-500 border-amber-300',
};

const DUMMY_CREATORS: TopCreator[] = [
  {
    id: '1',
    name: 'Tolu Fashola',
    username: '@tolufolachamp',
    tier: 'Mega',
    niche: 'Lifestyle',
    followers: '284K',
    reach: '1.2M',
    engagement: '8.4%',
    avatarUrl: '/dashboard/avatar1.jpg',
  },
  {
    id: '2',
    name: 'Adaeze Obi',
    username: '@adaezeCreates',
    tier: 'Micro',
    niche: 'Entertainment',
    followers: '67K',
    reach: '520K',
    engagement: '5.2%',
    avatarUrl: '/dashboard/avatar1.jpg',
  },
  {
    id: '3',
    name: 'Tolu Fashola',
    username: '@adaezeCreates',
    tier: 'Nano',
    niche: 'Lifestyle',
    followers: '284K',
    reach: '1.2M',
    engagement: '8.4%',
    avatarUrl: '/dashboard/avatar1.jpg',
  },
];

interface CreatorCardProps {
  creator: TopCreator;
}

function CreatorCard({ creator }: CreatorCardProps) {
  return (
    <div className="flex-1 min-w-[200px] bg-white border border-[#f0eef8] rounded-2xl p-4 flex flex-col gap-3 shadow-sm">
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-full bg-[#f0eef8] overflow-hidden shrink-0">
          {creator.avatarUrl ? (
            <Image
              src={creator.avatarUrl}
              alt={creator.name}
              width={40}
              height={40}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm font-semibold text-[#7a7a9a]">
              {creator.name[0]}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#1a1a2e] truncate">{creator.name}</p>
          <p className="text-[11px] text-[#9a99b0] truncate">{creator.username}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span
          className={cn(
            'text-[11px] font-semibold px-2 py-0.5 rounded-full border',
            TIER_STYLES[creator.tier],
          )}
        >
          {creator.tier}
        </span>
        <span className="text-[11px] text-[#9a99b0]">{creator.niche}</span>
      </div>

      <div className="flex flex-col gap-1.5 pt-1 border-t border-[#f5f4fb]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-[#9a99b0]">
            <Users size={11} />
            Followers
          </div>
          <span className="text-[11px] font-semibold text-[#1a1a2e]">{creator.followers}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-[#9a99b0]">
            <TrendingUp size={11} />
            Reach
          </div>
          <span className="text-[11px] font-semibold text-[#1a1a2e]">{creator.reach}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-[#9a99b0]">
            <BarChart2 size={11} />
            Engagement
          </div>
          <span className="text-[11px] font-semibold text-[#1a1a2e]">{creator.engagement}</span>
        </div>
      </div>
    </div>
  );
}

interface TopCreatorsCarouselProps {
  creators?: TopCreator[];
}

export default function TopCreatorsSection({
  creators = DUMMY_CREATORS,
}: TopCreatorsCarouselProps) {
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

      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
        {visible.map((c) => (
          <CreatorCard key={c.id} creator={c} />
        ))}
      </div>

      {/* Dots */}
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
    </div>
  );
}
