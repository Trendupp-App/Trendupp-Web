'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { useUserDetail } from '@/hooks/useProfile';
import { useMySocialImpactApplications } from '@/hooks/useCampaign';
import { isImpactBadgeName, getImpactBadgeNameForTokens } from '@/constants/impactBadges';
import AchievementsHero from '@/components/creator-dashboard/achievements/AchievementsHero';
import ImpactStatsSection from '@/components/creator-dashboard/achievements/ImpactStatsSection';
import ImpactHistoryList from '@/components/creator-dashboard/achievements/ImpactHistoryList';

type Tab = 'overview' | 'history';

export default function AchievementsPage() {
  const { user } = useAuthStore();
  const { data: userDetail } = useUserDetail(user?.id || null);
  const impactUser = userDetail || user;

  const totalTokens = impactUser?.totalTokens ?? 0;
  const currentBadge = isImpactBadgeName(impactUser?.badge)
    ? impactUser.badge
    : getImpactBadgeNameForTokens(totalTokens);

  const [tab, setTab] = useState<Tab>('overview');

  const { data: applications, isLoading: applicationsLoading } = useMySocialImpactApplications(
    'all',
    true,
  );

  const appliedCampaigns = applications?.length ?? 0;

  return (
    <div className="flex flex-col gap-6 w-full pb-12">
      {/* Mobile Page Header */}
      <div className="flex items-center gap-3.5 md:hidden">
        <button
          onClick={() => window.history.back()}
          className="w-9 h-9 rounded-full bg-[#f4f4f8] flex items-center justify-center text-[#1a1a2e] border-none cursor-pointer"
        >
          <ArrowLeft size={16} />
        </button>
        <h1 className="text-lg font-bold text-[#1a1a2e]">Achievements</h1>
      </div>

      {/* Desktop Page Header */}
      <div className="hidden md:flex flex-col gap-1">
        <h1 className="text-[28px] font-bold text-[#1a1a2e] tracking-tight">Achievements</h1>
        <p className="text-sm font-light text-[#7a7a9a]">
          Track your Impact badge progress and Social Impact campaign activity.
        </p>
      </div>

      <AchievementsHero totalTokens={totalTokens} />

      {/* Tabs */}
      <div className="bg-[#f4f3f6] rounded-2xl p-1 flex gap-1 w-full max-w-[340px] text-xs font-semibold text-[#7a7a9a]">
        <button
          onClick={() => setTab('overview')}
          className={cn(
            'py-2.5 flex-1 text-center rounded-xl transition-all cursor-pointer border-none font-semibold',
            tab === 'overview'
              ? 'bg-white text-brand-pink shadow-xs'
              : 'bg-transparent text-[#7a7a9a] hover:text-[#1a1a2e]',
          )}
        >
          Overview
        </button>
        <button
          onClick={() => setTab('history')}
          className={cn(
            'py-2.5 flex-1 text-center rounded-xl transition-all cursor-pointer border-none font-semibold',
            tab === 'history'
              ? 'bg-white text-brand-pink shadow-xs'
              : 'bg-transparent text-[#7a7a9a] hover:text-[#1a1a2e]',
          )}
        >
          History
        </button>
      </div>

      {tab === 'overview' ? (
        <ImpactStatsSection
          appliedCampaigns={appliedCampaigns}
          totalTokens={totalTokens}
          currentBadge={currentBadge}
        />
      ) : (
        <ImpactHistoryList applications={applications} isLoading={applicationsLoading} />
      )}
    </div>
  );
}
