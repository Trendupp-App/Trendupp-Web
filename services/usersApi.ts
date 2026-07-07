import apiClient from '@/lib/apiClient';
import type { CreatorProfileDto } from '@/types/profile';

export const usersApi = {
  getExploreProfile: (id: string) =>
    apiClient.get<CreatorProfileDto>(`/users/explore/profile/${id}`),
};
