'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { X, Link2, AlertCircle, AlertTriangle, Ticket, ExternalLink } from 'lucide-react';

interface SocialImpactSubmitLiveLinkModalProps {
  isOpen: boolean;
  campaignTitle: string;
  tokenReward: number;
  deadlineLabel?: string;
  onClose: () => void;
  onSubmit: (liveLink: string) => void;
  isSubmitting?: boolean;
}

export default function SocialImpactSubmitLiveLinkModal({
  isOpen,
  campaignTitle,
  tokenReward,
  deadlineLabel,
  onClose,
  onSubmit,
  isSubmitting = false,
}: SocialImpactSubmitLiveLinkModalProps) {
  const [liveLink, setLiveLink] = useState('');
  const [error, setError] = useState('');

  function handleClose() {
    if (isSubmitting) return;
    setLiveLink('');
    setError('');
    onClose();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!liveLink.trim()) {
      setError('Please enter the live content URL');
      return;
    }
    const normalizedLink = /^https?:\/\//i.test(liveLink) ? liveLink : `https://${liveLink}`;
    try {
      new URL(normalizedLink);
    } catch {
      setError('Please enter a valid URL');
      return;
    }

    onSubmit(liveLink);
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-[420px] rounded-[24px] bg-white border border-[#e8e6f0]/60 p-6 flex flex-col gap-5 shadow-xl select-none"
      >
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-0.5">
            <DialogTitle className="text-[17px] font-bold text-[#1a1a2e]">
              Submit Live Content
            </DialogTitle>
            <p className="text-[11px] font-light text-[#7a7a9a]">{campaignTitle}</p>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="w-7 h-7 rounded-full bg-[#f4f4f8] hover:bg-[#eaeaf0] flex items-center justify-center text-[#7a7a9a] transition-colors border-none cursor-pointer shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <X size={15} />
          </button>
        </div>

        {/* Deadline warning */}
        {deadlineLabel && (
          <div className="bg-[#fffbeb] border border-[#fef3c7] rounded-2xl p-4 flex gap-3 text-left">
            <AlertTriangle className="w-5 h-5 text-[#d97706] shrink-0 mt-0.5" />
            <p className="text-[10.5px] text-[#92600a] font-light leading-relaxed">
              Submit before {deadlineLabel}. Once submitted, your token reward will be credited
              automatically.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider">
              Live Content URL
            </Label>
            <div className="relative">
              <Link2
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9a99b0]"
              />
              <Input
                type="text"
                placeholder="https://instagram.com/p/your-post"
                value={liveLink}
                onChange={(e) => setLiveLink(e.target.value)}
                className="border-[#e8e6f0] h-11 text-xs font-light pl-10 focus-visible:ring-brand-pink/30 focus-visible:border-brand-pink"
              />
            </div>
            {error && (
              <div className="flex items-center gap-1 mt-1 text-[#dc2626] text-[10px]">
                <AlertCircle size={12} />
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between bg-[#f9f8fc] rounded-2xl px-4 py-3">
            <span className="text-xs font-medium text-[#5a5a7a]">Your reward upon submission</span>
            <span className="flex items-center gap-1.5 text-brand-pink font-bold text-sm">
              <Ticket size={14} />
              {tokenReward} Tokens
            </span>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !liveLink.trim()}
            className="w-full bg-brand-pink hover:bg-brand-pink/90 text-white font-semibold text-xs h-11 rounded-2xl shadow-md transition-all active:scale-95 disabled:bg-brand-pink/45 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
          >
            <ExternalLink size={14} />
            {isSubmitting ? 'Submitting…' : 'Submit live content'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
