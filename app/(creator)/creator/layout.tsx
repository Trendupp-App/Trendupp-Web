'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import NotificationDrawer from '@/components/dashboard/NotificationDrawer';
import { cn } from '@/lib/utils';

export default function CreatorLayout({ children }: { children: React.ReactNode }) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Automatically close mobile menu drawer on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Compute title dynamically based on path
  let headerTitle = 'Dashboard';
  if (pathname.includes('/explore')) {
    headerTitle = 'Campaign';
  } else if (pathname.includes('/my-work')) {
    headerTitle = 'My work';
  } else if (pathname.includes('/payout')) {
    headerTitle = 'Payout';
  } else if (pathname.includes('/profile')) {
    headerTitle = 'My profile';
  } else if (pathname.includes('/messages')) {
    headerTitle = 'Messages';
  }

  // In a real application, you'd load the logged-in user profile here.
  const user = {
    name: 'Alex Okafor',
    role: 'Creator',
    avatar: '',
  };

  return (
    <div className="flex h-dvh w-screen overflow-hidden bg-[#faf9fc] font-sans relative">
      {/* Left fixed Sidebar (desktop) */}
      <div className="hidden md:block">
        <Sidebar user={user} />
      </div>

      {/* Right Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        {!pathname.includes('/news/') && (
          <Header
            user={user}
            title={headerTitle}
            onNotificationClick={() => setIsNotificationOpen(true)}
            onMenuClick={() => setIsMobileMenuOpen(true)}
          />
        )}

        {/* Scrollable Viewport */}
        <main
          className={cn(
            'flex-1 overflow-y-auto select-none bg-[#faf9fc]',
            pathname.includes('/news/') ? 'px-0 py-0' : 'px-4 md:px-8 py-6',
          )}
        >
          {children}
        </main>
      </div>

      {/* Mobile Slide-out Menu Drawer Overlay Backdrop */}
      <div
        onClick={() => setIsMobileMenuOpen(false)}
        className={cn(
          'fixed inset-0 bg-black/40 z-50 transition-opacity duration-300 md:hidden',
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
      />

      {/* Mobile Slide-out Sidebar Menu (Drawer Container) */}
      <div
        className={cn(
          'fixed top-0 bottom-0 left-0 w-[260px] z-50 transition-transform duration-300 ease-in-out md:hidden flex flex-col bg-[#fef2f6] shadow-2xl',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <Sidebar user={user} />
      </div>

      {/* Notification Slide-out Panel Overlay */}
      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </div>
  );
}
