import apiClient from '@/lib/apiClient';
import type {
  CampaignPlatform,
  CreatorCategory,
  Campaign,
  CreateCampaignPayload,
  CreateCampaignResponse,
  PatchCampaignPayload,
  PatchCampaignResponse,
  SubmitCampaignResponse,
  PayCampaignPayload,
  PayCampaignResponse,
} from '@/types/campaign';

function appendIfDefined(form: FormData, key: string, value: unknown) {
  if (value === undefined || value === null || value === '') return;
  form.append(key, value as string | Blob);
}

export const campaignApi = {
  getPlatforms: () => apiClient.get<CampaignPlatform[]>('/campaigns/platforms'),

  getCreatorCategories: () => apiClient.get<CreatorCategory[]>('/campaigns/creator-categories'),
  createCampaign: (payload: CreateCampaignPayload) => {
    const fd = new FormData();
    appendIfDefined(fd, 'title', payload.title);
    appendIfDefined(fd, 'goal', payload.goal);
    appendIfDefined(fd, 'totalBudget', String(payload.totalBudget));
    appendIfDefined(fd, 'creatorCategoryId', payload.creatorCategoryId);
    payload.preferredPlatformIds.forEach((id) => fd.append('preferredPlatformIds', id));
    appendIfDefined(fd, 'campaignBrief', payload.campaignBrief);
    if (payload.coverImage instanceof File) {
      fd.append('coverImage', payload.coverImage);
    }
    return apiClient.post<CreateCampaignResponse>('/campaigns', fd, {
      headers: { 'Content-Type': undefined },
    });
  },

  patchCampaign: (id: string, payload: PatchCampaignPayload) => {
    const fd = new FormData();
    // Always send currentStep
    fd.append('currentStep', String(payload.currentStep));

    if (payload.currentStep === 2) {
      appendIfDefined(fd, 'campaignBrief', payload.campaignBrief);
      payload.deliverables.forEach((v) => appendIfDefined(fd, 'deliverables', v));
      payload.contentDirection.forEach((v) => appendIfDefined(fd, 'contentDirection', v));
      // contentGuidelines must be JSON-stringified inside form-data
      fd.append('contentGuidelines', JSON.stringify(payload.contentGuidelines));
    }

    if (payload.currentStep === 3) {
      appendIfDefined(fd, 'usageRights', payload.usageRights);
      appendIfDefined(fd, 'successLooksLike', payload.successLooksLike);
    }

    return apiClient.patch<PatchCampaignResponse>(`/campaigns/${id}`, fd, {
      headers: { 'Content-Type': undefined },
    });
  },

  getMyCampaigns: (status?: 'draft' | 'live' | 'active' | 'completed') =>
    apiClient.get<Campaign[]>('/campaigns/my', { params: status ? { status } : undefined }),

  getCampaign: (id: string) => apiClient.get<Campaign>(`/campaigns/${id}`),

  submitCampaign: (id: string) => apiClient.post<SubmitCampaignResponse>(`/campaigns/${id}/submit`),

  payCampaign: (id: string, payload: PayCampaignPayload) =>
    apiClient.post<PayCampaignResponse>(`/campaigns/${id}/pay`, payload),
};
