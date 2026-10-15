import Link from 'next/link';
import { ArrowRight, Compass, Megaphone } from 'lucide-react';
import { cn } from '@/lib/utils';

const ACTIONS = [
  {
    label: 'Explore',
    description: 'Find campaigns, brands & creators',
    href: '/creator/explore',
    icon: Compass,
    iconClassName: 'bg-brand-pink-light text-brand-pink',
  },
  {
    label: 'My campaigns',
    description: 'Track applications & submissions',
    href: '/creator/my-work',
    icon: Megaphone,
    iconClassName: 'bg-[#eef0ff] text-[#4f46e5]',
  },
];

export default function QuickActions() {
  return (
    <nav
      aria-label="Quick actions"
      className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl"
    >
      {ACTIONS.map(({ label, description, href, icon: Icon, iconClassName }) => (
        <Link
          key={href}
          href={href}
          className="group flex items-center gap-3 p-3.5 bg-white border border-[#e8e6f0] rounded-2xl shadow-[0_1px_2px_rgba(26,26,46,0.04)] hover:border-brand-pink/40 hover:shadow-[0_6px_16px_-8px_rgba(215,23,111,0.25)] hover:-translate-y-0.5 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-brand-pink/40"
        >
          <span
            className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105',
              iconClassName,
            )}
          >
            <Icon size={18} />
          </span>
          <span className="flex flex-col min-w-0 flex-1 text-left">
            <span className="text-sm font-semibold text-[#1a1a2e]">{label}</span>
            <span className="text-xs text-[#9a99b0] truncate">{description}</span>
          </span>
          <ArrowRight
            size={16}
            className="text-[#c9c5de] shrink-0 transition-all duration-200 group-hover:text-brand-pink group-hover:translate-x-0.5"
          />
        </Link>
      ))}
    </nav>
  );
}
