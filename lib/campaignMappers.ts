import type { Campaign, CampaignTimeline, CreatorCategory } from '@/types/campaign';
import type { FilterState } from '@/components/creator-dashboard/CampaignFilterModal';
import { formatCurrency, convertUsdToNgn } from '@/utils/Utilities';
import { getCampaignDeadlineInfo } from '@/lib/campaignTimelineStage';
import { CREATOR_TIER_ORDER, parseTierName } from '@/constants/creatorTiers';

// Passed down from useDisplayCurrency() so a Nigerian creator sees Naira
// instead of a campaign's own currency, wherever that campaign's money is shown.
// creatorCategories/assignedTier are the applying creator's own tier context,
// used to bound the fee-request range (see getCampaignBudgetRange below).
export interface DisplayCurrencyOptions {
  displayInNgn?: boolean;
  usdToNgnRate?: number;
  creatorCategories?: CreatorCategory[];
  assignedTier?: string | null;
}

export interface MappedExploreCampaign {
  id: string;
  title: string;
  brand: string;
  budget: string;
  budgetMin: number;
  budgetMax: number;
  feeRangeLabel: string;
  feeRangeMin: number;
  feeRangeMax: number;
  hasApplied?: boolean;
  currency: string;
  daysLeft: string;
  daysLeftNumber: number;
  tier: string;
  appliedCount: number;
  image: string;
  niches: string[];
  platforms: string[];
  status: string;
  goal: 'Content Creation' | 'Amplification';
  createdAt?: string;
  campaignBrief: string;
  deliverables: string[];
  contentDirection: string[];
  contentGuidelines: { dos: string[]; donts: string[] };
  usageRights: string;
  successLooksLike: string;
  timeline?: CampaignTimeline;
}

// A creator's fee-request range is bounded by their own tier, not by
// whichever tiers the campaign happens to target: it spans that creator's
// own tier's min cost up to the *next* tier's min cost (e.g. a Nano creator
// sees [Nano min, Micro min]). The top tier has no tier above it, so its
// range collapses to a single value — its own min cost.
//
// Tiers already carry both a Naira and a USD minimum cost, so displaying a
// USD campaign's tier range in Naira for a Nigerian creator just means
// reading the Naira column — no live FX rate needed. The one case that does
// need a live rate is the no-tier-context fallback below, since totalBudget
// only exists in the campaign's own currency.
export function getCampaignBudgetRange(
  campaign: Campaign,
  displayOpts?: DisplayCurrencyOptions,
): {
  label: string;
  min: number;
  max: number;
} {
  const campaignCurrency = (campaign.currency ?? 'NGN').toUpperCase();
  const displayInNgn = !!displayOpts?.displayInNgn;
  const currency = displayInNgn ? 'NGN' : campaignCurrency;
  const isUsd = !displayInNgn && campaignCurrency === 'USD';
  const isAmplify = campaign.goal !== 'Create Content';

  const costFor = (tier: CreatorCategory) =>
    isAmplify
      ? isUsd
        ? tier.minCostAmplifyUsd
        : tier.minCostAmplifyNaira
      : isUsd
        ? tier.minCostCreateUsd
        : tier.minCostCreateNaira;

  const allTiers = displayOpts?.creatorCategories ?? [];
  const ownTierName = parseTierName(displayOpts?.assignedTier);
  const ownTier = allTiers.find((t) => t.name.toLowerCase() === ownTierName.toLowerCase());

  if (ownTier) {
    const nextTierName = CREATOR_TIER_ORDER[CREATOR_TIER_ORDER.indexOf(ownTierName) + 1];
    const nextTier = nextTierName
      ? allTiers.find((t) => t.name.toLowerCase() === nextTierName.toLowerCase())
      : undefined;

    const min = costFor(ownTier);
    const max = nextTier ? costFor(nextTier) : min;
    const label =
      min === max
        ? formatCurrency(min, currency)
        : `${formatCurrency(min, currency)} - ${formatCurrency(max, currency)}`;
    return { label, min, max };
  }

  // No tier context available (categories still loading, or no assigned
  // tier yet) — fall back to the campaign's own total budget.
  let budget = campaign.totalBudget;
  if (displayInNgn && campaignCurrency === 'USD' && displayOpts?.usdToNgnRate) {
    budget = convertUsdToNgn(budget, displayOpts.usdToNgnRate);
  }
  return { label: formatCurrency(budget, currency), min: budget, max: budget };
}

export function mapCampaign(
  c: Campaign,
  displayOpts?: DisplayCurrencyOptions,
): MappedExploreCampaign {
  const campaignCurrency = (c.currency ?? 'NGN').toUpperCase();
  const displayInNgn = !!displayOpts?.displayInNgn;
  const currency = displayInNgn ? 'NGN' : campaignCurrency;
  const deadline = getCampaignDeadlineInfo(c.timeline);
  const feeRange = getCampaignBudgetRange(c, displayOpts);

  let totalBudget = c.totalBudget;
  if (displayInNgn && campaignCurrency === 'USD' && displayOpts?.usdToNgnRate) {
    totalBudget = convertUsdToNgn(totalBudget, displayOpts.usdToNgnRate);
  }

  return {
    id: c.id,
    title: c.title,
    brand: c.brand?.username || 'Unknown Brand',
    budget: formatCurrency(totalBudget, currency),
    budgetMin: totalBudget,
    budgetMax: totalBudget,
    feeRangeLabel: feeRange.label,
    feeRangeMin: feeRange.min,
    feeRangeMax: feeRange.max,
    currency,
    daysLeft: deadline.label ?? 'Closed',
    daysLeftNumber: deadline.daysRemaining,
    tier: c.creatorCategory?.name || 'Nano',
    appliedCount: c.applicationsCount?.total || 0,
    image:
      c.coverImage ||
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    niches: c.creatorNiches?.map((n) => n.name) ?? [],
    platforms: c.preferredPlatforms?.map((p) => p.name) || [],
    status:
      c.status === 'active' || c.status === 'live'
        ? 'live'
        : c.status === 'completed'
          ? 'past'
          : c.status,
    goal: c.goal === 'Create Content' ? 'Content Creation' : 'Amplification',
    createdAt: c.createdAt,
    campaignBrief: c.campaignBrief || 'No brief provided.',
    deliverables: c.deliverables || [],
    contentDirection: c.contentDirection || [],
    contentGuidelines: c.contentGuidelines || { dos: [], donts: [] },
    usageRights: c.usageRights || '',
    successLooksLike: c.successLooksLike || '',
    timeline: c.timeline,
  };
}

export function filterCampaigns(
  campaigns: MappedExploreCampaign[],
  {
    searchQuery,
    statusFilter,
    filters,
  }: {
    searchQuery: string;
    statusFilter: 'all' | 'live' | 'past';
    filters: FilterState;
  },
): MappedExploreCampaign[] {
  return campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.brand.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (statusFilter === 'live' && campaign.status !== 'live') return false;
    if (statusFilter === 'past' && campaign.status !== 'past') return false;
    if (filters.platforms.length > 0) {
      const hasMatchingPlatform = campaign.platforms.some((p) => {
        const normalized = p === 'X (Twitter)' ? 'X' : p;
        return filters.platforms.includes(normalized);
      });
      if (!hasMatchingPlatform) return false;
    }

    if (filters.niches.length > 0) {
      const hasMatchingNiche = campaign.niches.some((n) => filters.niches.includes(n));
      if (!hasMatchingNiche) return false;
    }

    if (filters.campaignGoal && campaign.goal !== filters.campaignGoal) return false;

    return true;
  });
}

export function sortCampaigns(
  campaigns: MappedExploreCampaign[],
  sortBy: FilterState['sortBy'],
): MappedExploreCampaign[] {
  return [...campaigns].sort((a, b) => {
    if (sortBy === 'Newest') {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    }
    if (sortBy === 'Closing Soon') {
      return (a.daysLeftNumber ?? 999999) - (b.daysLeftNumber ?? 999999);
    }
    if (sortBy === 'Highest Budget') {
      return (b.budgetMax ?? 0) - (a.budgetMax ?? 0);
    }
    return 0;
  });
}
