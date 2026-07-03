import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { campaignApi } from '@/services/campaignApi';
import type {
  CreateCampaignPayload,
  PatchCampaignPayload,
  PayCampaignPayload,
  PaymentBreakdown,
  ApplyCampaignPayload,
} from '@/types/campaign';

export function useCampaignPlatforms() {
  return useQuery({
    queryKey: ['campaign-platforms'],
    queryFn: () => campaignApi.getPlatforms().then((r) => r.data),
    staleTime: 1000 * 60 * 60,
  });
}

export function useCreatorCategories() {
  return useQuery({
    queryKey: ['creator-categories'],
    queryFn: () => campaignApi.getCreatorCategories().then((r) => r.data),
    staleTime: 1000 * 60 * 60,
  });
}

export function useCreateCampaign(onSuccess: (campaignId: string) => void) {
  return useMutation({
    mutationFn: (payload: CreateCampaignPayload) => campaignApi.createCampaign(payload),
    onSuccess: ({ data }) => {
      toast.success(data.message ?? 'Campaign draft created', { duration: 1200 });
      onSuccess(data.campaign.id);
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err?.response?.data?.message ?? 'Could not create campaign');
    },
  });
}

export function usePatchCampaign(onSuccess?: () => void) {
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: PatchCampaignPayload }) =>
      campaignApi.patchCampaign(id, payload),
    onSuccess: ({ data }) => {
      toast.success(data.message ?? 'Campaign updated', { duration: 900 });
      onSuccess?.();
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err?.response?.data?.message ?? 'Could not save campaign details');
    },
  });
}

export function useSubmitCampaign(onSuccess: (breakdown: PaymentBreakdown) => void) {
  return useMutation({
    mutationFn: (id: string) => campaignApi.submitCampaign(id),
    onSuccess: ({ data }) => {
      console.log('submit response:', JSON.stringify(data, null, 2));
      toast.success(data.message ?? 'Campaign submitted', { duration: 900 });
      const totalBudget = data.campaign.totalBudget;
      const trenduppFee = Math.round(totalBudget * 0.15 * 100) / 100;
      const vat = Math.round(totalBudget * 0.075 * 100) / 100;

      onSuccess({
        campaignBudget: totalBudget,
        trenduppFee,
        vat,
        totalToPay: data.payment.amount, // use the exact figure from the API
      });
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err?.response?.data?.message ?? 'Could not submit campaign');
    },
  });
}

export function usePayCampaign(onSuccess: (campaignTitle?: string) => void) {
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: PayCampaignPayload }) =>
      campaignApi.payCampaign(id, payload),
    onSuccess: ({ data }) => {
      toast.success('Payment confirmed! Campaign is now live 🎉', { duration: 1500 });
      onSuccess(data.campaign.title);
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err?.response?.data?.message ?? 'Payment failed, please try again');
    },
  });
}

export function useCampaign(id: string | null) {
  return useQuery({
    queryKey: ['campaign', id],
    queryFn: () => campaignApi.getCampaign(id!).then((r) => r.data),
    enabled: !!id,
    staleTime: 0,
  });
}

export function useMyCampaigns(
  status?: 'draft' | 'live' | 'active' | 'completed',
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: ['my-campaigns', status],
    queryFn: () => campaignApi.getMyCampaigns(status).then((r) => r.data),
    staleTime: 1000 * 30,
    enabled,
  });
}

export function useCampaigns(
  params?: {
    status?: 'draft' | 'live' | 'active' | 'completed' | 'submitted';
    sortBy?: 'newest' | 'highest_budget' | 'closing_soon';
    platforms?: string[];
    niches?: string[];
    nicheIds?: string[];
    goal?: string;
  },
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: ['campaigns', params],
    queryFn: () => campaignApi.getCampaigns(params).then((r) => r.data.data),
    staleTime: 1000 * 30,
    enabled,
  });
}

export function useApplyCampaign(onSuccess: () => void) {
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ApplyCampaignPayload }) =>
      campaignApi.applyCampaign(id, payload),
    onSuccess: ({ data }) => {
      toast.success(data.message ?? 'Application submitted successfully! 🚀', { duration: 1500 });
      onSuccess();
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err?.response?.data?.message ?? 'Could not submit application, please try again');
    },
  });
}
