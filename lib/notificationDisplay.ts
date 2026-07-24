import {
  Megaphone,
  CircleCheck,
  Wallet,
  MessageSquare,
  ShieldCheck,
  CalendarClock,
  Gift,
  type LucideIcon,
} from 'lucide-react';
import type { NotificationCategory } from '@/types/notifications';

interface CategoryMeta {
  label: string;
  icon: LucideIcon;
  iconClassName: string;
}

const CATEGORY_META: Record<NotificationCategory, CategoryMeta> = {
  newCampaigns: {
    label: 'Campaigns',
    icon: Megaphone,
    iconClassName: 'bg-[#edf2fe] text-[#2f63eb]',
  },
  applicationUpdates: {
    label: 'Applications',
    icon: CircleCheck,
    iconClassName: 'bg-[#eafaf0] text-[#16a34a]',
  },
  paymentAlerts: {
    label: 'Payments',
    icon: Wallet,
    iconClassName: 'bg-[#fdf2f6] text-[#d7176f]',
  },
  brandMessages: {
    label: 'Messages',
    icon: MessageSquare,
    iconClassName: 'bg-[#f2effe] text-[#7c3aed]',
  },
  weeklySummary: {
    label: 'Summary',
    icon: CalendarClock,
    iconClassName: 'bg-[#eef6fb] text-[#0284c7]',
  },
  marketingOffers: {
    label: 'Offers',
    icon: Gift,
    iconClassName: 'bg-[#fef9e7] text-[#ca8a04]',
  },
  security: {
    label: 'Security',
    icon: ShieldCheck,
    iconClassName: 'bg-[#f4f3f6] text-[#5a5a7a]',
  },
};

export const NOTIFICATION_CATEGORIES: NotificationCategory[] = [
  'newCampaigns',
  'applicationUpdates',
  'paymentAlerts',
  'brandMessages',
  'weeklySummary',
  'marketingOffers',
  'security',
];

export function getNotificationCategoryMeta(category: NotificationCategory): CategoryMeta {
  return CATEGORY_META[category];
}

export type NotificationRole = 'creator' | 'brand';

/**
 * The backend sends role-agnostic deep-link paths (e.g. "/campaigns/:id").
 * Translate those into the app's actual role-scoped routes; return null when
 * there's nowhere sensible to send this role so the caller can skip navigation.
 */
export function resolveNotificationRoute(
  actionUrl: string | null,
  role: NotificationRole,
): string | null {
  if (!actionUrl) return null;

  const campaignMatch = actionUrl.match(/^\/campaigns\/([^/]+)$/);
  if (campaignMatch) {
    return role === 'brand' ? `/brand/campaign/${campaignMatch[1]}` : '/creator/explore';
  }

  if (actionUrl === '/settings/socials') {
    return role === 'brand' ? '/brand/profile' : '/creator/profile';
  }

  if (actionUrl.startsWith('/brand/') || actionUrl.startsWith('/creator/')) {
    return actionUrl;
  }

  return null;
}
