'use client';

import { useState } from 'react';
import { useDisputeDetails, useActivateDispute, useResolveDispute } from '@/hooks/useDisputes';
import { useMyApplications } from '@/hooks/useCampaign';
import type { CampaignApplicationDto } from '@/types/campaign';
import { AlertCircle, CheckCircle, ShieldAlert, Activity, Check } from 'lucide-react';

export default function AdminDisputesPage() {
  const [disputeIdInput, setDisputeIdInput] = useState('');
  const [loadedDisputeId, setLoadedDisputeId] = useState<string | null>(null);

  // Form states for dispute resolution
  const [resolveAction, setResolveAction] = useState<
    'release_to_creator' | 'refund_to_brand' | 'split'
  >('release_to_creator');
  const [resolveNotes, setResolveNotes] = useState('');
  const [splitAmount, setSplitAmount] = useState('');

  const {
    data: dispute,
    isLoading: isDisputeLoading,
    error: disputeError,
  } = useDisputeDetails(loadedDisputeId);
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

  const activateMutation = useActivateDispute();
  const resolveMutation = useResolveDispute();

  const handleLoadDispute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeIdInput.trim()) return;
    setLoadedDisputeId(disputeIdInput.trim());
  };

  const handleActivate = () => {
    if (!loadedDisputeId) return;
    activateMutation.mutate({ id: loadedDisputeId });
  };

  const handleResolveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loadedDisputeId) return;

    const payload: {
      action: 'release_to_creator' | 'refund_to_brand' | 'split';
      notes: string;
      splitCreatorAmount?: number;
    } = {
      action: resolveAction,
      notes: resolveNotes,
    };

    if (resolveAction === 'split') {
      const parsedAmount = parseFloat(splitAmount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return;
      }
      payload.splitCreatorAmount = parsedAmount;
    }

    resolveMutation.mutate({
      id: loadedDisputeId,
      payload,
    });
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'under_review':
        return 'Active Mediation (Under Review)';
      case 'raised':
        return 'Raised (Awaiting Activation)';
      case 'resolved':
        return 'Resolved';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9fc] text-[#1a1a2e] p-6 md:p-12 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white border border-[#e8e6f0]/60 shadow-xl rounded-[32px] p-8 flex flex-col gap-6">
        {/* Title */}
        <div className="flex items-center gap-3 border-b border-[#e8e6f0]/60 pb-6">
          <div className="w-12 h-12 rounded-2xl bg-brand-pink-light flex items-center justify-center text-brand-pink shrink-0">
            <ShieldAlert size={24} />
          </div>
          <div className="flex flex-col text-left">
            <h1 className="text-xl font-bold">Admin Mediation Panel</h1>
            <p className="text-xs font-light text-[#7a7a9a]">
              Emulate administrator mediation activation & controls
            </p>
          </div>
        </div>

        {/* Load Form */}
        <form onSubmit={handleLoadDispute} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5 text-left">
            <label
              htmlFor="admin-disp-id"
              className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider"
            >
              Enter Dispute ID (UUID)
            </label>
            <div className="flex gap-3">
              <input
                id="admin-disp-id"
                type="text"
                placeholder="Paste dispute UUID here..."
                value={disputeIdInput}
                onChange={(e) => setDisputeIdInput(e.target.value)}
                className="flex-1 border border-[#e8e6f0] focus:border-brand-pink rounded-2xl px-4 py-3 text-xs outline-none bg-white text-[#1a1a2e]"
                required
              />
              <button
                type="submit"
                className="bg-brand-pink hover:bg-brand-pink/90 text-white font-bold text-xs px-6 py-3 rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
              >
                Load Dispute
              </button>
            </div>
          </div>
        </form>

        {/* Dispute Details & Actions */}
        {loadedDisputeId && (
          <div className="flex flex-col gap-5 border-t border-[#e8e6f0]/60 pt-6">
            {isDisputeLoading ? (
              <div className="flex items-center justify-center py-10 gap-2 text-xs text-[#7a7a9a]">
                <Activity className="animate-spin" size={16} />
                <span>Fetching dispute details...</span>
              </div>
            ) : disputeError ? (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex gap-3 text-left">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1 text-[11px] text-red-800">
                  <span className="font-bold">Error Loading Dispute</span>
                  <span className="leading-relaxed font-light">
                    The dispute ID provided could not be found or fetched. Please double check the
                    UUID and try again.
                  </span>
                </div>
              </div>
            ) : dispute ? (
              <div className="flex flex-col gap-6 text-left animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="bg-[#faf9fc] border border-[#e8e6f0]/50 p-6 rounded-2xl flex flex-col gap-3 text-xs">
                  <div className="grid grid-cols-3 gap-2">
                    <span className="font-bold text-[#7a7a9a]">Dispute ID:</span>
                    <span className="col-span-2 select-all font-mono text-[#1a1a2e]">
                      {dispute.id}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="font-bold text-[#7a7a9a]">Campaign:</span>
                    <span className="col-span-2 font-semibold text-[#1a1a2e]">
                      {getCampaignTitle(dispute.campaignId)}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="font-bold text-[#7a7a9a]">Brand:</span>
                    <span className="col-span-2 font-semibold text-[#1a1a2e]">
                      {getBrandName(dispute.campaignId)}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="font-bold text-[#7a7a9a]">Reason:</span>
                    <span className="col-span-2 font-light text-[#5a5a7a]">{dispute.reason}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="font-bold text-[#7a7a9a]">Status:</span>
                    <span className="col-span-2 font-bold text-brand-pink">
                      {getStatusLabel(dispute.status)}
                    </span>
                  </div>
                  {dispute.status === 'resolved' && (
                    <>
                      <div className="grid grid-cols-3 gap-2 border-t border-[#e8e6f0]/60 pt-2 mt-1">
                        <span className="font-bold text-[#7a7a9a]">Resolution Action:</span>
                        <span className="col-span-2 font-semibold text-[#1a1a2e] capitalize">
                          {dispute.action?.replace(/_/g, ' ')}
                        </span>
                      </div>
                      {dispute.splitCreatorAmount !== null && (
                        <div className="grid grid-cols-3 gap-2">
                          <span className="font-bold text-[#7a7a9a]">Split Creator Payout:</span>
                          <span className="col-span-2 font-semibold text-[#1a1a2e]">
                            ₦{dispute.splitCreatorAmount}
                          </span>
                        </div>
                      )}
                      {dispute.notes && (
                        <div className="grid grid-cols-3 gap-2">
                          <span className="font-bold text-[#7a7a9a]">Resolution Notes:</span>
                          <span className="col-span-2 font-light text-[#5a5a7a]">
                            {dispute.notes}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Mediation controls based on status */}
                <div className="flex flex-col gap-5 border-t border-[#e8e6f0]/40 pt-5">
                  {dispute.status === 'raised' && (
                    <div className="flex flex-col gap-3">
                      <h2 className="text-xs font-bold text-[#1a1a2e]">Mediation Activation</h2>
                      <p className="text-[10px] text-[#7a7a9a] font-light leading-relaxed">
                        Mediation is not yet active. Activating this dispute will create the
                        GetStream chat channel and notify both creator and brand.
                      </p>
                      <button
                        onClick={handleActivate}
                        disabled={activateMutation.isPending}
                        className="w-full bg-brand-pink hover:bg-brand-pink/90 text-white font-bold text-xs py-3.5 rounded-2xl shadow-md transition-all active:scale-95 disabled:bg-brand-pink/50 cursor-pointer flex items-center justify-center gap-2"
                      >
                        <CheckCircle size={16} />
                        {activateMutation.isPending
                          ? 'Activating Mediation...'
                          : 'Activate Dispute'}
                      </button>
                    </div>
                  )}

                  {dispute.status === 'under_review' && (
                    <form onSubmit={handleResolveSubmit} className="flex flex-col gap-4 text-left">
                      <div className="flex flex-col gap-1">
                        <h2 className="text-xs font-bold text-[#1a1a2e]">
                          Dispute Resolution Decision
                        </h2>
                        <p className="text-[10px] text-[#7a7a9a] font-light leading-relaxed mb-2">
                          Mediation is active. Resolve the dispute by selecting a fund release
                          action. This freezes the chat and unlocks payouts.
                        </p>
                      </div>

                      {/* Action Dropdown */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider">
                          Resolution Action
                        </label>
                        <select
                          value={resolveAction}
                          onChange={(e) =>
                            setResolveAction(
                              e.target.value as 'release_to_creator' | 'refund_to_brand' | 'split',
                            )
                          }
                          className="border border-[#e8e6f0] focus:border-brand-pink rounded-2xl px-4 py-3 text-xs outline-none bg-white text-[#1a1a2e] w-full"
                        >
                          <option value="release_to_creator">Release Escrow to Creator</option>
                          <option value="refund_to_brand">Refund Escrow to Brand</option>
                          <option value="split">Split Escrow Funds</option>
                        </select>
                      </div>

                      {/* Split Amount Field (Conditional) */}
                      {resolveAction === 'split' && (
                        <div className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                          <label className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider">
                            Split Creator Amount (₦)
                          </label>
                          <input
                            type="number"
                            placeholder="Enter amount to release to the Creator..."
                            value={splitAmount}
                            onChange={(e) => setSplitAmount(e.target.value)}
                            required
                            className="border border-[#e8e6f0] focus:border-brand-pink rounded-2xl px-4 py-3 text-xs outline-none bg-white text-[#1a1a2e] w-full"
                          />
                        </div>
                      )}

                      {/* Resolution Notes */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider">
                          Resolution Summary Notes
                        </label>
                        <textarea
                          placeholder="Provide the decision reasoning and summary for both parties..."
                          value={resolveNotes}
                          onChange={(e) => setResolveNotes(e.target.value)}
                          required
                          rows={3}
                          className="border border-[#e8e6f0] focus:border-brand-pink rounded-2xl px-4 py-3 text-xs outline-none bg-white text-[#1a1a2e] w-full resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={resolveMutation.isPending}
                        className="w-full bg-brand-pink hover:bg-brand-pink/90 text-white font-bold text-xs py-3.5 rounded-2xl shadow-md transition-all active:scale-95 disabled:bg-brand-pink/50 cursor-pointer flex items-center justify-center gap-2 mt-2"
                      >
                        <Check size={16} />
                        {resolveMutation.isPending ? 'Resolving Dispute...' : 'Submit Resolution'}
                      </button>
                    </form>
                  )}

                  {dispute.status === 'resolved' && (
                    <div className="bg-[#f0fdf4] border border-[#dcfce7] rounded-2xl p-4 flex gap-3 text-left w-full">
                      <CheckCircle className="w-5 h-5 text-[#16a34a] shrink-0 mt-0.5" />
                      <div className="flex flex-col gap-1 text-[11px] text-[#15803d]">
                        <span className="font-bold">Dispute Resolved</span>
                        <span className="leading-relaxed font-light">
                          This case is fully settled and closed. Escrow funds have been
                          split/released according to the decision decision.
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
