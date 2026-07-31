'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Compass,
  Briefcase,
  Wallet,
  User,
  LogOut,
  TrendingUp,
  Megaphone,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Trophy,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import UserAvatar from './UserAvatar';
import FeedbackModal from '@/shared/FeedBackModal';
import { useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const CREATOR_NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/creator/dashboard', icon: LayoutDashboard },
  { label: 'Explore', href: '/creator/explore', icon: Compass },
  { label: 'News', href: '/creator/news', icon: TrendingUp },
  { label: 'My Work', href: '/creator/my-work', icon: Briefcase },
  { label: 'Messages', href: '/creator/messages', icon: MessageSquare },
  { label: 'Payout', href: '/creator/payout', icon: Wallet },
  { label: 'Achievements', href: '/creator/achievements', icon: Trophy },
  { label: 'My Profile', href: '/creator/profile', icon: User },
];

const BRAND_NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/brand/dashboard', icon: LayoutDashboard },
  { label: 'Campaigns', href: '/brand/campaign', icon: Megaphone },
  { label: 'Explore', href: '/brand/explore', icon: Compass },
  { label: 'Payout', href: '/brand/payout', icon: Wallet },
  { label: 'My Profile', href: '/brand/profile', icon: User },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function Sidebar({ collapsed = false, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const { user, clearSession } = useAuthStore();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const isBrand = user?.role === 'brand';
  const navItems = isBrand ? BRAND_NAV_ITEMS : CREATOR_NAV_ITEMS;

  const displayName = user ? `${user.username}`.trim() : 'User';

  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : 'U';

  const avatarUrl = user?.avatarUrl ?? '';
  const roleLabel = isBrand ? 'Brand' : 'Creator';

  return (
    <aside
      className={cn(
        'relative h-screen bg-[#fef2f6] border-r border-[#fae2ec] flex flex-col overflow-hidden py-6 px-4 shrink-0 transition-[width] duration-300',
        collapsed ? 'w-20' : 'w-[260px]',
      )}
    >
      <div className="flex flex-col shrink-0">
        {/* Logo + collapse toggle */}
        <div
          className={cn(
            'flex mb-6',
            collapsed ? 'flex-col items-center gap-3' : 'items-center justify-between px-3',
          )}
        >
          <Link href="/">
            {collapsed ? (
              <Image src="/logo-icon.svg" alt="Trendupp logo" width={28} height={25} priority />
            ) : (
              <Image src="/logo.svg" alt="Trendupp logo" width={110} height={32} priority />
            )}
          </Link>
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="flex items-center justify-center w-7 h-7 rounded-full border border-[#fae2ec] bg-white text-[#7a7a9a] shadow-sm hover:text-brand-pink hover:border-brand-pink/40 cursor-pointer transition-colors shrink-0"
            >
              {collapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
            </button>
          )}
        </div>

        {/* User profile section */}
        <div
          className={cn(
            'flex items-center mb-6 bg-white/40 rounded-2xl border border-white/20',
            collapsed ? 'justify-center py-3' : 'gap-3 px-3 py-4',
          )}
        >
          <UserAvatar avatarUrl={avatarUrl} initials={initials} size={collapsed ? 36 : 44} />
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-[#1a1a2e] truncate">{displayName}</span>
              <span className="text-[10px] font-medium text-brand-pink bg-brand-pink-light px-2 py-0.5 rounded-full w-fit mt-0.5">
                {roleLabel}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Nav Links — scrolls internally so it can never push Logout off-screen */}
      <nav className="flex flex-col gap-1.5 flex-1 min-h-0 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

          const link = (
            <Link
              href={item.href}
              className={cn(
                'flex items-center rounded-xl transition-all duration-200 group',
                collapsed ? 'justify-center px-0 py-3' : 'gap-3 px-4 py-3 text-sm',
                isActive
                  ? 'bg-white text-brand-pink font-medium shadow-[0_2px_8px_-3px_rgba(215,23,111,0.08)]'
                  : 'text-[#7a7a9a] hover:bg-white/60 hover:text-brand-pink',
              )}
            >
              <Icon
                size={18}
                className={cn(
                  'transition-colors shrink-0',
                  isActive ? 'text-brand-pink' : 'text-[#9a99b0] group-hover:text-brand-pink',
                )}
              />
              {!collapsed && item.label}
            </Link>
          );

          if (!collapsed) {
            return <div key={item.label}>{link}</div>;
          }

          return (
            <Tooltip key={item.label}>
              <TooltipTrigger asChild>{link}</TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          );
        })}
      </nav>

      {/* Logout — visually set apart from nav items as a distinct, destructive action */}
      <div className="border-t border-[#fae2ec] mt-2 pt-2 shrink-0">
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setShowLogoutConfirm(true)}
                aria-label="Logout"
                className="flex cursor-pointer items-center justify-center px-0 py-3 text-sm text-red-400 bg-red-50/60 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200 group w-full"
              >
                <LogOut size={18} className="transition-colors shrink-0" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Logout</TooltipContent>
          </Tooltip>
        ) : (
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex cursor-pointer items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 bg-red-50/60 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200 group w-full text-left"
          >
            <LogOut size={18} className="transition-colors shrink-0" />
            Logout
          </button>
        )}
      </div>
      {showLogoutConfirm && (
        <FeedbackModal
          icon={LogOut}
          iconColor="text-red-500"
          message={<>Are you sure you want to log out of your account?</>}
          actions={[
            { label: 'cancel', onClick: () => setShowLogoutConfirm(false) },
            {
              label: 'log out',
              variant: 'primary',
              onClick: clearSession,
            },
          ]}
        />
      )}
    </aside>
  );
}
