export type CreatorTierName = 'Nano' | 'Micro' | 'Macro' | 'Mega';

export const CREATOR_TIER_ORDER: CreatorTierName[] = ['Nano', 'Micro', 'Macro', 'Mega'];

/**
 * Cosmetic labeling only — follower thresholds and campaign costs come from
 * the real `/campaigns/creator-categories` API (see useCreatorCategories).
 * There's no backend field for a short marketing blurb per tier, so this
 * stays as flavor text.
 */
export const CREATOR_TIER_META: Record<
  CreatorTierName,
  { campaignNote: string; accentBg: string; accentText: string }
> = {
  Nano: { campaignNote: '', accentBg: 'bg-emerald-50', accentText: 'text-emerald-500' },
  Micro: {
    campaignNote: 'Conversions',
    accentBg: 'bg-brand-pink-light',
    accentText: 'text-brand-pink',
  },
  Macro: {
    campaignNote: 'National Visibility',
    accentBg: 'bg-blue-50',
    accentText: 'text-blue-500',
  },
  Mega: { campaignNote: 'Mass Awareness', accentBg: 'bg-amber-50', accentText: 'text-amber-500' },
};

export function parseTierName(assignedTier: string | null | undefined): CreatorTierName {
  const stripped = (assignedTier ?? '').replace(/\s*Creator$/i, '').trim();
  const match = CREATOR_TIER_ORDER.find((t) => t.toLowerCase() === stripped.toLowerCase());
  return match ?? 'Nano';
}

// Looks up how many tokens a creator earns for Social Impact participation,
// based on their own assigned tier — not the campaign, since a creator's
// reward is a function of their tier, not the brand's campaign.
export function getRewardTokensForTier(
  categories: { name: string; rewardTokens: number }[],
  assignedTier: string | null | undefined,
): number {
  const tierName = parseTierName(assignedTier);
  return categories.find((c) => c.name.toLowerCase() === tierName.toLowerCase())?.rewardTokens ?? 0;
}

export function formatFollowerCount(n: number): string {
  if (n >= 1_000_000) {
    const v = n / 1_000_000;
    return `${Number.isInteger(v) ? v.toFixed(0) : v.toFixed(1)}M`;
  }
  if (n >= 1_000) {
    const v = n / 1_000;
    return `${Number.isInteger(v) ? v.toFixed(0) : v.toFixed(1)}K`;
  }
  return `${n}`;
}

export function formatFollowerRange(rule: {
  minFollowers: number;
  maxFollowers: number | null;
}): string {
  const min = formatFollowerCount(rule.minFollowers);
  if (rule.maxFollowers === null) return `${min}+`;
  return `${min} – ${formatFollowerCount(rule.maxFollowers)}`;
}

export function formatNaira(n: number): string {
  return `₦${n.toLocaleString('en-US')}`;
}
