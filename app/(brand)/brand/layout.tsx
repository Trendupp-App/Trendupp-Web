'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '@/shared/Sidebar';
import Header from '@/shared/Header';
import NotificationDrawer from '@/components/creator-dashboard/NotificationDrawer';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import PageLoader from '@/components/skeletons/PageLoader';
import StreamChatProvider from '@/lib/providers/StreamChatProvider';

const CREATOR_TITLES: Record<string, string> = {
  '/creator/dashboard': 'Dashboard',
  '/creator/explore': 'Campaign',
  '/creator/news': 'News',
  '/creator/my-work': 'My work',
  '/creator/payout': 'Payout',
  '/creator/profile': 'My profile',
};

const BRAND_TITLES: Record<string, string> = {
  '/brand/dashboard': 'Dashboard',
  '/brand/campaigns': 'Campaigns',
  '/brand/explore': 'Explore',
  '/brand/news': 'News',
  '/brand/payout': 'Payout',
  '/brand/profile': 'My profile',
};

function resolveTitle(pathname: string, isBrand: boolean): string {
  const map = isBrand ? BRAND_TITLES : CREATOR_TITLES;
  // Exact match first, then prefix match for nested routes
  if (map[pathname]) return map[pathname];
  const match = Object.entries(map).find(([key]) => pathname.startsWith(key + '/'));
  return match ? match[1] : 'Dashboard';
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, accessToken, hasHydrated } = useAuthStore();
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);

    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (hasHydrated && (!accessToken || !user)) {
      router.replace('/signin');
    }
  }, [hasHydrated, accessToken, user, router]);

  if (!hasHydrated) return <PageLoader />;

  if (!isMounted || !accessToken || !user) return <PageLoader />;

  const isBrand = user?.role === 'brand';
  const headerTitle = resolveTitle(pathname, isBrand);

  // Derived user shape for Header
  const headerUser = user
    ? {
        displayName: `${user.username}`.trim(),
        initials: `${user.username?.[0] ?? ''}`.toUpperCase(),
        avatarUrl: user.avatarUrl ?? undefined,
      }
    : undefined;

  // Hide header on detail/article pages (e.g. /creator/news/some-article)
  const isDetailPage = /\/(creator|brand)\/news\/.+/.test(pathname);

  return (
    <StreamChatProvider>
      <div className="flex h-dvh w-screen overflow-hidden bg-[#faf9fc] font-sans relative">
        {/* Left fixed Sidebar — desktop only */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Right content area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {!isDetailPage && (
            <Header
              user={headerUser}
              title={headerTitle}
              onNotificationClick={() => setIsNotificationOpen(true)}
              onMenuClick={() => setIsMobileMenuOpen(true)}
            />
          )}

          <main
            className={cn(
              'flex-1 overflow-y-auto select-none bg-[#faf9fc]',
              isDetailPage ? 'px-0 py-0' : 'px-4 md:px-8 py-6',
            )}
          >
            {children}
          </main>
        </div>

        {/* Mobile overlay backdrop */}
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className={cn(
            'fixed inset-0 bg-black/40 z-50 transition-opacity duration-300 md:hidden',
            isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
          )}
        />

        {/* Mobile slide-out sidebar */}
        <div
          className={cn(
            'fixed top-0 bottom-0 left-0 w-[260px] z-50 transition-transform duration-300 ease-in-out md:hidden flex flex-col bg-[#fef2f6] shadow-2xl',
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <Sidebar />
        </div>

        {/* Notification drawer */}
        <NotificationDrawer
          isOpen={isNotificationOpen}
          onClose={() => setIsNotificationOpen(false)}
        />
      </div>
    </StreamChatProvider>
  );
}
