'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { X, Link2, AlertCircle, Clock, Plus } from 'lucide-react';
import { WorkCampaign } from '@/components/creator-dashboard/WorkCampaignCard';

interface SubmitProofModalProps {
  isOpen: boolean;
  campaign: WorkCampaign | null;
  onClose: () => void;
  onSubmit: (link: string) => void;
}

export default function SubmitProofModal({
  isOpen,
  campaign,
  onClose,
  onSubmit,
}: SubmitProofModalProps) {
  const [link, setLink] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!link.trim()) {
      setError('Please enter the live post link');
      return;
    }

    const normalizedLink = /^https?:\/\//i.test(link) ? link : `https://${link}`;
    try {
      new URL(normalizedLink);
    } catch {
      setError('Please enter a valid URL');
      return;
    }

    if (!isConfirmed) {
      setError('You must confirm the 3-month live requirement');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit(link);
      setLink('');
      setIsConfirmed(false);
      setIsSubmitting(false);
      onClose();
    }, 1200);
  };

  const isLinkFilled = link.trim().length > 0;

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
              Submit Proof of Posting
            </DialogTitle>
            <p className="text-[11px] font-light text-[#7a7a9a]">
              {campaign?.title ?? 'Healthy Living Challenge'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#f4f4f8] hover:bg-[#eaeaf0] flex items-center justify-center text-[#7a7a9a] transition-colors border-none cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Pink Warning Block */}
        <div className="bg-[#fff0f5] border border-[#fcecf3] rounded-2xl p-4 flex gap-3 text-left">
          <Clock className="w-5 h-5 text-brand-pink shrink-0 mt-0.5" />
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-bold text-brand-pink">3 months Live Requirement</span>
            <p className="text-[10.5px] text-[#7a7a9a] font-light leading-relaxed">
              Your post must remain live on {campaign?.platform ?? 'YouTube'} for at least 3 months
              before payment is released from escrow. Do not delete or archive it.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Post URL Field */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider">
              Post URL *
            </Label>
            <div className="relative">
              <Link2
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9a99b0]"
              />
              <Input
                type="text"
                placeholder={`https://${(campaign?.platform ?? 'youtube').toLowerCase()}.com/...`}
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="border-[#e8e6f0] h-11 text-xs font-light pl-10 focus-visible:ring-brand-pink/30 focus-visible:border-brand-pink"
              />
            </div>
            <span className="text-[10px] text-[#9a99b0] font-light mt-0.5">
              If the link is broken or invalid, you have 24hrs to resubmit.
            </span>
            {error && (
              <div className="flex items-center gap-1 mt-1 text-[#dc2626] text-[10px]">
                <AlertCircle size={12} />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Add another platform link button */}
          <button
            type="button"
            className="w-full border border-dashed border-brand-pink/60 hover:bg-brand-pink-light/30 text-brand-pink text-xs font-semibold py-3 rounded-2xl flex items-center justify-center gap-1.5 transition-all focus:outline-none cursor-pointer"
          >
            <Plus size={14} />
            Add another platform link
          </button>

          {/* Confirmation Checkbox */}
          <div className="flex items-start gap-3 mt-1.5">
            <input
              type="checkbox"
              id="confirm-live"
              checked={isConfirmed}
              onChange={(e) => setIsConfirmed(e.target.checked)}
              className="w-4.5 h-4.5 rounded border-[#e8e6f0] text-brand-pink focus:ring-brand-pink/30 cursor-pointer mt-0.5 accent-brand-pink"
            />
            <label
              htmlFor="confirm-live"
              className="text-[10.5px] text-[#5a5a7a] font-light leading-relaxed cursor-pointer select-none"
            >
              I confirm the post is live and I will keep it up for at least 3 months. I understand I
              will be banned from Trendupp App if I default.
            </label>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !isLinkFilled || !isConfirmed}
            className="w-full bg-brand-pink hover:bg-brand-pink/90 text-white font-semibold text-xs h-11 rounded-2xl shadow-md transition-all active:scale-95 disabled:bg-brand-pink/45 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Proof of Posting'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
