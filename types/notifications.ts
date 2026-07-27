export type NotificationCategory =
  | 'newCampaigns'
  | 'applicationUpdates'
  | 'paymentAlerts'
  | 'brandMessages'
  | 'weeklySummary'
  | 'marketingOffers'
  | 'security';

export type NotificationPriority = 'critical' | 'high' | 'medium' | 'low';

export type NotificationEmailStatus = 'skipped' | 'sent' | 'mocked' | 'failed';

export interface NotificationActor {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
}

export interface NotificationItem {
  id: string;
  type: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  title: string;
  body: string;
  actionUrl: string | null;
  data: Record<string, unknown>;
  seenAt: string | null;
  readAt: string | null;
  emailStatus: NotificationEmailStatus;
  createdAt: string;
  actor?: NotificationActor | null;
}

export interface NotificationPagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface PaginatedNotifications {
  data: NotificationItem[];
  pagination: NotificationPagination;
}

export interface UnreadCount {
  count: number;
}

export interface UpdatedCount {
  updated: number;
}

export interface GetNotificationsParams {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
  category?: NotificationCategory;
}
