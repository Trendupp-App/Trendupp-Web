import apiClient from '@/lib/apiClient';
import type { AdClickResponse, BannerAd } from '@/types/ads';

export const adsApi = {
  getAds: (placement?: string) =>
    apiClient.get<BannerAd[]>('/ads', { params: placement ? { placement } : undefined }),

  recordImpression: (id: string) => apiClient.post<void>(`/ads/${id}/impression`),

  recordClick: (id: string) => apiClient.post<AdClickResponse>(`/ads/${id}/click`),
};
