import { useCampaignsInfinite } from '@/hooks/useCampaign';
import {
  mapCampaign,
  filterCampaigns,
  sortCampaigns,
  type DisplayCurrencyOptions,
} from '@/lib/campaignMappers';
import type { FilterState } from '@/components/creator-dashboard/CampaignFilterModal';

type CampaignStatusFilter = 'all' | 'live' | 'past';

const CAMPAIGNS_PAGE_SIZE = 12;

export function useExploreCampaigns({
  statusFilter,
  searchQuery,
  filters,
  displayOpts,
  enabled = true,
}: {
  statusFilter: CampaignStatusFilter;
  searchQuery: string;
  filters: FilterState;
  displayOpts?: DisplayCurrencyOptions;
  enabled?: boolean;
}) {
  const {
    campaigns: liveCampaigns,
    total,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useCampaignsInfinite(
    {
      status: statusFilter === 'all' ? 'all' : statusFilter === 'live' ? 'live' : 'completed',
      sortBy:
        filters.sortBy === 'Newest'
          ? 'newest'
          : filters.sortBy === 'Highest Budget'
            ? 'highest_budget'
            : 'closing_soon',
      platforms: filters.platforms.length > 0 ? filters.platforms : undefined,
      niches: filters.niches.length > 0 ? filters.niches : undefined,
      goal: filters.campaignGoal || undefined,
      limit: CAMPAIGNS_PAGE_SIZE,
    },
    enabled,
  );

  const mapped = liveCampaigns.map((c) => mapCampaign(c, displayOpts));
  const filtered = filterCampaigns(mapped, { searchQuery, statusFilter, filters });
  const sorted = sortCampaigns(filtered, filters.sortBy);

  return {
    campaigns: sorted,
    total,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  };
}
