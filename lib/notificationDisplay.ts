import {
  Megaphone,
  CircleCheck,
  Wallet,
  MessageSquare,
  ShieldCheck,
  UserRound,
  Gift,
  Radio,
  Bell,
  type LucideIcon,
} from 'lucide-react';
import type { NotificationCategory } from '@/types/notifications';

interface CategoryMeta {
  label: string;
  icon: LucideIcon;
  iconClassName: string;
}

const CATEGORY_META: Record<NotificationCategory, CategoryMeta> = {
  campaigns: {
    label: 'Campaigns',
    icon: Megaphone,
    iconClassName: 'bg-[#edf2fe] text-[#2f63eb]',
  },
  applications: {
    label: 'Applications',
    icon: CircleCheck,
    iconClassName: 'bg-[#eafaf0] text-[#16a34a]',
  },
  payments: {
    label: 'Payments',
    icon: Wallet,
    iconClassName: 'bg-[#fdf2f6] text-[#d7176f]',
  },
  chatDispute: {
    label: 'Chat & Disputes',
    icon: MessageSquare,
    iconClassName: 'bg-[#f2effe] text-[#7c3aed]',
  },
  account: {
    label: 'Account',
    icon: UserRound,
    iconClassName: 'bg-[#eef2ff] text-[#4f46e5]',
  },
  security: {
    label: 'Security',
    icon: ShieldCheck,
    iconClassName: 'bg-[#f4f3f6] text-[#5a5a7a]',
  },
  opportunities: {
    label: 'Opportunities',
    icon: Gift,
    iconClassName: 'bg-[#fef9e7] text-[#ca8a04]',
  },
  broadcast: {
    label: 'Announcements',
    icon: Radio,
    iconClassName: 'bg-[#ecfeff] text-[#0891b2]',
  },
};

export const NOTIFICATION_CATEGORIES: NotificationCategory[] = [
  'campaigns',
  'applications',
  'payments',
  'chatDispute',
  'account',
  'security',
  'opportunities',
  'broadcast',
];

// Fallback for categories the backend sends that this catalog doesn't know
// about yet — `category` is an open string server-side (see NOTIFICATION_CATEGORIES
// docs), not a closed enum, so an unrecognized value must render *something*
// rather than crash the drawer.
const DEFAULT_CATEGORY_META: CategoryMeta = {
  label: 'Updates',
  icon: Bell,
  iconClassName: 'bg-[#f4f3f6] text-[#5a5a7a]',
};

export function getNotificationCategoryMeta(category: string): CategoryMeta {
  return CATEGORY_META[category as NotificationCategory] ?? DEFAULT_CATEGORY_META;
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
