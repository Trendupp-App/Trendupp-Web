'use client';

import Link from 'next/link';
import { ArrowLeft, TrendingUp, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { useSocialConnections } from '@/hooks/useSocials';
import { useCreatorCategories } from '@/hooks/useCampaign';
import type { SocialPlatformId } from '@/services/socialsApi';
import type { CreatorCategory } from '@/types/campaign';
import {
  CREATOR_TIER_META,
  formatFollowerCount,
  formatFollowerRange,
  formatNaira,
  parseTierName,
  type CreatorTierName,
} from '@/constants/creatorTiers';
import CreatorTierSkeleton from '@/components/skeletons/CreatorTierSkeleton';

const DEFAULT_ACCENT = { campaignNote: '', accentBg: 'bg-[#f4f3f6]', accentText: 'text-[#9a99b0]' };

function tierMeta(name: string) {
  return CREATOR_TIER_META[name as CreatorTierName] ?? DEFAULT_ACCENT;
}

function PlatformIcon({ platform }: { platform: SocialPlatformId }) {
  if (platform === 'instagram') {
    return (
      <div
        className="w-9 h-9 rounded-xl overflow-hidden shrink-0 flex items-center justify-center"
        style={{
          background:
            'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
        }}
      >
        <svg viewBox="0 0 24 24" fill="white" className="w-4.5 h-4.5">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      </div>
    );
  }
  if (platform === 'tiktok') {
    return (
      <div className="w-9 h-9 rounded-xl bg-black shrink-0 flex items-center justify-center">
        <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.73a4.85 4.85 0 01-1.01-.04z" />
        </svg>
      </div>
    );
  }
  if (platform === 'youtube') {
    return (
      <div className="w-9 h-9 rounded-xl bg-[#FF0000] shrink-0 flex items-center justify-center">
        <svg viewBox="0 0 24 24" fill="white" className="w-4.5 h-4.5">
          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      </div>
    );
  }
  return (
    <div className="w-9 h-9 rounded-xl bg-[#1a1a2e] shrink-0 flex items-center justify-center">
      <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    </div>
  );
}

const PLATFORM_LABELS: Record<SocialPlatformId, string> = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  twitter: 'X (Twitter)',
};

export default function CreatorTierPage() {
  const user = useAuthStore((s) => s.user);
  const { data: socialConnections } = useSocialConnections();
  const { data: creatorCategories, isLoading: categoriesLoading } = useCreatorCategories();

  if (categoriesLoading || !creatorCategories || creatorCategories.length === 0) {
    return <CreatorTierSkeleton />;
  }

  const sortedTiers: CreatorCategory[] = [...creatorCategories].sort(
    (a, b) => a.minFollowers - b.minFollowers,
  );
  const tierName = parseTierName(user?.assignedTier);
  const tierIndex = Math.max(
    0,
    sortedTiers.findIndex((t) => t.name.toLowerCase() === tierName.toLowerCase()),
  );
  const currentTier = sortedTiers[tierIndex];
  const nextTier = sortedTiers[tierIndex + 1] ?? null;

  const connectedAccounts = (socialConnections ?? []).filter((c) => c.connected);
  const totalFollowers = connectedAccounts.reduce((sum, c) => sum + c.followerCount, 0);

  const progressPercent = nextTier
    ? Math.min(100, Math.round((totalFollowers / nextTier.minFollowers) * 100))
    : 100;

  return (
    <div className="flex flex-col gap-6 w-full pb-12 select-none px-4 md:px-8 py-6" id="tier-page">
      <Link
        href="/creator/profile"
        className="flex items-center gap-2 text-sm font-medium text-[#5a5a7a] hover:text-[#1a1a2e] transition-colors w-fit"
      >
        <ArrowLeft size={16} />
        Back
      </Link>

      {/* ── HERO TIER CARD ── */}
      <div
        className="relative overflow-hidden bg-gradient-to-br from-brand-pink to-[#9c0f57] rounded-[32px] p-6 md:p-10 flex flex-col items-center text-center gap-4 shadow-lg"
        id="tier-hero-card"
      >
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-white/10 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-white/10 blur-[80px] pointer-events-none" />

        <span className="z-10 flex items-center gap-1.5 bg-white/15 text-white text-xs font-semibold px-3.5 py-1.5 rounded-full">
          <TrendingUp size={13} />
          Your Current Tier
        </span>

        <h1 className="z-10 text-white text-3xl md:text-4xl font-bold tracking-tight">
          {currentTier.name} Creator
        </h1>

        <p className="z-10 text-white/60 text-sm font-light">
          Level {tierIndex + 1} of {sortedTiers.length} ·{' '}
          {sortedTiers.map((t) => t.name).join(' · ')}
        </p>

        {connectedAccounts.length > 0 && (
          <div className="z-10 flex flex-wrap items-center justify-center gap-2">
            {connectedAccounts.map((c) => (
              <span
                key={c.platform}
                className="flex items-center gap-1.5 bg-white rounded-full pl-1 pr-3 py-1"
              >
                <PlatformIcon platform={c.platform} />
                <span className="text-xs font-bold text-[#1a1a2e]">
                  {formatFollowerCount(c.followerCount)}
                </span>
              </span>
            ))}
          </div>
        )}

        {nextTier ? (
          <div className="z-10 w-full bg-white/10 rounded-2xl p-5 mt-2 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-white text-sm font-bold">Progress to {nextTier.name}</span>
              <span className="text-white text-sm font-bold">
                {totalFollowers.toLocaleString('en-US')} /{' '}
                {nextTier.minFollowers.toLocaleString('en-US')}
              </span>
            </div>
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-white/60 text-xs font-light text-left">
              Reach {nextTier.minFollowers.toLocaleString('en-US')} combined followers to unlock the{' '}
              {nextTier.name} tier.
            </p>
          </div>
        ) : (
          <div className="z-10 w-full bg-white/10 rounded-2xl p-5 mt-2">
            <p className="text-white text-sm font-bold">
              🎉 You&apos;ve reached the highest tier available!
            </p>
          </div>
        )}
      </div>

      {/* ── CONNECTED SOCIAL ACCOUNTS ── */}
      <div className="flex flex-col gap-3" id="tier-connected-accounts">
        <h3 className="text-sm font-bold text-[#1a1a2e]">Connected Social Accounts</h3>
        {connectedAccounts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {connectedAccounts.map((c) => (
              <div
                key={c.platform}
                className="bg-white border border-[#e8e6f0] rounded-2xl p-2 flex items-center gap-3"
              >
                <PlatformIcon platform={c.platform} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-[#1a1a2e]">{PLATFORM_LABELS[c.platform]}</p>
                  <p className="text-xs text-[#9a99b0] truncate">
                    {c.username ? `${c.username}` : '—'}
                  </p>
                  <span className="text-sm font-bold text-[#1a1a2e] shrink-0">
                    {formatFollowerCount(c.followerCount)}{' '}
                    <span className="text-[#9a99b0] font-normal">followers</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#9a99b0] px-1">No social accounts connected yet.</p>
        )}

        <div className="bg-brand-pink-light rounded-2xl px-5 py-4 flex items-center justify-between">
          <span className="text-sm font-bold text-brand-pink">Combined Total:</span>
          <span className="text-sm font-bold text-brand-pink">
            {totalFollowers.toLocaleString('en-US')} followers
          </span>
        </div>
      </div>

      {/* ── ALL TIERS ── */}
      <div className="flex flex-col gap-3" id="tier-all-tiers">
        <h3 className="text-sm font-bold text-[#1a1a2e]">All Tiers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedTiers.map((tier, idx) => {
            const status = idx < tierIndex ? 'unlocked' : idx === tierIndex ? 'current' : 'locked';
            const meta = tierMeta(tier.name);
            const isCurrent = status === 'current';

            return (
              <div
                key={tier.id}
                className={cn(
                  'rounded-3xl p-5 flex items-center justify-between gap-4',
                  isCurrent
                    ? 'bg-gradient-to-br from-brand-pink to-[#9c0f57] text-white shadow-lg'
                    : 'bg-white border border-[#e8e6f0]',
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                      isCurrent ? 'bg-white/15' : meta.accentBg,
                    )}
                  >
                    <TrendingUp size={18} className={isCurrent ? 'text-white' : meta.accentText} />
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">{tier.name}</span>
                      <span
                        className={cn(
                          'text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full',
                          isCurrent
                            ? 'bg-white/20 text-white'
                            : status === 'unlocked'
                              ? 'bg-emerald-50 text-emerald-600'
                              : 'bg-[#f4f3f6] text-[#9a99b0]',
                        )}
                      >
                        {status}
                      </span>
                    </div>
                    <span className={cn('text-xs', isCurrent ? 'text-white/70' : 'text-[#7a7a9a]')}>
                      {formatFollowerRange(tier)} combined
                    </span>
                    {meta.campaignNote && (
                      <span
                        className={cn('text-xs', isCurrent ? 'text-white/70' : 'text-[#7a7a9a]')}
                      >
                        {meta.campaignNote}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-0.5 shrink-0 text-right">
                  <span
                    className={cn(
                      'text-[10px] font-bold uppercase tracking-wider',
                      isCurrent ? 'text-white/70' : meta.accentText,
                    )}
                  >
                    Campaigns
                  </span>
                  <span className="text-xs font-bold">
                    Create {formatNaira(tier.minCostCreateNaira)}+
                  </span>
                  <span className="text-xs font-bold">
                    Amplify {formatNaira(tier.minCostAmplifyNaira)}+
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── NEED HELP ── */}
      <div
        className="bg-white border border-[#e8e6f0] rounded-3xl p-5 flex flex-col gap-3"
        id="tier-need-help"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-pink-light flex items-center justify-center shrink-0">
            <MessageSquare size={16} className="text-brand-pink" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-[#1a1a2e]">Need Help?</span>
            <span className="text-xs text-[#7a7a9a] font-light">
              If you believe your tier doesn&apos;t reflect your reach, let us know and we&apos;ll
              review it.
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => toast('Thanks — our team will review your tier shortly.')}
          className="w-fit px-4 py-2.5 border border-brand-pink text-brand-pink text-xs font-bold rounded-xl hover:bg-brand-pink-light transition-colors cursor-pointer"
        >
          Share Feedback →
        </button>
      </div>
    </div>
  );
}
