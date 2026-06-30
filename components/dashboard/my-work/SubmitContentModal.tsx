'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X, Link2, AlertCircle } from 'lucide-react';
import { WorkCampaign } from '@/components/creator-dashboard/WorkCampaignCard';

interface SubmitContentModalProps {
  isOpen: boolean;
  campaign: WorkCampaign | null;
  onClose: () => void;
  onSubmit: (link: string) => void;
}

export default function SubmitContentModal({
  isOpen,
  campaign,
  onClose,
  onSubmit,
}: SubmitContentModalProps) {
  const [link, setLink] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!link.trim()) {
      setError('Please enter a content link');
      return;
    }

    const normalizedLink = /^https?:\/\//i.test(link) ? link : `https://${link}`;
    try {
      new URL(normalizedLink);
    } catch {
      setError('Please enter a valid URL (e.g. https://drive.google.com/...)');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit(link);
      setLink('');
      setNote('');
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
              Submit Content
            </DialogTitle>
            <p className="text-[11px] font-light text-[#7a7a9a]">
              {campaign?.title ?? 'Summer Style Collection'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#f4f4f8] hover:bg-[#eaeaf0] flex items-center justify-center text-[#7a7a9a] transition-colors border-none cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Amber Warning Block */}
        <div className="bg-[#fff9e6] border border-[#ffe0b2] rounded-2xl p-4 flex gap-3 text-left">
          <AlertCircle className="w-5 h-5 text-[#ff9800] shrink-0 mt-0.5" />
          <span className="text-[11px] font-medium text-[#7a5c00] leading-relaxed">
            Submit a Google Drive, YouTube, or Dropbox link to your content. The brand has 48 hours
            to review.
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Content Link Field */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider">
              Content Link *
            </Label>
            <div className="relative">
              <Link2
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9a99b0]"
              />
              <Input
                type="text"
                placeholder="https://drive.google.com/..."
                value={link}
                onChange={(e) => setLink(e.target.value)}
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

          {/* Optional Preview Area */}
          {isLinkFilled && (
            <div className="relative w-full h-[140px] rounded-2xl overflow-hidden bg-black flex items-center justify-center shrink-0 border border-[#e8e6f0]/60">
              <div className="absolute inset-0 bg-[#09052f] opacity-80" />
              <span className="absolute bottom-3 left-3 text-[10px] bg-black/55 text-white font-bold px-2 py-1 rounded-md z-10">
                Preview Loaded
              </span>
              <span className="text-white text-xs font-semibold z-10 opacity-70">
                Draft Content Preview
              </span>
            </div>
          )}

          {/* Note to Brand Field */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider">
              Note to Brand (Optional)
            </Label>
            <Textarea
              placeholder="Any context you'd like to share..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="border-[#e8e6f0] text-xs font-light min-h-[90px] focus-visible:ring-brand-pink/30 focus-visible:border-brand-pink rounded-xl p-3 resize-none"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !isLinkFilled}
            className="w-full bg-brand-pink hover:bg-brand-pink/90 text-white font-semibold text-xs h-11 rounded-2xl shadow-md transition-all active:scale-95 disabled:bg-brand-pink/45 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit for Brand Review'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
