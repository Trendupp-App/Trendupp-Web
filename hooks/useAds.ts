import { useMutation, useQuery } from '@tanstack/react-query';
import { adsApi } from '@/services/adsApi';

export function useAds(placement: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['ads', placement],
    queryFn: () => adsApi.getAds(placement).then((r) => r.data),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}

// Tracking calls are fire-and-forget — a failure here shouldn't surface to
// the user or block the ad from displaying/being clickable.
export function useRecordAdImpression() {
  return useMutation({
    mutationFn: (id: string) => adsApi.recordImpression(id),
  });
}

export function useRecordAdClick() {
  return useMutation({
    mutationFn: (id: string) => adsApi.recordClick(id).then((r) => r.data),
  });
}
