import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationApi } from '@/services/notificationApi';
import type { NotificationCategory } from '@/types/notifications';

const FEED_LIMIT = 15;
const UNREAD_COUNT_POLL_MS = 45_000;

export function useNotificationsFeed(category?: NotificationCategory, enabled: boolean = true) {
  return useInfiniteQuery({
    queryKey: ['notifications', category],
    queryFn: ({ pageParam }) =>
      notificationApi
        .getNotifications({ page: pageParam, limit: FEED_LIMIT, category })
        .then((r) => r.data),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.pages
        ? lastPage.pagination.page + 1
        : undefined,
    enabled,
    staleTime: 1000 * 15,
  });
}

export function useUnreadNotificationCount(enabled: boolean = true) {
  return useQuery({
    queryKey: ['notifications-unread-count'],
    queryFn: () => notificationApi.getUnreadCount().then((r) => r.data.count),
    staleTime: 1000 * 20,
    refetchInterval: UNREAD_COUNT_POLL_MS,
    enabled,
  });
}

export function useMarkNotificationsSeen() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationApi.markSeen(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications-unread-count'] });
    },
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationApi.markRead(id).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationApi.markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-unread-count'] });
    },
  });
}
