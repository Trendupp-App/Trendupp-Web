import apiClient from '@/lib/apiClient';
import type {
  GetPayoutDashboardParams,
  PayoutDashboardResponse,
  BrandPayoutDashboardResponse,
} from '@/types/payout';

export const payoutApi = {
  getCreatorPayoutDashboard: (params?: GetPayoutDashboardParams) =>
    apiClient.get<PayoutDashboardResponse>('/transactions/payouts', { params }),

  getBrandPayoutDashboard: (params?: GetPayoutDashboardParams) =>
    apiClient.get<BrandPayoutDashboardResponse>('/transactions/manage-payments', { params }),
};
