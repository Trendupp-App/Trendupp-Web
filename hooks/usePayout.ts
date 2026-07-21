import { useQuery } from '@tanstack/react-query';
import { payoutApi } from '@/services/payoutApi';
import type { GetPayoutDashboardParams } from '@/types/payout';

export function usePayoutDashboard(params?: GetPayoutDashboardParams) {
  return useQuery({
    queryKey: ['payout-dashboard', params],
    queryFn: () => payoutApi.getCreatorPayoutDashboard(params).then((r) => r.data),
    staleTime: 1000 * 30,
  });
}

export function useBrandPayoutDashboard(params?: GetPayoutDashboardParams) {
  return useQuery({
    queryKey: ['brand-payout-dashboard', params],
    queryFn: () => payoutApi.getBrandPayoutDashboard(params).then((r) => r.data),
    staleTime: 1000 * 30,
  });
}
