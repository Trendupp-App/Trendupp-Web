'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, CheckCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatRelativeTime } from '@/utils/Utilities';
import {
  NOTIFICATION_CATEGORIES,
  getNotificationCategoryMeta,
  resolveNotificationRoute,
} from '@/lib/notificationDisplay';
import {
  useNotificationsFeed,
  useMarkNotificationsSeen,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from '@/hooks/useNotifications';
import type { NotificationCategory, NotificationItem } from '@/types/notifications';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

type CategoryFilter = 'all' | NotificationCategory;

const SCROLL_FETCH_THRESHOLD_PX = 120;

export default function NotificationDrawer({ isOpen, onClose }: NotificationDrawerProps) {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');
  const listRef = useRef<HTMLDivElement>(null);
  const hasMarkedSeenRef = useRef(false);

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useNotificationsFeed(activeFilter === 'all' ? undefined : activeFilter, isOpen);
  const markSeen = useMarkNotificationsSeen();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const notifications = data?.pages.flatMap((page) => page.data) ?? [];

  // Prevent scroll behind the drawer when it is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      hasMarkedSeenRef.current = false;
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Clear the bell badge the first time the drawer opens — items stay unread
  useEffect(() => {
    if (isOpen && !hasMarkedSeenRef.current) {
      hasMarkedSeenRef.current = true;
      markSeen.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  function handleScroll() {
    const el = listRef.current;
    if (!el || !hasNextPage || isFetchingNextPage) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    if (distanceFromBottom < SCROLL_FETCH_THRESHOLD_PX) {
      fetchNextPage();
    }
  }

  function handleNotificationClick(notif: NotificationItem) {
    if (!notif.readAt) markRead.mutate(notif.id);
    const route = resolveNotificationRoute(notif.actionUrl, 'creator');
    if (route) {
      router.push(route);
      onClose();
    }
  }

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex justify-end transition-opacity duration-300',
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
      )}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/35 backdrop-blur-[2px] transition-all"
        onClick={onClose}
      />

      {/* Slide-out Panel */}
      <div
        className={cn(
          'w-full max-w-[500px] h-full bg-white relative z-10 flex flex-col p-6 shadow-2xl transition-transform duration-300 ease-out border-0 border-none',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
        style={{ border: 'none' }}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-[#e8e6f0]/40 pb-4 shrink-0">
          <h3 className="text-xl font-bold text-[#1a1a2e]">Notification</h3>
          <div className="flex items-center gap-1">
            <button
              onClick={() => markAllRead.mutate()}
              disabled={markAllRead.isPending || notifications.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-[#7a7a9a] hover:bg-[#f4f3f6] disabled:opacity-40 transition-colors"
            >
              <CheckCheck size={14} />
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[#f4f3f6] transition-colors text-[#5a5a7a] focus:outline-none"
              aria-label="Close notifications"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 mt-5 overflow-x-auto pb-1 shrink-0 scrollbar-none">
          {(['all', ...NOTIFICATION_CATEGORIES] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                'px-4.5 py-2 text-xs font-semibold rounded-full border border-transparent transition-all whitespace-nowrap',
                activeFilter === filter
                  ? 'bg-brand-pink text-white border-brand-pink shadow-[0_2px_8px_rgba(215,23,111,0.15)]'
                  : 'bg-[#f4f3f6] text-[#7a7a9a] hover:bg-[#eae8ed]',
              )}
            >
              {filter === 'all' ? 'All' : getNotificationCategoryMeta(filter).label}
            </button>
          ))}
        </div>

        {/* Notification Cards List */}
        <div
          ref={listRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto mt-6 flex flex-col gap-3 pr-1.5 auth-scrollbar"
        >
          {isLoading ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <div
                key={idx}
                className="h-[76px] bg-[#faf9fc] border border-[#e8e6f0]/60 rounded-2xl animate-pulse"
              />
            ))
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-16 text-red-400 gap-2">
              <span className="text-sm">Could not load notifications.</span>
            </div>
          ) : notifications.length > 0 ? (
            <>
              {notifications.map((notif) => {
                const meta = getNotificationCategoryMeta(notif.category);
                const Icon = meta.icon;
                const isUnread = !notif.readAt;

                return (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={cn(
                      'bg-white border border-[#e8e6f0]/60 rounded-2xl p-4 flex gap-3.5 relative hover:shadow-[0_2px_12px_rgba(4,0,57,0.03)] transition-all cursor-pointer group',
                      notif.priority === 'critical' && 'border-l-2 border-l-red-400',
                    )}
                  >
                    {/* Left Icon Square */}
                    <div
                      className={cn(
                        'w-10 h-10 rounded-xl shrink-0 flex items-center justify-center font-bold text-base',
                        meta.iconClassName,
                      )}
                    >
                      <Icon size={16} className="stroke-[2.25]" />
                    </div>

                    {/* Details block */}
                    <div className="flex flex-col gap-0.5 pr-4">
                      <h4 className="text-sm font-bold text-[#1a1a2e] group-hover:text-brand-pink transition-colors">
                        {notif.title}
                      </h4>
                      <p className="text-xs font-extralight text-[#7a7a9a] leading-relaxed mt-0.5">
                        {notif.body}
                      </p>
                      <span className="text-[10px] text-[#9a99b0] font-light mt-1.5 block">
                        {formatRelativeTime(notif.createdAt)}
                      </span>
                    </div>

                    {/* Unread pink dot indicator */}
                    {isUnread && (
                      <span className="absolute top-4 right-4 w-1.5 h-1.5 bg-brand-pink rounded-full" />
                    )}
                  </div>
                );
              })}
              {isFetchingNextPage && (
                <div className="h-[76px] bg-[#faf9fc] border border-[#e8e6f0]/60 rounded-2xl animate-pulse" />
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-[#9a99b0] gap-2">
              <span className="text-sm">No notifications found</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
