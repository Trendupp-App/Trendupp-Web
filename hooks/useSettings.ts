import { useQuery } from '@tanstack/react-query';
import { settingsApi } from '@/services/settingsApi';

// Platform-wide contact/social settings — admin-managed, rarely change.
const SETTINGS_STALE_TIME = 1000 * 60 * 60;

export function useContactInfo(enabled: boolean = true) {
  return useQuery({
    queryKey: ['platform-contact-info'],
    queryFn: () => settingsApi.getContactInfo().then((r) => r.data),
    enabled,
    staleTime: SETTINGS_STALE_TIME,
  });
}

export function useExternalLinks(enabled: boolean = true) {
  return useQuery({
    queryKey: ['platform-external-links'],
    queryFn: () => settingsApi.getExternalLinks().then((r) => r.data),
    enabled,
    staleTime: SETTINGS_STALE_TIME,
  });
}
