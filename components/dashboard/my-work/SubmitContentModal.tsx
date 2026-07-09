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

  const getEmbedUrl = (url: string) => {
    try {
      const normalized = /^https?:\/\//i.test(url) ? url : `https://${url}`;
      const parsed = new URL(normalized);

      // YouTube
      if (parsed.hostname.includes('youtube.com') || parsed.hostname.includes('youtu.be')) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = normalized.match(regExp);
        if (match && match[2].length === 11) {
          return { type: 'youtube' as const, url: `https://www.youtube.com/embed/${match[2]}` };
        }
      }

      // Google Drive
      if (parsed.hostname.includes('drive.google.com')) {
        const match = normalized.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
        if (match && match[1]) {
          return {
            type: 'drive' as const,
            url: `https://drive.google.com/file/d/${match[1]}/preview`,
          };
        }
      }

      return { type: 'general' as const, url: normalized, hostname: parsed.hostname };
    } catch {
      return null;
    }
  };

  const isLinkFilled = link.trim().length > 0;
  const embedData = isLinkFilled ? getEmbedUrl(link) : null;

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
          {embedData && (
            <div className="relative w-full h-[180px] rounded-2xl overflow-hidden bg-black flex flex-col items-center justify-center shrink-0 border border-[#e8e6f0]/60 shadow-inner">
              {embedData.type === 'youtube' || embedData.type === 'drive' ? (
                <div className="w-full h-full relative">
                  <iframe
                    src={embedData.url}
                    className="w-full h-full border-none"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Content Preview"
                  />
                  <span className="absolute bottom-3 left-3 text-[9px] bg-emerald-600/90 text-white font-bold px-2 py-0.5 rounded-full z-10 shadow-sm backdrop-blur-xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    Live Preload Active
                  </span>
                </div>
              ) : (
                <div className="w-full h-full bg-[#09052f] flex flex-col items-center justify-center p-4 text-center relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#120a59] to-[#040039] opacity-90" />
                  <div className="w-10 h-10 rounded-full bg-brand-pink-light flex items-center justify-center text-brand-pink mb-2 z-10">
                    <Link2 size={18} />
                  </div>
                  <span className="text-white text-xs font-semibold z-10">
                    External Link Preview
                  </span>
                  <span className="text-[10px] text-[#9a99b0] mt-1 z-10 truncate max-w-[90%] font-light">
                    {embedData.hostname}
                  </span>
                  <span className="absolute bottom-3 left-3 text-[9px] bg-brand-pink/90 text-white font-bold px-2 py-0.5 rounded-full z-10 shadow-sm">
                    Link Detected
                  </span>
                </div>
              )}
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
