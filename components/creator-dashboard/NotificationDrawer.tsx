'use client';

import { useState, useEffect } from 'react';
import { X, Check, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  time: string;
  type: 'payment' | 'selection' | 'revision';
  isUnread: boolean;
}

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    title: 'Payment Released',
    message: '₦180,000 from Zara Africa has been released to your wallet.',
    time: '2 mins ago',
    type: 'payment',
    isUnread: true,
  },
  {
    id: 2,
    title: "You've been Selected!",
    message: 'Congratulations! Tecno Mobile selected you for their SPARK 20 launch.',
    time: '2 mins ago',
    type: 'selection',
    isUnread: true,
  },
  {
    id: 3,
    title: 'Revision Requested',
    message: '₦180,000 from Zara Africa has been released to your wallet.',
    time: '1 hour ago',
    type: 'revision',
    isUnread: true,
  },
  {
    id: 4,
    title: 'Payment Released',
    message: 'Nestlé Nigeria has requested one revision on your submitted content.',
    time: '2 mins ago',
    type: 'payment',
    isUnread: true,
  },
  {
    id: 5,
    title: 'Payment Released',
    message: '₦180,000 from Zara Africa has been released to your wallet.',
    time: '2 mins ago',
    type: 'payment',
    isUnread: true,
  },
  {
    id: 6,
    title: 'Payment Released',
    message: '₦180,000 from Zara Africa has been released to your wallet.',
    time: '2 mins ago',
    type: 'payment',
    isUnread: true,
  },
];

type CategoryFilter = 'all' | 'campaigns' | 'payments' | 'content' | 'reminders';

export default function NotificationDrawer({ isOpen, onClose }: NotificationDrawerProps) {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');
  const notifications = MOCK_NOTIFICATIONS;

  // Prevent scroll behind the drawer when it is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const filteredNotifications = notifications.filter((item) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'payments') return item.type === 'payment';
    if (activeFilter === 'campaigns') return item.type === 'selection';
    if (activeFilter === 'content') return item.type === 'revision';
    return true; // fallbacks for reminders
  });

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
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#f4f3f6] transition-colors text-[#5a5a7a] focus:outline-none"
            aria-label="Close notifications"
          >
            <X size={20} />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 mt-5 overflow-x-auto pb-1 shrink-0 scrollbar-none">
          {(['all', 'campaigns', 'payments', 'content', 'reminders'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                'px-4.5 py-2 text-xs font-semibold rounded-full border border-transparent transition-all capitalize whitespace-nowrap',
                activeFilter === filter
                  ? 'bg-brand-pink text-white border-brand-pink shadow-[0_2px_8px_rgba(215,23,111,0.15)]'
                  : 'bg-[#f4f3f6] text-[#7a7a9a] hover:bg-[#eae8ed]',
              )}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Notification Cards List */}
        <div className="flex-1 overflow-y-auto mt-6 flex flex-col gap-3 pr-1.5 auth-scrollbar">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notif) => {
              // Icon selector
              let iconElement = <span>₦</span>;
              let iconClass = 'bg-[#fdf2f6] text-[#d7176f]'; // payment
              if (notif.type === 'selection') {
                iconElement = <Check size={16} className="stroke-[3]" />;
                iconClass = 'bg-[#edf2fe] text-[#2f63eb]';
              } else if (notif.type === 'revision') {
                iconElement = <FileText size={16} />;
                iconClass = 'bg-[#fef9e7] text-[#ca8a04]';
              }

              return (
                <div
                  key={notif.id}
                  className="bg-white border border-[#e8e6f0]/60 rounded-2xl p-4 flex gap-3.5 relative hover:shadow-[0_2px_12px_rgba(4,0,57,0.03)] transition-all cursor-pointer group"
                >
                  {/* Left Icon Square */}
                  <div
                    className={cn(
                      'w-10 h-10 rounded-xl shrink-0 flex items-center justify-center font-bold text-base',
                      iconClass,
                    )}
                  >
                    {iconElement}
                  </div>

                  {/* Details block */}
                  <div className="flex flex-col gap-0.5 pr-4">
                    <h4 className="text-sm font-bold text-[#1a1a2e] group-hover:text-brand-pink transition-colors">
                      {notif.title}
                    </h4>
                    <p className="text-xs font-extralight text-[#7a7a9a] leading-relaxed mt-0.5">
                      {notif.message}
                    </p>
                    <span className="text-[10px] text-[#9a99b0] font-light mt-1.5 block">
                      {notif.time}
                    </span>
                  </div>

                  {/* Unread pink dot indicator */}
                  {notif.isUnread && (
                    <span className="absolute top-4 right-4 w-1.5 h-1.5 bg-brand-pink rounded-full" />
                  )}
                </div>
              );
            })
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
