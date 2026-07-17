import apiClient from '@/lib/apiClient';
import { TopPerformerCreator } from '@/types/creator';
import type { CreatorProfileDto, BrandProfileDto } from '@/types/profile';

export const usersApi = {
  getExploreProfile: (id: string) =>
    apiClient.get<CreatorProfileDto>(`/users/explore/profile/${id}`),
  getExploreBrandProfile: (id: string) =>
    apiClient.get<BrandProfileDto>(`/users/explore/profile/${id}`),
  getTopPerformers: () => apiClient.get<TopPerformerCreator[]>('/users/creators/top-performers'),
};
