'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useSocialConnections } from '@/hooks/useSocials';
import { useCreatorCategories } from '@/hooks/useCampaign';
import { formatFollowerCount, formatFollowerRange, parseTierName } from '@/constants/creatorTiers';

export default function CreatorTierCard() {
  const user = useAuthStore((s) => s.user);
  const { data: socialConnections } = useSocialConnections();
  const { data: creatorCategories, isLoading: categoriesLoading } = useCreatorCategories();

  const totalFollowers = (socialConnections ?? [])
    .filter((c) => c.connected)
    .reduce((sum, c) => sum + c.followerCount, 0);

  if (categoriesLoading || !creatorCategories || creatorCategories.length === 0) {
    return (
      <div className="rounded-3xl bg-[#e8e6f0]/60 p-5 md:p-6 flex flex-col gap-4 animate-pulse">
        <div className="h-5 w-32 rounded bg-white/60" />
        <div className="h-1.5 w-full rounded-full bg-white/60" />
        <div className="h-3 w-40 rounded bg-white/50" />
      </div>
    );
  }

  const sortedTiers = [...creatorCategories].sort((a, b) => a.minFollowers - b.minFollowers);
  const tierName = parseTierName(user?.assignedTier);
  const tierIndex = Math.max(
    0,
    sortedTiers.findIndex((t) => t.name.toLowerCase() === tierName.toLowerCase()),
  );
  const currentTier = sortedTiers[tierIndex];
  const nextTier = sortedTiers[tierIndex + 1] ?? null;

  const followersToNext = nextTier ? Math.max(0, nextTier.minFollowers - totalFollowers) : 0;

  return (
    <Link
      href="/creator/profile/tier"
      id="creator-tier-card"
      className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-pink to-[#9c0f57] p-5 md:p-6 flex flex-col gap-4 shadow-lg cursor-pointer transition-transform active:scale-[0.99]"
    >
      <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/10 blur-[60px] pointer-events-none" />

      <div className="flex items-center justify-between z-10">
        <div className="flex flex-col gap-0.5">
          <span className="text-white text-lg font-bold tracking-tight">
            {currentTier.name} Creator
          </span>
          <span className="text-white/60 text-[11px] font-light">
            {formatFollowerRange(currentTier)} followers · Level {tierIndex + 1}/
            {sortedTiers.length}
          </span>
        </div>
        <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center shrink-0 group-hover:bg-white/25 transition-colors">
          <ChevronRight size={16} className="text-white" />
        </div>
      </div>

      <div className="flex items-center gap-1.5 z-10">
        {sortedTiers.map((tier, idx) => (
          <div
            key={tier.id}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              idx <= tierIndex ? 'bg-white' : 'bg-white/25'
            }`}
          />
        ))}
      </div>

      <span className="text-white/70 text-[11px] font-light z-10">
        {formatFollowerCount(totalFollowers)} followers
        {nextTier
          ? ` · ${formatFollowerCount(followersToNext)} more to next tier`
          : ' · Highest tier reached'}
      </span>
    </Link>
  );
}
