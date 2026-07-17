// 'use client';

// import Link from 'next/link';
// import Image from 'next/image';
// import { usePathname } from 'next/navigation';
// import { LayoutGrid, Compass, Briefcase, Wallet, User, LogOut, TrendingUp } from 'lucide-react';
// import { cn } from '@/lib/utils';

// interface SidebarProps {
//   user?: {
//     name: string;
//     role: string;
//     avatar: string;
//   };
// }

// const NAV_ITEMS = [
//   { label: 'Home', href: '/creator/dashboard', icon: LayoutGrid },
//   { label: 'Explore', href: '/creator/explore', icon: Compass },
//   { label: 'News', href: '/creator/news', icon: TrendingUp },
//   { label: 'My work', href: '/creator/my-work', icon: Briefcase },
//   { label: 'Payout', href: '/creator/payout', icon: Wallet },
//   { label: 'My profile', href: '/creator/profile', icon: User },
// ];

// export default function Sidebar({
//   user = { name: 'Alex Okafor', role: 'Creator', avatar: '' },
// }: SidebarProps) {
//   const pathname = usePathname();

//   return (
//     <aside className="w-[260px] h-screen bg-[#fef2f6] border-r border-[#fae2ec] flex flex-col justify-between py-6 px-4 shrink-0">
//       <div className="flex flex-col">
//         {/* Logo */}
//         <div className="px-3 mb-6">
//           <Link href="/">
//             <Image src="/logo.svg" alt="Trendupp logo" width={110} height={32} priority />
//           </Link>
//         </div>

//         {/* User profile section */}
//         <div className="flex items-center gap-3 px-3 py-4 mb-6 bg-white/40 rounded-2xl border border-white/20">
//           <div className="relative w-11 h-11 rounded-full overflow-hidden bg-brand-pink-light border border-brand-pink/20 flex items-center justify-center text-brand-pink font-semibold">
//             {user.avatar ? (
//               <Image src={user.avatar} alt={user.name} fill className="object-cover" />
//             ) : (
//               <span>
//                 {user.name
//                   .split(' ')
//                   .map((n) => n[0])
//                   .join('')}
//               </span>
//             )}
//           </div>
//           <div className="flex flex-col">
//             <span className="text-sm font-semibold text-[#1a1a2e]">{user.name}</span>
//             <span className="text-[10px] font-medium text-brand-pink bg-brand-pink-light px-2 py-0.5 rounded-full w-fit mt-0.5">
//               {user.role}
//             </span>
//           </div>
//         </div>

//         {/* Nav Links */}
//         <nav className="flex flex-col gap-1.5">
//           {NAV_ITEMS.map((item) => {
//             const Icon = item.icon;
//             const isActive = pathname === item.href;

//             return (
//               <Link
//                 key={item.label}
//                 href={item.href}
//                 className={cn(
//                   'flex items-center gap-3 px-4 py-3 text-sm rounded-xl transition-all duration-200 group',
//                   isActive
//                     ? 'bg-white text-brand-pink font-medium shadow-[0_2px_8px_-3px_rgba(215,23,111,0.08)]'
//                     : 'text-[#7a7a9a] hover:bg-white/60 hover:text-brand-pink',
//                 )}
//               >
//                 <Icon
//                   size={18}
//                   className={cn(
//                     'transition-colors',
//                     isActive ? 'text-brand-pink' : 'text-[#9a99b0] group-hover:text-brand-pink',
//                   )}
//                 />
//                 {item.label}
//               </Link>
//             );
//           })}
//         </nav>
//       </div>

//       {/* Logout */}
//       <button className="flex items-center gap-3 px-4 py-3 text-sm text-[#7a7a9a] hover:bg-white/60 hover:text-red-500 rounded-xl transition-all duration-200 group w-full text-left">
//         <LogOut size={18} className="text-[#9a99b0] group-hover:text-red-500 transition-colors" />
//         Logout
//       </button>
//     </aside>
//   );
// }

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  Compass,
  Briefcase,
  Wallet,
  User,
  LogOut,
  TrendingUp,
  Megaphone,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const CREATOR_NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/creator/dashboard', icon: LayoutGrid },
  { label: 'Explore', href: '/creator/explore', icon: Compass },
  { label: 'News', href: '/creator/news', icon: TrendingUp },
  { label: 'My work', href: '/creator/my-work', icon: Briefcase },
  { label: 'Payout', href: '/creator/payout', icon: Wallet },
  { label: 'My profile', href: '/creator/profile', icon: User },
];

const BRAND_NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/brand/dashboard', icon: LayoutGrid },
  { label: 'Campaigns', href: '/brand/campaigns', icon: Megaphone },
  { label: 'Explore', href: '/brand/explore', icon: Compass },
  { label: 'News', href: '/brand/news', icon: TrendingUp },
  { label: 'Payout', href: '/brand/payout', icon: Wallet },
  { label: 'My profile', href: '/brand/profile', icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, clearSession } = useAuthStore();

  const isBrand = user?.role === 'brand';
  const navItems = isBrand ? BRAND_NAV_ITEMS : CREATOR_NAV_ITEMS;

  const displayName = user ? `${user.firstName} ${user.lastName}`.trim() : 'User';

  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : 'U';

  const avatarUrl = user?.avatarUrl ?? '';
  const roleLabel = isBrand ? 'Brand' : 'Creator';

  return (
    <aside className="w-[260px] h-screen bg-[#fef2f6] border-r border-[#fae2ec] flex flex-col justify-between py-6 px-4 shrink-0">
      <div className="flex flex-col">
        {/* Logo */}
        <div className="px-3 mb-6">
          <Link href="/">
            <Image src="/logo.svg" alt="Trendupp logo" width={110} height={32} priority />
          </Link>
        </div>

        {/* User profile section */}
        <div className="flex items-center gap-3 px-3 py-4 mb-6 bg-white/40 rounded-2xl border border-white/20">
          <div className="relative w-11 h-11 rounded-full overflow-hidden bg-brand-pink-light border border-brand-pink/20 flex items-center justify-center text-brand-pink font-semibold shrink-0">
            {avatarUrl ? (
              <Image src={avatarUrl} alt={displayName} fill className="object-cover" />
            ) : (
              <span className="text-sm">{initials}</span>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-[#1a1a2e] truncate">{displayName}</span>
            <span className="text-[10px] font-medium text-brand-pink bg-brand-pink-light px-2 py-0.5 rounded-full w-fit mt-0.5">
              {roleLabel}
            </span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 text-sm rounded-xl transition-all duration-200 group',
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
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
      <button
        onClick={clearSession}
        className="flex items-center gap-3 px-4 py-3 text-sm text-[#7a7a9a] hover:bg-white/60 hover:text-red-500 rounded-xl transition-all duration-200 group w-full text-left"
      >
        <LogOut
          size={18}
          className="text-[#9a99b0] group-hover:text-red-500 transition-colors shrink-0"
        />
        Logout
      </button>
    </aside>
  );
}
