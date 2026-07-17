import { useQuery } from '@tanstack/react-query';
import { exploreApi } from '@/services/exploreApi';

export function useExploreCreators(categoryId?: string | null) {
  return useQuery({
    queryKey: ['explore-creators', categoryId ?? 'all'],
    queryFn: () => exploreApi.getCreators(categoryId ?? undefined).then((r) => r.data),
    staleTime: 1000 * 30,
  });
}

export function useExploreBrands(categoryId?: string | null) {
  return useQuery({
    queryKey: ['explore-brands', categoryId ?? 'all'],
    queryFn: () => exploreApi.getBrands(categoryId ?? undefined).then((r) => r.data),
    staleTime: 1000 * 30,
  });
}
