'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X, AlertCircle } from 'lucide-react';
import { WorkCampaign } from '@/components/creator-dashboard/WorkCampaignCard';
import { useRaiseDispute } from '@/hooks/useDisputes';

interface RaiseDisputeModalProps {
  isOpen: boolean;
  campaign: WorkCampaign | null;
  onClose: () => void;
}

export default function RaiseDisputeModal({ isOpen, campaign, onClose }: RaiseDisputeModalProps) {
  const [reason, setReason] = useState('');

  const raiseDisputeMutation = useRaiseDispute(() => {
    setReason('');
    onClose();
    // Redirect to messages page so they see it in the thread list showing "Waiting for admin..."
    window.location.href = '/creator/messages';
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim() || !campaign) return;

    const actualCampaignId = campaign.campaignId || campaign.id;

    raiseDisputeMutation.mutate({
      campaignId: actualCampaignId,
      reason: reason,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-[420px] rounded-[24px] bg-white border border-[#e8e6f0]/60 p-6 flex flex-col gap-5 shadow-xl scrollbar-hide select-none"
      >
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-0.5">
            <DialogTitle className="text-[17px] font-bold text-[#1a1a2e]">
              Raise a Campaign Dispute
            </DialogTitle>
            <p className="text-[11px] font-light text-[#7a7a9a]">
              {campaign?.title ?? 'Zara Summer Style'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#f4f4f8] hover:bg-[#eaeaf0] flex items-center justify-center text-[#7a7a9a] transition-colors border-none cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Warning Block */}
        <div className="bg-[#eff6ff] border border-[#dbeafe] rounded-2xl p-4 flex gap-3 text-left">
          <AlertCircle className="w-5 h-5 text-[#2563eb] shrink-0 mt-0.5" />
          <span className="text-[11px] font-medium text-[#1e40af] leading-relaxed">
            Disputing this campaign will notify Trendupp administrators. They will review the case
            details and mediate communication between you and the brand.
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider">
              Reason for Dispute
            </Label>
            <Textarea
              placeholder="Describe the issue in detail (e.g. brand is unresponsive, terms of brief have changed, etc.)..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="border-[#e8e6f0] text-xs font-light min-h-[100px] focus-visible:ring-brand-pink/30 focus-visible:border-brand-pink rounded-xl p-3 resize-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={!reason.trim() || raiseDisputeMutation.isPending}
            className="w-full bg-brand-pink hover:bg-brand-pink/90 text-white font-semibold text-xs h-11 rounded-2xl shadow-md transition-all active:scale-95 disabled:bg-brand-pink/50 cursor-pointer"
          >
            {raiseDisputeMutation.isPending ? 'Raising...' : 'Submit Dispute'}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
