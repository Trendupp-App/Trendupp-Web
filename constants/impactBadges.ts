export type ImpactBadgeName = 'Impact Advocate' | 'Impact Leader' | 'Impact Champion';

/**
 * Token thresholds a creator's `totalTokens` must clear to earn each badge,
 * checked highest first. The backend is the source of truth (`user.badge`) —
 * this is only a client-side fallback for when that field is absent.
 * Tokens expire 12 months after being earned and are deducted from the total.
 */
export const IMPACT_BADGE_THRESHOLDS: { min: number; name: ImpactBadgeName }[] = [
  { min: 1000, name: 'Impact Champion' },
  { min: 100, name: 'Impact Leader' },
  { min: 10, name: 'Impact Advocate' },
];

export const IMPACT_BADGE_META: Record<
  ImpactBadgeName,
  { icon: string; bg: string; text: string; border: string }
> = {
  'Impact Advocate': {
    icon: '/ia.svg',
    bg: 'bg-[#fcecf3]',
    text: 'text-[#d7176f]',
    border: 'border-[#d7176f]/25',
  },
  'Impact Leader': {
    icon: '/il.svg',
    bg: 'bg-[#f3f2fe]',
    text: 'text-[#574aff]',
    border: 'border-[#574aff]/25',
  },
  'Impact Champion': {
    icon: '/ic.svg',
    bg: 'bg-[#fff8e1]',
    text: 'text-[#b8860b]',
    border: 'border-[#fcc40d]/40',
  },
};

// Lowest tier first — mirrors IMPACT_BADGE_THRESHOLDS, which is ordered highest first.
export const IMPACT_BADGE_ORDER: ImpactBadgeName[] = [
  'Impact Advocate',
  'Impact Leader',
  'Impact Champion',
];

export const IMPACT_BADGE_TOKEN_REQUIREMENT: Record<ImpactBadgeName, number> = {
  'Impact Advocate': 10,
  'Impact Leader': 100,
  'Impact Champion': 1000,
};

export function isImpactBadgeName(value: string | null | undefined): value is ImpactBadgeName {
  return !!value && value in IMPACT_BADGE_META;
}

export function getImpactBadgeNameForTokens(
  totalTokens: number | null | undefined,
): ImpactBadgeName | null {
  const tokens = totalTokens ?? 0;
  return IMPACT_BADGE_THRESHOLDS.find((t) => tokens >= t.min)?.name ?? null;
}

export interface ImpactBadgeProgress {
  currentBadge: ImpactBadgeName | null;
  currentLevel: number;
  nextBadge: ImpactBadgeName | null;
  nextGoal: number | null;
  tokensToNext: number;
  progressPct: number;
}

// Progress toward the next tier, given the creator's current (post-expiry) token total.
export function getImpactBadgeProgress(
  totalTokens: number | null | undefined,
): ImpactBadgeProgress {
  const tokens = totalTokens ?? 0;
  const currentBadge = getImpactBadgeNameForTokens(tokens);
  const currentIndex = currentBadge ? IMPACT_BADGE_ORDER.indexOf(currentBadge) : -1;
  const nextBadge = IMPACT_BADGE_ORDER[currentIndex + 1] ?? null;
  const nextGoal = nextBadge ? IMPACT_BADGE_TOKEN_REQUIREMENT[nextBadge] : null;

  return {
    currentBadge,
    currentLevel: currentIndex + 1,
    nextBadge,
    nextGoal,
    tokensToNext: nextGoal ? Math.max(0, nextGoal - tokens) : 0,
    progressPct: nextGoal ? Math.min(100, Math.round((tokens / nextGoal) * 100)) : 100,
  };
}
