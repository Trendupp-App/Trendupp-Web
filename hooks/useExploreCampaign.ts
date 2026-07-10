import { useCampaigns } from '@/hooks/useCampaign';
import { mapCampaign, filterCampaigns, sortCampaigns } from '@/lib/campaignMappers';
import type { FilterState } from '@/components/creator-dashboard/CampaignFilterModal';

type CampaignStatusFilter = 'all' | 'live' | 'past' | 'social impact';

export function useExploreCampaigns({
  statusFilter,
  searchQuery,
  filters,
}: {
  statusFilter: CampaignStatusFilter;
  searchQuery: string;
  filters: FilterState;
}) {
  const { data: liveCampaigns = [], isLoading } = useCampaigns({
    status: statusFilter === 'all' ? undefined : statusFilter === 'live' ? 'live' : 'completed',
    sortBy:
      filters.sortBy === 'Newest'
        ? 'newest'
        : filters.sortBy === 'Highest Budget'
          ? 'highest_budget'
          : 'closing_soon',
    platforms: filters.platforms.length > 0 ? filters.platforms : undefined,
    niches: filters.niches.length > 0 ? filters.niches : undefined,
    goal: filters.campaignGoal || undefined,
  });

  const mapped = liveCampaigns.map(mapCampaign);
  const filtered = filterCampaigns(mapped, { searchQuery, statusFilter, filters });
  const sorted = sortCampaigns(filtered, filters.sortBy);

  return { campaigns: sorted, allMapped: mapped, isLoading };
}
