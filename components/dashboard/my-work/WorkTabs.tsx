'use client';

import { cn } from '@/lib/utils';

export type PrimaryTab = 'Active' | 'Applied' | 'Done' | 'Paused/Cancelled' | 'Social impact';

interface WorkTabsProps {
  activeTab: PrimaryTab;
  onTabChange: (tab: PrimaryTab) => void;
  activeSubFilter: string;
  onSubFilterChange: (subFilter: string) => void;
  counts: {
    active: number;
    applied: number;
    done: number;
    pausedCancelled: number;
    socialImpact: number;
    activeSub: {
      All: number;
      'In Progress': number;
      'Pending Approval': number;
      Revision: number;
      Approved: number;
    };
    appliedSub: {
      All: number;
      Accepted: number;
      Pending: number;
      Rejected: number;
    };
    pausedCancelledSub: {
      All: number;
      Paused: number;
      Cancelled: number;
    };
    socialImpactSub: {
      All: number;
      Pending: number;
      Accepted: number;
      Rejected: number;
    };
  };
}

export default function WorkTabs({
  activeTab,
  onTabChange,
  activeSubFilter,
  onSubFilterChange,
  counts,
}: WorkTabsProps) {
  const activeSubPills = [
    { label: 'All', count: counts.activeSub.All },
    { label: 'In Progress', count: counts.activeSub['In Progress'] },
    { label: 'Pending Approval', count: counts.activeSub['Pending Approval'] },
    { label: 'Revision', count: counts.activeSub.Revision },
    { label: 'Approved', count: counts.activeSub.Approved },
  ];

  const appliedSubPills = [
    { label: 'All', count: counts.appliedSub.All },
    { label: 'Accepted', count: counts.appliedSub.Accepted },
    { label: 'Pending', count: counts.appliedSub.Pending },
    { label: 'Rejected', count: counts.appliedSub.Rejected },
  ];

  const pausedCancelledSubPills = [
    { label: 'All', count: counts.pausedCancelledSub.All },
    { label: 'Paused', count: counts.pausedCancelledSub.Paused },
    { label: 'Cancelled', count: counts.pausedCancelledSub.Cancelled },
  ];

  const socialImpactSubPills = [
    { label: 'All', count: counts.socialImpactSub.All },
    { label: 'Pending', count: counts.socialImpactSub.Pending },
    { label: 'Accepted', count: counts.socialImpactSub.Accepted },
    { label: 'Rejected', count: counts.socialImpactSub.Rejected },
  ];

  return (
    <div className="flex flex-col gap-4 w-full select-none">
      {/* Primary Tabs */}
      <div className="flex border-b border-[#e8e6f0]/60 w-full shrink-0">
        <button
          onClick={() => {
            onTabChange('Active');
            onSubFilterChange('All');
          }}
          className={cn(
            'flex-1 md:flex-none text-center pb-3 text-sm font-semibold transition-all border-b-2 px-6 focus:outline-none cursor-pointer',
            activeTab === 'Active'
              ? 'border-brand-pink text-brand-pink'
              : 'border-transparent text-[#7a7a9a] hover:text-[#5a5a7a]',
          )}
        >
          Active ({counts.active})
        </button>
        <button
          onClick={() => {
            onTabChange('Applied');
            onSubFilterChange('All');
          }}
          className={cn(
            'flex-1 md:flex-none text-center pb-3 text-sm font-semibold transition-all border-b-2 px-6 focus:outline-none cursor-pointer',
            activeTab === 'Applied'
              ? 'border-brand-pink text-brand-pink'
              : 'border-transparent text-[#7a7a9a] hover:text-[#5a5a7a]',
          )}
        >
          Applied ({counts.applied})
        </button>
        <button
          onClick={() => {
            onTabChange('Done');
            onSubFilterChange('All');
          }}
          className={cn(
            'flex-1 md:flex-none text-center pb-3 text-sm font-semibold transition-all border-b-2 px-6 focus:outline-none cursor-pointer',
            activeTab === 'Done'
              ? 'border-brand-pink text-brand-pink'
              : 'border-transparent text-[#7a7a9a] hover:text-[#5a5a7a]',
          )}
        >
          Done ({counts.done})
        </button>
        <button
          onClick={() => {
            onTabChange('Paused/Cancelled');
            onSubFilterChange('All');
          }}
          className={cn(
            'flex-1 md:flex-none text-center pb-3 text-sm font-semibold transition-all border-b-2 px-6 focus:outline-none cursor-pointer',
            activeTab === 'Paused/Cancelled'
              ? 'border-brand-pink text-brand-pink'
              : 'border-transparent text-[#7a7a9a] hover:text-[#5a5a7a]',
          )}
        >
          Paused/Cancelled ({counts.pausedCancelled})
        </button>
        <button
          onClick={() => {
            onTabChange('Social impact');
            onSubFilterChange('All');
          }}
          className={cn(
            'flex-1 md:flex-none text-center pb-3 text-sm font-semibold transition-all border-b-2 px-6 focus:outline-none cursor-pointer',
            activeTab === 'Social impact'
              ? 'border-brand-pink text-brand-pink'
              : 'border-transparent text-[#7a7a9a] hover:text-[#5a5a7a]',
          )}
        >
          Social impact ({counts.socialImpact})
        </button>
      </div>

      {/* Secondary Sub-Pills */}
      <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide py-1 w-full shrink-0">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {activeTab === 'Active' &&
            activeSubPills.map((pill) => (
              <button
                key={pill.label}
                onClick={() => onSubFilterChange(pill.label)}
                className={cn(
                  'px-4 py-2 h-9 text-xs font-semibold rounded-full border transition-all whitespace-nowrap focus:outline-none cursor-pointer flex items-center justify-center',
                  activeSubFilter === pill.label
                    ? 'bg-brand-pink text-white border-brand-pink shadow-[0_2px_8px_rgba(215,23,111,0.15)]'
                    : 'bg-white text-[#7a7a9a] border-[#e8e6f0]/70 hover:border-brand-pink/30 hover:text-brand-pink',
                )}
              >
                {pill.label} ({pill.count})
              </button>
            ))}

          {activeTab === 'Applied' &&
            appliedSubPills.map((pill) => (
              <button
                key={pill.label}
                onClick={() => onSubFilterChange(pill.label)}
                className={cn(
                  'px-4 py-2 h-9 text-xs font-semibold rounded-full border transition-all whitespace-nowrap focus:outline-none cursor-pointer flex items-center justify-center',
                  activeSubFilter === pill.label
                    ? 'bg-brand-pink text-white border-brand-pink shadow-[0_2px_8px_rgba(215,23,111,0.15)]'
                    : 'bg-white text-[#7a7a9a] border-[#e8e6f0]/70 hover:border-brand-pink/30 hover:text-brand-pink',
                )}
              >
                {pill.label} ({pill.count})
              </button>
            ))}

          {activeTab === 'Paused/Cancelled' &&
            pausedCancelledSubPills.map((pill) => (
              <button
                key={pill.label}
                onClick={() => onSubFilterChange(pill.label)}
                className={cn(
                  'px-4 py-2 h-9 text-xs font-semibold rounded-full border transition-all whitespace-nowrap focus:outline-none cursor-pointer flex items-center justify-center',
                  activeSubFilter === pill.label
                    ? 'bg-brand-pink text-white border-brand-pink shadow-[0_2px_8px_rgba(215,23,111,0.15)]'
                    : 'bg-white text-[#7a7a9a] border-[#e8e6f0]/70 hover:border-brand-pink/30 hover:text-brand-pink',
                )}
              >
                {pill.label} ({pill.count})
              </button>
            ))}

          {activeTab === 'Social impact' &&
            socialImpactSubPills.map((pill) => (
              <button
                key={pill.label}
                onClick={() => onSubFilterChange(pill.label)}
                className={cn(
                  'px-4 py-2 h-9 text-xs font-semibold rounded-full border transition-all whitespace-nowrap focus:outline-none cursor-pointer flex items-center justify-center',
                  activeSubFilter === pill.label
                    ? 'bg-brand-pink text-white border-brand-pink shadow-[0_2px_8px_rgba(215,23,111,0.15)]'
                    : 'bg-white text-[#7a7a9a] border-[#e8e6f0]/70 hover:border-brand-pink/30 hover:text-brand-pink',
                )}
              >
                {pill.label} ({pill.count})
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
