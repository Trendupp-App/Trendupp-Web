'use client';

import { useState } from 'react';
import { ChevronLeft, MessageCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDisputes, useDisputeDetails } from '@/hooks/useDisputes';
import { useMyApplications } from '@/hooks/useCampaign';
import type { CampaignApplicationDto } from '@/types/campaign';

export default function MessagesPage() {
  const { data: disputes, isLoading } = useDisputes();
  const [activeDisputeId, setActiveDisputeId] = useState<string | null>(null);
  const { data: activeDispute } = useDisputeDetails(activeDisputeId);
  const { data: myApps } = useMyApplications();

  const getCampaignTitle = (campaignId: string) => {
    const app = myApps?.find(
      (a: CampaignApplicationDto) => a.campaignId === campaignId || a.campaign?.id === campaignId,
    );
    return app?.campaign?.title || `Campaign ${campaignId.slice(0, 8)}`;
  };

  const getBrandName = (campaignId: string) => {
    const app = myApps?.find(
      (a: CampaignApplicationDto) => a.campaignId === campaignId || a.campaign?.id === campaignId,
    );
    if (app?.campaign?.brand) {
      return `${app.campaign.brand.firstName} ${app.campaign.brand.lastName}`;
    }
    return 'Unknown Brand';
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'under_review':
        return 'bg-green-100 text-green-700';
      case 'raised':
        return 'bg-amber-100 text-amber-700 border border-amber-200';
      case 'resolved':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'under_review':
        return 'Active Chat';
      case 'raised':
        return 'Awaiting Approval';
      case 'resolved':
        return 'Resolved';
      default:
        return status;
    }
  };

  const formatDisputeTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${diffDays}d ago`;
    } catch {
      return 'recently';
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden relative select-none h-full w-full">
      {/* 1. Disputes List Pane */}
      <div
        className={cn(
          'w-full md:w-[360px] md:border-r border-[#e8e6f0]/60 flex flex-col bg-white h-full shrink-0 relative transition-all duration-300',
          activeDisputeId !== null ? 'hidden md:flex' : 'flex',
        )}
      >
        {/* Header info */}
        <div className="p-6 border-b border-[#e8e6f0]/60 flex flex-col gap-1 text-left">
          <h2 className="text-xl font-bold text-[#1a1a2e]">Disputes</h2>
          <p className="text-[11px] font-light text-[#7a7a9a]">
            Admin-mediated campaign disputes and resolution
          </p>
        </div>

        {/* Warning notification banner */}
        <div className="px-6 py-4">
          <div className="bg-[#fff0f5] border border-[#fcecf3] rounded-2xl p-4 flex gap-3 text-left">
            <MessageCircle className="w-5 h-5 text-brand-pink shrink-0 mt-0.5" />
            <span className="text-[10.5px] font-medium text-[#8b1a47] leading-relaxed">
              Disputes must be raised from the campaign details view in My Work. Active and pending
              disputes are displayed below.
            </span>
          </div>
        </div>

        {/* Scrollable disputes list */}
        <div className="flex-1 overflow-y-auto px-4 pb-20 flex flex-col gap-2.5 auth-scrollbar">
          {isLoading ? (
            <div className="flex justify-center items-center py-10 text-xs text-[#7a7a9a]">
              Loading disputes...
            </div>
          ) : !disputes || disputes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-[#7a7a9a] gap-2">
              <MessageCircle size={20} className="text-[#9a99b0]" />
              <span className="text-xs">No active disputes found</span>
            </div>
          ) : (
            disputes.map((dispute) => (
              <button
                key={dispute.id}
                onClick={() => setActiveDisputeId(dispute.id)}
                className={cn(
                  'w-full text-left p-4 rounded-[20px] border transition-all flex items-start justify-between gap-3 cursor-pointer group',
                  dispute.id === activeDisputeId
                    ? 'bg-[#fcfafc] border-brand-pink/20 shadow-sm'
                    : 'bg-white border-[#e8e6f0]/50 hover:border-[#dcdbe6]',
                )}
              >
                <div className="flex gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-brand-pink-light flex items-center justify-center text-brand-pink font-extrabold text-sm shrink-0">
                    #
                  </div>

                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-[#1a1a2e] group-hover:text-brand-pink transition-colors">
                        Dispute: {getCampaignTitle(dispute.campaignId)}
                      </span>
                      <span
                        className={cn(
                          'text-[9px] font-bold px-2 py-0.5 rounded-full leading-none whitespace-nowrap',
                          getStatusBadgeClass(dispute.status),
                        )}
                      >
                        {getStatusLabel(dispute.status)}
                      </span>
                    </div>
                    <p className="text-[10.5px] font-light text-[#7a7a9a] truncate mt-1">
                      {dispute.reason}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className="text-[9px] font-medium text-[#9a99b0]">
                    {formatDisputeTime(dispute.createdAt)}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* 2. Messages Threads Chat Pane */}
      <div
        className={cn(
          'flex-1 flex flex-col bg-[#faf9fc] h-full transition-all duration-300 relative',
          activeDisputeId === null ? 'hidden md:flex' : 'flex',
        )}
      >
        {activeDispute ? (
          <div className="flex flex-col h-full w-full">
            {/* Active chat header */}
            <div className="p-4 border-b border-[#e8e6f0]/60 bg-white flex items-center justify-between shadow-sm select-none shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveDisputeId(null)}
                  className="p-1 text-[#7a7a9a] hover:text-[#1a1a2e] md:hidden cursor-pointer"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="w-10 h-10 rounded-full bg-brand-pink-light flex items-center justify-center text-brand-pink font-extrabold text-sm shrink-0">
                  #
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-[#1a1a2e]">
                    Campaign dispute: {getCampaignTitle(activeDispute.campaignId)}
                  </span>
                  <span className="text-[9.5px] font-light text-[#7a7a9a]">
                    Disputed Campaign Escrow • {getBrandName(activeDispute.campaignId)}
                  </span>
                </div>
              </div>
              <span
                className={cn(
                  'text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider leading-none',
                  getStatusBadgeClass(activeDispute.status),
                )}
              >
                {getStatusLabel(activeDispute.status)}
              </span>
            </div>

            {/* Scrollable chat messages area */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 auth-scrollbar bg-white">
              <div className="flex flex-col gap-4 max-w-md mx-auto items-center justify-center py-10 text-center w-full">
                <div className="w-12 h-12 rounded-full bg-[#f4f3f6] flex items-center justify-center text-[#9a99b0]">
                  <AlertCircle size={20} />
                </div>
                <span className="text-xs font-bold text-[#1a1a2e]">Dispute Details</span>
                <div className="text-xs font-light text-[#5a5a7a] bg-[#faf9fc] p-4 rounded-xl text-left border border-[#e8e6f0]/50 w-full">
                  <p className="mb-2">
                    <strong>Dispute ID:</strong> {activeDispute.id.slice(0, 8)}...
                  </p>
                  <p className="mb-2">
                    <strong>Campaign:</strong> {getCampaignTitle(activeDispute.campaignId)}
                  </p>
                  <p className="mb-2">
                    <strong>Brand:</strong> {getBrandName(activeDispute.campaignId)}
                  </p>
                  <p className="mb-2">
                    <strong>Escalated Reason:</strong> {activeDispute.reason}
                  </p>
                  <p className="mb-2">
                    <strong>Current Status:</strong>{' '}
                    <span className="capitalize">{activeDispute.status}</span>
                  </p>
                  {activeDispute.notes && (
                    <p className="mb-2">
                      <strong>Admin Notes:</strong> {activeDispute.notes}
                    </p>
                  )}
                </div>

                {activeDispute.status === 'raised' && (
                  <div className="bg-[#fffbeb] border border-[#fef3c7] rounded-2xl p-4 flex gap-3 text-left w-full mt-2">
                    <AlertCircle className="w-5 h-5 text-[#d97706] shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-1 text-[11px]">
                      <span className="font-bold text-[#b45309]">
                        Waiting for Admin approval...
                      </span>
                      <span className="text-[#b45309]/80 leading-relaxed font-light">
                        This dispute is currently raised. Administrators must review the case
                        details and activate mediation before communication can begin.
                      </span>
                    </div>
                  </div>
                )}

                {activeDispute.status === 'under_review' && (
                  <div className="bg-[#f0fdf4] border border-[#dcfce7] rounded-2xl p-4 flex gap-3 text-left w-full mt-2">
                    <MessageCircle className="w-5 h-5 text-[#16a34a] shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-1 text-[11px]">
                      <span className="font-bold text-[#15803d]">Admin mediation active</span>
                      <span className="text-[#15803d]/80 leading-relaxed font-light">
                        Consent given by administrators. GetStream Chat connection will initialize
                        in Session 2.
                      </span>
                    </div>
                  </div>
                )}

                {activeDispute.status === 'resolved' && (
                  <div className="text-xs font-light text-[#1e40af] bg-[#eff6ff] p-4 rounded-xl text-left border border-[#dbeafe] w-full">
                    <p className="mb-1 font-bold">Dispute Resolved</p>
                    <p className="mb-1">
                      <strong>Action Taken:</strong> {activeDispute.action}
                    </p>
                    {activeDispute.splitCreatorAmount !== null &&
                      activeDispute.splitCreatorAmount !== undefined && (
                        <p className="mb-1">
                          <strong>Split Creator Payout:</strong> {activeDispute.splitCreatorAmount}
                        </p>
                      )}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom text input footer - disabled for now */}
            <div className="p-4 border-t border-[#e8e6f0]/60 bg-[#faf9fc] flex gap-3 select-none shrink-0 justify-center">
              <span className="text-[11.5px] font-light text-[#7a7a9a]">
                Chat inputs will be enabled once GetStream is initialized in Session 2.
              </span>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 select-none">
            <div className="w-14 h-14 rounded-full bg-[#f4f3f6] flex items-center justify-center text-[#9a99b0] mb-4">
              <MessageCircle size={24} />
            </div>
            <span className="text-xs font-bold text-[#1a1a2e]">No dispute selected</span>
            <p className="text-[11px] font-light text-[#7a7a9a] mt-1 text-center max-w-[240px]">
              Select a dispute from the sidebar list to view its details.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
