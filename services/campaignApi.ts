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

export const campaignApi = {
  getPlatforms: () => apiClient.get<CampaignPlatform[]>('/campaigns/platforms'),
  getCreatorCategories: () => apiClient.get<CreatorCategory[]>('/campaigns/creator-categories'),
  createCampaign: (payload: CreateCampaignPayload) => {
    const formData = new FormData();
    formData.append('title', payload.title);
    formData.append('goal', payload.goal);
    formData.append('totalBudget', String(payload.totalBudget));
    formData.append('paymentPerCreator', payload.paymentPerCreator);
    formData.append('contentType', payload.contentType);
    formData.append('duration', String(payload.duration));
    formData.append('creatorCategoryId', payload.creatorCategoryId);
    payload.preferredPlatformIds.forEach((id) => formData.append('preferredPlatformIds[]', id));
    if (payload.coverImage) {
      formData.append('coverImage', payload.coverImage);
    }
    return apiClient.post<CreateCampaignResponse>('/campaigns', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  patchCampaign: (id: string, payload: PatchCampaignPayload) =>
    apiClient.patch<PatchCampaignResponse>(`/campaigns/${id}`, payload),
  getCampaign: (id: string) => apiClient.get<Campaign>(`/campaigns/${id}`),
  submitCampaign: (id: string) => apiClient.post<SubmitCampaignResponse>(`/campaigns/${id}/submit`),
  payCampaign: (id: string, payload: PayCampaignPayload) =>
    apiClient.post<PayCampaignResponse>(`/campaigns/${id}/pay`, payload),
};
