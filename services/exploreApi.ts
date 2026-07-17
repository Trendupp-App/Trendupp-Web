import apiClient from '@/lib/apiClient';
import type { ExploreCreator, ExploreBrand, ExploreSearchResponse } from '@/types/explore';

export const exploreApi = {
  getCreators: (categoryId?: string) =>
    apiClient.get<ExploreCreator[]>('/users/explore/creator', {
      params: categoryId ? { category: categoryId } : undefined,
    }),

  getBrands: (categoryId?: string) =>
    apiClient.get<ExploreBrand[]>('/users/explore/brand', {
      params: categoryId ? { category: categoryId } : undefined,
    }),

  search: (q: string) =>
    apiClient.get<ExploreSearchResponse>('/users/explore/search', {
      params: { q },
    }),
};
