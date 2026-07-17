import { useQuery } from '@tanstack/react-query';
import { exploreApi } from '@/services/exploreApi';
import { useDebouncedValue } from '@/hooks/useDebounceValue';

export function useExploreCreators(categoryId?: string | null, enabled: boolean = true) {
  return useQuery({
    queryKey: ['explore-creators', categoryId ?? 'all'],
    queryFn: () => exploreApi.getCreators(categoryId ?? undefined).then((r) => r.data),
    staleTime: 1000 * 30,
    enabled,
  });
}

export function useExploreBrands(categoryId?: string | null, enabled: boolean = true) {
  return useQuery({
    queryKey: ['explore-brands', categoryId ?? 'all'],
    queryFn: () => exploreApi.getBrands(categoryId ?? undefined).then((r) => r.data),
    staleTime: 1000 * 30,
    enabled,
  });
}

export function useExploreSearch(query: string, enabled: boolean = true) {
  const debouncedQuery = useDebouncedValue(query.trim(), 350);

  return useQuery({
    queryKey: ['explore-search', debouncedQuery],
    queryFn: () => exploreApi.search(debouncedQuery).then((r) => r.data),
    enabled: enabled && debouncedQuery.length > 0,
    staleTime: 1000 * 15,
  });
}
