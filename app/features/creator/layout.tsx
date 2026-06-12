'use client';

import { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import NotificationDrawer from '@/components/dashboard/NotificationDrawer';

export default function CreatorLayout({ children }: { children: React.ReactNode }) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // In a real application, you'd load the logged-in user profile here.
  const user = {
    name: 'John Doe',
    role: 'Creator',
    avatar: '',
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f3f2fe] font-sans relative">
      {/* Left fixed Sidebar (desktop) */}
      <div className="hidden md:block">
        <Sidebar user={user} />
      </div>

      {/* Right Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <Header user={user} onNotificationClick={() => setIsNotificationOpen(true)} />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto px-8 py-6 select-none bg-[#f3f2fe]">
          {children}
        </main>
      </div>

      {/* Notification Slide-out Panel Overlay */}
      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </div>
  );
}
