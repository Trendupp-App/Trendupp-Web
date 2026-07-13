'use client';

import { useState, useEffect } from 'react';
import { X, ArrowLeft, Users, TrendingUp, CheckCircle, Wallet, Award } from 'lucide-react';
import { FaTiktok, FaInstagram } from 'react-icons/fa';
import { cn } from '@/lib/utils';
import UserAvatar from '@/shared/UserAvatar';
import { AdminStatusBadge } from '../AdminStatusBadge';

interface CreatorProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  creatorId: string | null;
}

type TabType = 'Overview' | 'Campaign History' | 'Reviews' | 'Notes' | 'Actions';

export default function CreatorProfileDrawer({
  isOpen,
  onClose,
  creatorId,
}: CreatorProfileDrawerProps) {
  const [activeTab, setActiveTab] = useState<TabType>('Overview');

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !creatorId) return null;

  const creatorName = 'Alex Okafor';
  const handle = '@alexokafor';
  const tier = 'Micro';
  const status = 'Pending';

  const metrics = [
    { label: 'Followers', value: '450K', icon: Users, bg: 'bg-[#fdf2f6] text-[#d7176f]' },
    { label: 'Engagement', value: '4.2%', icon: TrendingUp, bg: 'bg-[#edf2fe] text-[#2f63eb]' },
    { label: 'Campaigns', value: '18', icon: CheckCircle, bg: 'bg-[#f0fdf4] text-[#16a34a]' },
    { label: 'Earnings', value: '₦2.4M', icon: Wallet, bg: 'bg-[#fff7ed] text-[#ea580c]' },
    { label: 'Tokens', value: '1200', icon: Award, bg: 'bg-[#f5f3ff] text-[#7c3aed]' },
  ];

  return (
    <div className={cn('fixed inset-0 z-50 flex justify-end transition-opacity duration-300')}>
      <div className="absolute inset-0 bg-black/35 backdrop-blur-[2px]" onClick={onClose} />

      <div
        className={cn(
          'w-full max-w-[620px] h-full bg-white relative z-10 flex flex-col p-6 shadow-2xl transition-transform duration-300 ease-out overflow-y-auto',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* Header toolbar */}
        <div className="flex items-center justify-between border-b border-[#e8e6f0]/40 pb-4 shrink-0">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-xs font-semibold text-[#7a7a9a] hover:text-[#1a1a2e] transition-colors"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#f4f3f6] text-[#5a5a7a] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Creator Summary */}
        <div className="flex flex-col items-center justify-center py-6 border-b border-[#e8e6f0]/40 shrink-0">
          <UserAvatar initials="AO" size={80} />
          <h3 className="text-base font-bold text-[#1a1a2e] mt-3">{creatorName}</h3>
          <span className="text-xs text-[#7a7a9a]">{handle}</span>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#f5f3ff] text-[#7c3aed] border border-[#e0e7ff]">
              {tier}
            </span>
            <AdminStatusBadge status={status.toLowerCase()} />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#e8e6f0]/40 mt-4 overflow-x-auto shrink-0 scrollbar-none">
          {(['Overview', 'Campaign History', 'Reviews', 'Notes', 'Actions'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap',
                activeTab === tab
                  ? 'border-brand-pink text-brand-pink'
                  : 'border-transparent text-[#7a7a9a] hover:text-[#1a1a2e]',
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 mt-6 flex flex-col gap-6 pr-1">
          {activeTab === 'Overview' && (
            <>
              {/* Profile Details */}
              <div className="bg-[#faf9fc] border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-4">
                <h4 className="text-xs font-bold text-[#1a1a2e] uppercase tracking-wider">
                  Profile Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5 text-xs">
                  {[
                    { label: 'Full name', value: 'Alex Okafor' },
                    { label: 'Email', value: 'amara@email.com' },
                    { label: 'Country of residence', value: 'Nigeria' },
                    { label: 'State', value: 'Lagos' },
                    { label: 'Nationality', value: 'Nigeria' },
                    {
                      label: 'Bio',
                      value:
                        'Fashion content creator passionate about African aesthetics and modern style.',
                      span: true,
                    },
                    { label: 'Profile Completion', value: '100%' },
                    { label: 'Bank Account', value: 'Verified', color: 'text-[#16a34a] font-bold' },
                    { label: 'Date Joined', value: 'Jan 15, 2026' },
                    { label: 'Account Status', value: 'Active', badge: true },
                  ].map((field, idx) => (
                    <div
                      key={idx}
                      className={cn('flex flex-col gap-1', field.span && 'sm:col-span-2')}
                    >
                      <span className="text-[#9a99b0] text-[10px] font-semibold uppercase">
                        {field.label}
                      </span>
                      {field.badge ? (
                        <div className="w-fit">
                          <AdminStatusBadge status="active" />
                        </div>
                      ) : (
                        <span
                          className={cn('text-[#1a1a2e] font-medium leading-relaxed', field.color)}
                        >
                          {field.value}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Metrics */}
              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-bold text-[#1a1a2e] uppercase tracking-wider">
                  Metrics
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {metrics.map((m, idx) => {
                    const Icon = m.icon;
                    return (
                      <div
                        key={idx}
                        className="bg-white border border-[#e8e6f0]/60 rounded-2xl p-3.5 flex flex-col items-center justify-center text-center gap-1"
                      >
                        <div
                          className={cn(
                            'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                            m.bg,
                          )}
                        >
                          <Icon size={14} className="stroke-[2.5]" />
                        </div>
                        <span className="text-sm font-bold text-[#1a1a2e] mt-1">{m.value}</span>
                        <span className="text-[9px] text-[#9a99b0] font-medium uppercase tracking-wider">
                          {m.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Social Accounts */}
              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-bold text-[#1a1a2e] uppercase tracking-wider">
                  Social Accounts
                </h4>
                <div className="flex flex-col gap-3">
                  {/* Connected Instagram */}
                  <div className="flex items-center gap-3.5 p-3.5 bg-white border border-[#e8e6f0]/60 rounded-2xl">
                    <div className="w-8 h-8 rounded-full bg-[#fdf2f6] text-[#d7176f] flex items-center justify-center shrink-0">
                      <FaInstagram size={14} />
                    </div>
                    <div className="flex flex-col flex-1 min-w-0 text-xs">
                      <span className="font-bold text-[#1a1a2e]">@alexokafor</span>
                      <span className="text-[10px] text-[#9a99b0] font-medium">
                        28.6K · Last synced: Today
                      </span>
                    </div>
                  </div>

                  {/* Unconnected TikTok */}
                  <div className="flex items-center gap-3.5 p-3.5 bg-white border border-[#e8e6f0]/60 rounded-2xl">
                    <div className="w-8 h-8 rounded-full bg-[#f4f3f6] text-[#7a7a9a] flex items-center justify-center shrink-0">
                      <FaTiktok size={13} />
                    </div>
                    <div className="flex flex-col flex-1 min-w-0 text-xs">
                      <span className="font-bold text-[#9a99b0]">TikTok</span>
                      <span className="text-[10px] text-[#dc2626] font-semibold">
                        Not connected
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab !== 'Overview' && (
            <div className="flex flex-col items-center justify-center py-16 text-[#9a99b0] gap-2">
              <span className="text-sm">No {activeTab.toLowerCase()} data found</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
