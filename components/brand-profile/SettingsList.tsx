'use client';

import { Bell, Shield, HelpCircle, ChevronRight } from 'lucide-react';

const SETTINGS_ITEMS = [
  {
    id: 'notifications',
    icon: Bell,
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-500',
    label: 'Notifications',
    sub: 'Push, email & SMS preferences',
  },
  {
    id: 'security',
    icon: Shield,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-500',
    label: 'Privacy & Security',
    sub: 'Visibility, 2FA, password',
  },
  {
    id: 'help',
    icon: HelpCircle,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-500',
    label: 'Help & Support',
    sub: 'FAQs, live chat, contact us',
  },
] as const;

type SettingId = (typeof SETTINGS_ITEMS)[number]['id'];

interface SettingsListProps {
  onOpen: (id: SettingId) => void;
}

export default function SettingsList({ onOpen }: SettingsListProps) {
  return (
    <div className="bg-white border border-[#e8e6f0] rounded-2xl divide-y divide-[#f0eef8] overflow-hidden">
      {SETTINGS_ITEMS.map(({ id, icon: Icon, iconBg, iconColor, label, sub }) => (
        <button
          key={id}
          onClick={() => onOpen(id)}
          className="w-full cursor-pointer flex items-center gap-4 px-5 py-4 hover:bg-[#faf9fc] transition-colors text-left"
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}
          >
            <Icon size={18} className={iconColor} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#1a1a2e]">{label}</p>
            <p className="text-xs text-[#9a99b0] mt-0.5">{sub}</p>
          </div>
          <ChevronRight size={16} className="text-[#c4c2d4] shrink-0" />
        </button>
      ))}
    </div>
  );
}
