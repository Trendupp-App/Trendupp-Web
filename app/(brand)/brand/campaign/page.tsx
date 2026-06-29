'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import DraftCampaignCard from '@/components/create-campaign/CampaignDraftCard';
import LiveCampaignCard from '@/components/create-campaign/LiveCampaignCard';
import ActiveCampaignCard from '@/components/create-campaign/ActiveCampaignCard';
import CampaignPagination from '@/components/create-campaign/CampaignPagination';
import {
  DRAFT_CAMPAIGNS,
  LIVE_CAMPAIGNS,
  ACTIVE_CAMPAIGNS,
  COMPLETED_CAMPAIGNS,
  type ActiveCampaign,
} from '@/components/create-campaign/CampaignDummyData';

// ── Tab config ────────────────────────────────────────────────────────────────
type MainTab = 'draft' | 'live' | 'active' | 'completed';
type ActiveSubTab = ActiveCampaign['status'] | 'all';

const MAIN_TABS: { id: MainTab; label: string; count: number }[] = [
  { id: 'draft', label: 'Draft', count: DRAFT_CAMPAIGNS.length },
  { id: 'live', label: 'Live', count: LIVE_CAMPAIGNS.length },
  { id: 'active', label: 'Active', count: ACTIVE_CAMPAIGNS.length },
  { id: 'completed', label: 'Completed', count: COMPLETED_CAMPAIGNS.length },
];

const ACTIVE_SUB_TABS: { id: ActiveSubTab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'in_progress', label: 'In progress' },
  { id: 'content_review', label: 'Content review' },
  { id: 'revision', label: 'Revision' },
  { id: 'live_content', label: 'Live content' },
];

export default function BrandCampaignsPage() {
  const [mainTab, setMainTab] = useState<MainTab>('draft');
  const [activeSubTab, setActiveSubTab] = useState<ActiveSubTab>('all');

  // Pagination state per tab
  const [livePage, setLivePage] = useState(1);
  const [liveRows, setLiveRows] = useState(2); // 2 rows × 3 cols = 6 per page
  const [activePage, setActivePage] = useState(1);
  const [activeRows, setActiveRows] = useState(2);

  // Draft delete (local only with dummy data)
  const [drafts, setDrafts] = useState(DRAFT_CAMPAIGNS);

  // ── Derived data ────────────────────────────────────────────────────────────
  const COLS = 3;

  const filteredActive =
    activeSubTab === 'all'
      ? ACTIVE_CAMPAIGNS
      : ACTIVE_CAMPAIGNS.filter((c) => c.status === activeSubTab);

  const livePerPage = liveRows * COLS;
  const liveTotalPages = Math.max(1, Math.ceil(LIVE_CAMPAIGNS.length / livePerPage));
  const paginatedLive = LIVE_CAMPAIGNS.slice((livePage - 1) * livePerPage, livePage * livePerPage);

  const activePerPage = activeRows * COLS;
  const activeTotalPages = Math.max(1, Math.ceil(filteredActive.length / activePerPage));
  const paginatedActive = filteredActive.slice(
    (activePage - 1) * activePerPage,
    activePage * activePerPage,
  );

  const totalCampaigns =
    DRAFT_CAMPAIGNS.length +
    LIVE_CAMPAIGNS.length +
    ACTIVE_CAMPAIGNS.length +
    COMPLETED_CAMPAIGNS.length;

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-[#1a1a2e]">Campaign</h1>
          <p className="text-sm text-[#9a99b0] mt-0.5">{totalCampaigns} new campaigns</p>
        </div>
        <Link
          href="/brand/campaign/create"
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-pink text-white text-sm font-medium rounded-lg hover:bg-brand-pink/90 transition-colors shrink-0 shadow-sm"
        >
          <Plus size={16} />
          New campaign
        </Link>
      </div>

      {/* Main tabs */}
      <div className="border-b border-[#e8e6f0]">
        <div className="flex items-center gap-0">
          {MAIN_TABS.map((tab) => {
            const isActive = mainTab === tab.id;
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
                {tab.count > 0 && (
                  <span
                    className={cn(
                      'text-[10px] font-semibold w-5 h-5 rounded-full flex items-center justify-center',
                      isActive ? 'bg-brand-pink text-white' : 'bg-[#f0eef8] text-[#9a99b0]',
                    )}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Draft tab ─────────────────────────────────────────────────────── */}
      {mainTab === 'draft' && (
        <div className="flex flex-col gap-3">
          {drafts.length === 0 ? (
            <EmptyState message="No draft campaigns yet." />
          ) : (
            drafts.map((c) => (
              <DraftCampaignCard
                key={c.id}
                campaign={c}
                onDelete={(id) => setDrafts((prev) => prev.filter((d) => d.id !== id))}
              />
            ))
          )}
        </div>
      )}

      {/* ── Live tab ──────────────────────────────────────────────────────── */}
      {mainTab === 'live' && (
        <>
          {LIVE_CAMPAIGNS.length === 0 ? (
            <EmptyState message="No live campaigns yet." />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedLive.map((c) => (
                  <LiveCampaignCard key={c.id} campaign={c} />
                ))}
              </div>
              <CampaignPagination
                currentPage={livePage}
                totalPages={liveTotalPages}
                rowsPerPage={liveRows}
                onPageChange={setLivePage}
                onRowsPerPageChange={setLiveRows}
              />
            </>
          )}
        </>
      )}

      {/* ── Active tab ────────────────────────────────────────────────────── */}
      {mainTab === 'active' && (
        <>
          {/* Sub-tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            {ACTIVE_SUB_TABS.map((sub) => (
              <button
                key={sub.id}
                onClick={() => {
                  setActiveSubTab(sub.id);
                  setActivePage(1);
                }}
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

          {paginatedActive.length === 0 ? (
            <EmptyState message="No campaigns in this category." />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedActive.map((c) => (
                  <ActiveCampaignCard key={c.id} campaign={c} />
                ))}
              </div>
              <CampaignPagination
                currentPage={activePage}
                totalPages={activeTotalPages}
                rowsPerPage={activeRows}
                onPageChange={setActivePage}
                onRowsPerPageChange={setActiveRows}
              />
            </>
          )}
        </>
      )}

      {/* ── Completed tab ─────────────────────────────────────────────────── */}
      {mainTab === 'completed' && (
        <div className="flex flex-col gap-3">
          {COMPLETED_CAMPAIGNS.length === 0 ? (
            <EmptyState message="No completed campaigns yet." />
          ) : (
            COMPLETED_CAMPAIGNS.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-4 bg-white border border-[#e8e6f0] rounded-2xl px-5 py-4 opacity-70"
              >
                <div className="w-16 h-16 rounded-xl bg-[#f4f3f8] flex items-center justify-center shrink-0">
                  <Plus size={20} className="text-[#c4c2d4] rotate-45" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#1a1a2e]">{c.title}</p>
                  <p className="text-xs text-[#9a99b0] mt-0.5">
                    {c.niche} · {c.tier}
                  </p>
                  <p className="text-sm font-semibold text-[#1a1a2e] mt-1">
                    ₦{c.budget.toLocaleString('en-NG')}
                  </p>
                </div>
                <span className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full font-medium shrink-0">
                  Completed
                </span>
              </div>
            ))
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
        <Plus size={22} className="text-[#c4c2d4] rotate-45" />
      </div>
      <p className="text-sm text-[#9a99b0]">{message}</p>
    </div>
  );
}
