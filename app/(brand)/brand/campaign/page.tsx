'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FolderOpen, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import DraftCampaignCard from '@/components/create-campaign/CampaignDraftCard';
import DraftCampaignCardSkeleton from '@/components/skeletons/DraftCardSkeleton';
import CampaignCard from '@/components/create-campaign/CampaignCard';
import CampaignCardSkeleton from '@/components/skeletons/CampaignCard';
import { useMyCampaigns } from '@/hooks/useCampaign';

type MainTab = 'draft' | 'live' | 'active' | 'completed';
type ActiveSubTab = 'in_progress' | 'content_review' | 'revision' | 'live_content' | 'all';

const MAIN_TABS: { id: MainTab; label: string }[] = [
  { id: 'draft', label: 'Draft' },
  { id: 'live', label: 'Live' },
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
];

const ACTIVE_SUB_TABS: { id: ActiveSubTab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'in_progress', label: 'In progress' },
  { id: 'content_review', label: 'Content review' },
  { id: 'revision', label: 'Revision' },
  { id: 'live_content', label: 'Live content' },
];

const GRID_SKELETON_COUNT = 6;
const DRAFT_SKELETON_COUNT = 3;

export default function BrandCampaignsPage() {
  const [mainTab, setMainTab] = useState<MainTab>('draft');
  const [activeSubTab, setActiveSubTab] = useState<ActiveSubTab>('all');

  const { data: draftCampaigns = [], isLoading: draftsLoading } = useMyCampaigns(
    'draft',
    mainTab === 'draft',
  );
  const { data: liveCampaigns = [], isLoading: liveLoading } = useMyCampaigns(
    'live',
    mainTab === 'live',
  );
  const { data: activeCampaigns = [], isLoading: activeLoading } = useMyCampaigns(
    'active',
    mainTab === 'active',
  );
  const { data: completedCampaigns = [], isLoading: completedLoading } = useMyCampaigns(
    'completed',
    mainTab === 'completed',
  );

  const filteredActive = activeCampaigns;

  const totalCampaigns =
    draftCampaigns.length +
    liveCampaigns.length +
    activeCampaigns.length +
    completedCampaigns.length;

  const tabCounts: Record<MainTab, number> = {
    draft: draftCampaigns.length,
    live: liveCampaigns.length,
    active: activeCampaigns.length,
    completed: completedCampaigns.length,
  };

  function handleDeleteDraft(id: string) {
    console.log('delete draft', id);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-[#1a1a2e]">Campaign</h1>
          <p className="text-sm text-[#9a99b0] mt-0.5">{totalCampaigns} total campaigns</p>
        </div>
        <Link
          href="/brand/campaign/create"
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-pink text-white text-sm font-medium rounded-lg hover:bg-brand-pink/90 transition-colors shrink-0 shadow-sm"
        >
          <Plus size={16} />
          New campaign
        </Link>
      </div>

      <div className="border-b border-[#e8e6f0]">
        <div className="flex items-center gap-0">
          {MAIN_TABS.map((tab) => {
            const isActive = mainTab === tab.id;
            const count = tabCounts[tab.id];
            return (
              <button
                key={tab.id}
                onClick={() => setMainTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 cursor-pointer text-sm transition-colors border-b-2 -mb-px',
                  isActive
                    ? 'border-brand-pink text-brand-pink font-medium'
                    : 'border-transparent text-[#9a99b0] hover:text-[#1a1a2e]',
                )}
              >
                {tab.label}
                {count > 0 && (
                  <span
                    className={cn(
                      'text-[10px] font-semibold w-5 h-5 rounded-full flex items-center justify-center',
                      isActive ? 'bg-brand-pink text-white' : 'bg-[#f0eef8] text-[#9a99b0]',
                    )}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Draft tab */}
      {mainTab === 'draft' && (
        <div className="flex flex-col gap-3">
          {draftsLoading ? (
            Array.from({ length: DRAFT_SKELETON_COUNT }).map((_, i) => (
              <DraftCampaignCardSkeleton key={i} />
            ))
          ) : draftCampaigns.length === 0 ? (
            <EmptyState message="No draft campaigns yet." />
          ) : (
            draftCampaigns.map((c) => (
              <DraftCampaignCard key={c.id} campaign={c} onDelete={handleDeleteDraft} />
            ))
          )}
        </div>
      )}

      {/* Live tab */}
      {mainTab === 'live' && (
        <>
          {liveLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: GRID_SKELETON_COUNT }).map((_, i) => (
                <CampaignCardSkeleton key={i} />
              ))}
            </div>
          ) : liveCampaigns.length === 0 ? (
            <EmptyState message="No live campaigns yet." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {liveCampaigns.map((c) => (
                <CampaignCard key={c.id} campaign={c} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Active tab */}
      {mainTab === 'active' && (
        <>
          <div className="flex items-center gap-2 flex-wrap">
            {ACTIVE_SUB_TABS.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setActiveSubTab(sub.id)}
                className={cn(
                  'px-4 py-1.5 rounded-full text-sm border transition-colors',
                  activeSubTab === sub.id
                    ? 'bg-brand-pink text-white border-brand-pink font-medium'
                    : 'border-[#e8e6f0] text-[#7a7a9a] hover:border-brand-pink/50 hover:text-brand-pink',
                )}
              >
                {sub.label}
              </button>
            ))}
          </div>

          {activeLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: GRID_SKELETON_COUNT }).map((_, i) => (
                <CampaignCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredActive.length === 0 ? (
            <EmptyState message="No campaigns in this category." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredActive.map((c) => (
                <CampaignCard key={c.id} campaign={c} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Completed tab */}
      {mainTab === 'completed' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {completedLoading ? (
            Array.from({ length: GRID_SKELETON_COUNT }).map((_, i) => (
              <CampaignCardSkeleton key={i} />
            ))
          ) : completedCampaigns.length === 0 ? (
            <EmptyState message="No completed campaigns yet." />
          ) : (
            completedCampaigns.map((c) => <CampaignCard key={c.id} campaign={c} />)
          )}
        </div>
      )}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 rounded-full bg-[#f4f3f8] flex items-center justify-center mb-3">
        <FolderOpen size={22} className="text-brand-pink animate-pulse" />
      </div>
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  );
}
