import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  keepPreviousData,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { campaignApi } from '@/services/campaignApi';
import type {
  ApplyCampaignPayload,
  CampaignApplicationDto,
  CampaignStatus,
  CampaignStatusFilter,
  CreateCampaignPayload,
  PatchCampaignPayload,
  PaymentBreakdown,
  SubmitContentDraftPayload,
  SubmitLiveLinkPayload,
  SubmitSocialImpactLiveLinkResponse,
} from '@/types/campaign';
import type { VetDraftPayload } from '@/types/submissions';
import type { CreateDisputePayload } from '@/types/dispute';
import type { CreateReviewPayload } from '@/types/review';

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

export function useSubmitCampaign(
  onSuccess: (breakdown: PaymentBreakdown, paymentUrl: string, escrowId: string) => void,
) {
  return useMutation({
    mutationFn: (id: string) => campaignApi.submitCampaign(id),
    onSuccess: ({ data }) => {
      toast.success(data.message ?? 'Campaign submitted', { duration: 900 });
      const bd = data.campaign.paymentBreakdown;
      onSuccess(
        {
          campaignBudget: bd.campaignBudget,
          trenduppFee: bd.trenduppFee,
          vat: bd.vat,
          totalToPay: bd.totalToPay,
        },
        data.payment.paymentUrl,
        data.payment.escrowId,
      );
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err?.response?.data?.message ?? 'Could not submit campaign');
    },
  });
}

export function useVerifyPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ campaignId, escrowId }: { campaignId: string; escrowId: string }) =>
      campaignApi.verifyPayment(campaignId, escrowId).then((r) => r.data),
    onSuccess: (_data, { campaignId }) => {
      queryClient.invalidateQueries({ queryKey: ['my-campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaign', campaignId] });
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

export function useCampaignActivityTimeline(id: string | null, enabled: boolean = true) {
  return useQuery({
    queryKey: ['campaign-activity-timeline', id],
    queryFn: () => campaignApi.getActivityTimeline(id!).then((r) => r.data),
    enabled: !!id && enabled,
    staleTime: 1000 * 30,
  });
}

export function useApplyCampaign(onSuccess: (application?: CampaignApplicationDto) => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ApplyCampaignPayload }) =>
      campaignApi.applyCampaign(id, payload),
    onSuccess: ({ data }) => {
      toast.success(data.message ?? 'Application submitted successfully! 🚀', { duration: 1500 });
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaign'] });
      queryClient.invalidateQueries({ queryKey: ['my-applications'] });
      onSuccess(data.application);
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err?.response?.data?.message ?? 'Could not submit application, please try again');
    },
  });
}

export function useParticipateSocialImpact(
  onSuccess: (application?: CampaignApplicationDto) => void,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => campaignApi.participateSocialImpact(id),
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ['social-impact-campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['social-impact-my-applications'] });
      onSuccess(data.application);
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err?.response?.data?.message ?? 'Could not join campaign, please try again');
    },
  });
}

export function useSubmitSocialImpactLiveLink(
  onSuccess: (data: SubmitSocialImpactLiveLinkResponse) => void,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, liveLink }: { id: string; liveLink: string }) =>
      campaignApi.submitSocialImpactLiveLink(id, liveLink),
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ['social-impact-my-applications'] });
      onSuccess(data);
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err?.response?.data?.message ?? 'Could not submit live link, please try again');
    },
  });
}

export function useMySocialImpactApplications(
  tab?: 'all' | 'pending' | 'accepted' | 'rejected',
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: ['social-impact-my-applications', tab],
    queryFn: () => campaignApi.getMySocialImpactApplications(tab).then((r) => r.data.data),
    staleTime: 0,
    enabled,
  });
}

export function useMyApplications(enabled: boolean = true) {
  return useQuery<CampaignApplicationDto[]>({
    queryKey: ['my-applications'],
    queryFn: () =>
      campaignApi.getMyApplications().then((r) => {
        const data = r.data as
          | { applications?: CampaignApplicationDto[] }
          | CampaignApplicationDto[]
          | undefined;
        return data && 'applications' in data && Array.isArray(data.applications)
          ? data.applications
          : Array.isArray(data)
            ? data
            : [];
      }),
    staleTime: 0,
    enabled,
    // A brand reviewing a submission (approve/request revision/reject) happens
    // in a completely separate session — there's no client-side cache to
    // invalidate from here. Refetching on focus is the practical stand-in: the
    // creator's "My Work" list picks up the brand's decision as soon as they
    // switch back to this tab, without needing a manual refresh.
    refetchOnWindowFocus: true,
  });
}

export function useMyCampaigns(status?: CampaignStatus, enabled: boolean = true) {
  return useQuery({
    queryKey: ['my-campaigns', status],
    queryFn: () => campaignApi.getMyCampaigns(status).then((r) => r.data),
    staleTime: 0,
    refetchOnMount: 'always',
    enabled,
  });
}

export function useApplication(id: string | null) {
  return useQuery({
    queryKey: ['application', id],
    queryFn: () => campaignApi.getApplication(id!).then((r) => r.data.application),
    enabled: !!id,
    staleTime: 0,
  });
}

export function useRespondToComment(applicationId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      campaignId,
      creatorId,
      response,
    }: {
      campaignId: string;
      creatorId: string;
      response: string;
    }) => campaignApi.respondToComment(campaignId, creatorId, response),
    onSuccess: () => {
      toast.success('Response sent to creator');
      queryClient.invalidateQueries({ queryKey: ['application', applicationId] });
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err?.response?.data?.message ?? 'Could not send response, please try again');
    },
  });
}

export function useValidateSelection(campaignId: string) {
  return useMutation({
    mutationFn: (applicationIds: string[]) =>
      campaignApi.validateSelection(campaignId, applicationIds).then((r) => r.data),
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err?.response?.data?.message ?? 'Could not check budget for this selection');
    },
  });
}

export function useReviewApplicationsBatch(
  campaignId: string,
  onSuccess: (applicationIds: string[], status: 'accepted' | 'rejected') => void,
) {
  return useMutation({
    mutationFn: ({
      applicationIds,
      status,
    }: {
      applicationIds: string[];
      status: 'accepted' | 'rejected';
    }) => campaignApi.reviewApplicationsBatch(campaignId, applicationIds, status),
    onSuccess: ({ data }, variables) => {
      toast.success(data.message, { duration: 900 });
      onSuccess(variables.applicationIds, variables.status);
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err?.response?.data?.message ?? 'Could not update application(s)');
    },
  });
}

export function useSubmissions(campaignId: string | null, enabled: boolean = true) {
  return useQuery({
    queryKey: ['campaign-submissions', campaignId],
    queryFn: () => campaignApi.getSubmissions(campaignId!).then((r) => r.data.submissions),
    enabled: !!campaignId && enabled,
    staleTime: 0,
    refetchOnMount: 'always',
  });
}

export function useVetDraft(campaignId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ submissionId, ...payload }: VetDraftPayload & { submissionId: string }) =>
      campaignApi.vetDraft(campaignId, submissionId, payload),
    onSuccess: ({ data }) => {
      toast.success(data.message ?? 'Draft reviewed', { duration: 900 });
      queryClient.invalidateQueries({ queryKey: ['campaign-submissions', campaignId] });
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err?.response?.data?.message ?? 'Could not review draft');
    },
  });
}

export function useRaiseDispute(onSuccess?: () => void) {
  return useMutation({
    mutationFn: (payload: CreateDisputePayload) => campaignApi.raiseDispute(payload),
    onSuccess: ({ data }) => {
      toast.success(data.message ?? 'Dispute raised — our team will review this.', {
        duration: 1500,
      });
      onSuccess?.();
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err?.response?.data?.message ?? 'Could not raise dispute');
    },
  });
}

export function useApproveLivePost(campaignId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (submissionId: string) => campaignApi.approveLivePost(campaignId, submissionId),
    onSuccess: ({ data }) => {
      toast.success(data.message ?? 'Live post approved', { duration: 900 });
      queryClient.invalidateQueries({ queryKey: ['campaign-submissions', campaignId] });
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err?.response?.data?.message ?? 'Could not approve live post');
    },
  });
}

export function useCreateReview(onSuccess?: () => void) {
  return useMutation({
    mutationFn: (payload: CreateReviewPayload) => campaignApi.createReview(payload),
    onSuccess: ({ data }) => {
      toast.success(data.message ?? 'Review submitted', { duration: 1200 });
      onSuccess?.();
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err?.response?.data?.message ?? 'Could not submit review');
    },
  });
}

export function useSubmitContentDraft(onSuccess: () => void) {
  return useMutation({
    mutationFn: ({
      id,
      appId,
      payload,
    }: {
      id: string;
      appId: string;
      payload: SubmitContentDraftPayload;
    }) => campaignApi.submitContentDraft(id, appId, payload),
    onSuccess: ({ data }) => {
      toast.success(data.message ?? 'Content draft link submitted! 🚀', { duration: 1500 });
      onSuccess();
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err?.response?.data?.message ?? 'Could not submit draft, please try again');
    },
  });
}

export function useSubmitProofOfPosting(onSuccess: () => void) {
  return useMutation({
    mutationFn: ({
      id,
      submissionId,
      payload,
    }: {
      id: string;
      submissionId: string;
      payload: SubmitLiveLinkPayload;
    }) => campaignApi.submitProofOfPosting(id, submissionId, payload),
    onSuccess: ({ data }) => {
      toast.success(data.message ?? 'Proof of posting submitted successfully! 🎉', {
        duration: 1500,
      });
      onSuccess();
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err?.response?.data?.message ?? 'Could not submit proof, please try again');
    },
  });
}

export function useCreatorReviews(creatorId: string | null) {
  return useQuery({
    queryKey: ['creatorReviews', creatorId],
    queryFn: () => campaignApi.getCreatorReviews(creatorId!).then((r) => r.data.reviews),
    enabled: !!creatorId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCampaigns(
  params?: {
    page?: number;
    limit?: number;
    status?: CampaignStatusFilter;
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
    queryFn: () => campaignApi.getCampaigns(params).then((r) => r.data),
    staleTime: 1000 * 30,
    enabled,
    placeholderData: keepPreviousData,
  });
}

export function useSocialImpactCampaigns(
  params?: {
    tab?: 'all' | 'active' | 'completed';
    page?: number;
    limit?: number;
  },
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: ['social-impact-campaigns', params],
    queryFn: () => campaignApi.getSocialImpactCampaigns(params).then((r) => r.data),
    staleTime: 1000 * 30,
    enabled,
    placeholderData: keepPreviousData,
  });
}

// A single page's row count can't be trusted as "N unique campaigns" — the
// backend's LIMIT/OFFSET pagination sometimes repeats or drops rows across
// pages (seen live: total 12, limit 12, pages 1, but only 4 rows in `data`).
// Accumulating pages, de-duping by id, and comparing the unique count against
// the trustworthy `total` field sidesteps that instability instead of
// trusting page-by-page arithmetic. MAX_INFINITE_PAGES is a safety valve in
// case the backend bug ever prevents the unique count from reaching `total`.
const MAX_INFINITE_PAGES = 50;

export function useCampaignsInfinite(
  params: {
    limit?: number;
    status?: CampaignStatusFilter;
    sortBy?: 'newest' | 'highest_budget' | 'closing_soon';
    platforms?: string[];
    niches?: string[];
    nicheIds?: string[];
    goal?: string;
  },
  enabled: boolean = true,
) {
  const limit = params.limit ?? 12;
  const query = useInfiniteQuery({
    queryKey: ['campaigns-infinite', { ...params, limit }],
    queryFn: ({ pageParam }) =>
      campaignApi.getCampaigns({ ...params, limit, page: pageParam }).then((r) => r.data),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (allPages.length >= MAX_INFINITE_PAGES) return undefined;
      const uniqueCount = new Set(allPages.flatMap((p) => p.data.map((c) => c.id))).size;
      return uniqueCount < lastPage.pagination.total ? allPages.length + 1 : undefined;
    },
    enabled,
    staleTime: 1000 * 30,
  });

  const seen = new Set<string>();
  const campaigns = (query.data?.pages.flatMap((p) => p.data) ?? []).filter((c) => {
    if (seen.has(c.id)) return false;
    seen.add(c.id);
    return true;
  });

  return {
    campaigns,
    total: query.data?.pages[0]?.pagination.total ?? 0,
    isLoading: query.isLoading,
    isError: query.isError,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: !!query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
  };
}

export function useSocialImpactCampaignsInfinite(
  params: { tab?: 'all' | 'active' | 'completed'; limit?: number } = {},
  enabled: boolean = true,
) {
  const limit = params.limit ?? 12;
  const query = useInfiniteQuery({
    queryKey: ['social-impact-campaigns-infinite', { ...params, limit }],
    queryFn: ({ pageParam }) =>
      campaignApi
        .getSocialImpactCampaigns({ ...params, limit, page: pageParam })
        .then((r) => r.data),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (allPages.length >= MAX_INFINITE_PAGES) return undefined;
      const uniqueCount = new Set(allPages.flatMap((p) => p.data.map((c) => c.id))).size;
      return uniqueCount < lastPage.pagination.total ? allPages.length + 1 : undefined;
    },
    enabled,
    staleTime: 1000 * 30,
  });

  const seen = new Set<string>();
  const campaigns = (query.data?.pages.flatMap((p) => p.data) ?? []).filter((c) => {
    if (seen.has(c.id)) return false;
    seen.add(c.id);
    return true;
  });

  return {
    campaigns,
    total: query.data?.pages[0]?.pagination.total ?? 0,
    isLoading: query.isLoading,
    isError: query.isError,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: !!query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
  };
}

export function useDeleteDraftCampaign(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => campaignApi.deleteDraftCampaign(id),
    onSuccess: ({ data }) => {
      toast.success(data.message ?? 'Draft campaign deleted', { duration: 900 });
      queryClient.invalidateQueries({ queryKey: ['my-campaigns'] });
      onSuccess?.();
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(
        err?.response?.data?.message ??
          'Could not delete draft. It may no longer be in draft status.',
      );
    },
  });
}
