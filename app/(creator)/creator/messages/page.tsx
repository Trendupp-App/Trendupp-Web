'use client';

import { useState } from 'react';
import { ChevronLeft, MessageCircle, AlertCircle, Plus, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDisputes, useDisputeDetails, useRaiseDispute } from '@/hooks/useDisputes';
import { useMyApplications } from '@/hooks/useCampaign';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { CampaignApplicationDto } from '@/types/campaign';

export default function MessagesPage() {
  const { data: disputes, isLoading } = useDisputes();
  const [activeDisputeId, setActiveDisputeId] = useState<string | null>(null);
  const { data: activeDispute } = useDisputeDetails(activeDisputeId);

  // New dispute modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState('');
  const [disputeReason, setDisputeReason] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const { data: myApps } = useMyApplications();

  const raiseDisputeMutation = useRaiseDispute(() => {
    setIsModalOpen(false);
    setSelectedCampaignId('');
    setDisputeReason('');
    setShowSuccess(true);
  });

  const handleCreateDispute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaignId || !disputeReason.trim()) return;
    raiseDisputeMutation.mutate({
      campaignId: selectedCampaignId,
      reason: disputeReason,
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'under_review':
        return 'bg-green-100 text-green-700';
      case 'raised':
        return 'bg-blue-100 text-blue-700';
      case 'resolved':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'under_review':
        return 'Under Review';
      case 'raised':
        return 'Raised';
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
            Admin-mediated campaign chats and support
          </p>
        </div>

        {/* Warning notification banner */}
        <div className="px-6 py-4">
          <div className="bg-[#fff0f5] border border-[#fcecf3] rounded-2xl p-4 flex gap-3 text-left">
            <MessageCircle className="w-5 h-5 text-brand-pink shrink-0 mt-0.5" />
            <span className="text-[10.5px] font-medium text-[#8b1a47] leading-relaxed">
              Campaign chats with advertisers are opened by Trendupp when needed. Tap the + button
              to raise a campaign dispute.
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
                        Dispute: {dispute.campaignId.slice(0, 8)}
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

        {/* Floating action button (FAB) */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="absolute bottom-6 right-6 w-12 h-12 bg-brand-pink hover:bg-brand-pink/90 text-white rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 cursor-pointer z-10"
          aria-label="Raise dispute"
        >
          <Plus size={22} />
        </button>
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
                    Campaign dispute: {activeDispute.campaignId.slice(0, 8)}
                  </span>
                  <span className="text-[9.5px] font-light text-[#7a7a9a]">
                    Disputed Campaign Escrow
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
                    <strong>Dispute ID:</strong> {activeDispute.id}
                  </p>
                  <p className="mb-2">
                    <strong>Campaign ID:</strong> {activeDispute.campaignId}
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
                  <p className="text-[11px] font-light text-[#7a7a9a]">
                    This dispute is currently raised. Please wait for an administrator to activate
                    mediation and open the chat channel.
                  </p>
                )}

                {activeDispute.status === 'under_review' && (
                  <p className="text-[11px] font-light text-[#7a7a9a]">
                    The dispute is under review. GetStream Chat connection will load in the next
                    session.
                  </p>
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

      {/* 3. New Dispute Modal Dialog Form */}
      <Dialog open={isModalOpen} onOpenChange={(open) => !open && setIsModalOpen(false)}>
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-[420px] rounded-[24px] bg-white border border-[#e8e6f0]/60 p-6 flex flex-col gap-5 shadow-xl select-none"
        >
          {/* Header */}
          <div className="flex justify-between items-start">
            <DialogTitle className="text-[17px] font-bold text-[#1a1a2e]">
              Raise a Campaign Dispute
            </DialogTitle>
            <button
              onClick={() => setIsModalOpen(false)}
              className="w-7 h-7 rounded-full bg-[#f4f4f8] hover:bg-[#eaeaf0] flex items-center justify-center text-[#7a7a9a] transition-colors border-none cursor-pointer"
            >
              <X size={15} />
            </button>
          </div>

          {/* Blue Warning Block */}
          <div className="bg-[#eff6ff] border border-[#dbeafe] rounded-2xl p-4 flex gap-3 text-left">
            <AlertCircle className="w-5 h-5 text-[#2563eb] shrink-0 mt-0.5" />
            <span className="text-[11px] font-medium text-[#1e40af] leading-relaxed">
              Disputing this campaign will notify Trendupp administrators. They will review the case
              details and mediate communication between you and the brand.
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleCreateDispute} className="flex flex-col gap-4">
            {/* Campaign Select */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider">
                Select Disputed Campaign
              </Label>
              <div className="relative">
                <select
                  value={selectedCampaignId}
                  onChange={(e) => setSelectedCampaignId(e.target.value)}
                  className="border border-[#e8e6f0] focus:border-brand-pink rounded-xl p-3 text-xs w-full outline-none appearance-none bg-white text-[#1a1a2e] pr-8 cursor-pointer"
                  required
                >
                  <option value="">-- Choose a Campaign --</option>
                  {myApps?.map((app: CampaignApplicationDto) => {
                    if (!app.campaign) return null;
                    const brandName = app.campaign.brand
                      ? `${app.campaign.brand.firstName} ${app.campaign.brand.lastName}`
                      : 'Unknown Brand';
                    return (
                      <option key={app.campaign.id} value={app.campaign.id}>
                        {app.campaign.title} ({brandName})
                      </option>
                    );
                  })}
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#7a7a9a]">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Reason Textarea */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider">
                Reason for Dispute
              </Label>
              <Textarea
                placeholder="Describe the issue in detail (e.g. brand is unresponsive, terms of brief have changed, etc.)..."
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                className="border-[#e8e6f0] text-xs font-light min-h-[100px] focus-visible:ring-brand-pink/30 focus-visible:border-brand-pink rounded-xl p-3 resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={
                !selectedCampaignId || !disputeReason.trim() || raiseDisputeMutation.isPending
              }
              className="w-full bg-brand-pink hover:bg-brand-pink/90 text-white font-semibold text-xs h-11 rounded-2xl shadow-md transition-all active:scale-95 disabled:bg-brand-pink/50 cursor-pointer"
            >
              {raiseDisputeMutation.isPending ? 'Raising...' : 'Submit Dispute'}
            </button>
          </form>
        </DialogContent>
      </Dialog>

      {/* 4. Chat Request Sent Successfully Full-page Overlay */}
      {showSuccess && (
        <div className="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center p-8 text-center select-none animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-[#dcfce7] border border-[#bbf7d0] text-[#16a34a] flex items-center justify-center mb-6">
            <Check size={32} strokeWidth={2.5} />
          </div>

          <h3 className="text-xl font-bold text-[#1a1a2e] mb-2">Dispute Raised Successfully</h3>
          <p className="text-xs font-light text-[#7a7a9a] leading-relaxed max-w-[280px] mb-8">
            Your dispute has been raised. A Trendupp admin will review the details and mediate
            shortly.
          </p>

          <button
            onClick={() => setShowSuccess(false)}
            className="bg-brand-pink hover:bg-brand-pink/90 text-white font-bold text-xs py-3.5 px-8 rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer w-full max-w-[280px]"
          >
            Back to Messages
          </button>
        </div>
      )}
    </div>
  );
}
