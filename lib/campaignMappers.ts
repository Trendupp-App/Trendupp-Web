import type { Campaign } from '@/types/campaign';
import type { FilterState } from '@/components/creator-dashboard/CampaignFilterModal';
import { formatCurrency } from '@/utils/Utilities';

export interface MappedExploreCampaign {
  id: string;
  title: string;
  brand: string;
  budget: string;
  budgetMin: number;
  budgetMax: number;
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
}

export function getDaysLeft(timelineDate: string): string {
  const ts = Date.parse(timelineDate);
  if (Number.isNaN(ts)) return 'Closed';
  const diffTime = ts - Date.now();
  if (diffTime <= 0) return 'Closed';
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays > 0) return `${diffDays}d left`;
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  return `${Math.max(0, diffHours)}h left`;
}

export function mapCampaign(c: Campaign): MappedExploreCampaign {
  const currency = c.currency ?? 'NGN';
  return {
    id: c.id,
    title: c.title,
    brand: c.brand?.username || 'Unknown Brand',
    budget: formatCurrency(c.totalBudget, currency),
    budgetMin: c.totalBudget,
    budgetMax: c.totalBudget,
    currency,
    daysLeft: getDaysLeft(c.timeline || ''),
    daysLeftNumber: (() => {
      const ts = Date.parse(c.timeline ?? '');
      return Number.isNaN(ts)
        ? 0
        : Math.max(0, Math.floor((ts - Date.now()) / (1000 * 60 * 60 * 24)));
    })(),
    tier: c.creatorCategory?.name || 'Nano',
    appliedCount: c.applicationsCount?.total || 0,
    image:
      c.coverImage ||
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    niches: c.creatorNiche?.name ? [c.creatorNiche.name] : [],
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
