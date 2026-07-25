'use client';

import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RequestRevisionModalProps {
  creatorName: string;
  isSubmitting?: boolean;
  onClose: () => void;
  onSend: (feedback: string) => void;
}

export default function RequestRevisionModal({
  creatorName,
  isSubmitting = false,
  onClose,
  onSend,
}: RequestRevisionModalProps) {
  const [feedback, setFeedback] = useState('');

  function handleSend() {
    if (!feedback.trim() || isSubmitting) return;
    onSend(feedback.trim());
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl w-full max-w-[480px] p-6 shadow-2xl flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-[#1a1a2e]">Request revision</h3>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-[#9a99b0] hover:text-[#1a1a2e] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X size={18} />
          </button>
        </div>

        {/* Copy */}
        <p className="text-sm text-[#4a4a6a] leading-relaxed">
          Tell <span className="font-semibold text-[#1a1a2e]">{creatorName}</span> what needs to be
          changed. Be specific — they get max 1 revision.
        </p>

        {/* Textarea */}
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          disabled={isSubmitting}
          rows={5}
          placeholder="Please re-film the product close-up — the label isn't visible in the current cut. Also, the hashtag #KFCRamadan2026 is missing from the caption..."
          className="w-full border border-[#e8e6f0] rounded-lg px-4 py-3 text-sm text-[#1a1a2e] resize-none focus:outline-none focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink placeholder:text-[#c4c2d4] disabled:bg-[#faf9fc] disabled:cursor-not-allowed"
        />

        {/* Actions */}
        <div className="flex items-center gap-3 mt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 py-3 rounded-xl text-sm font-light border border-[#e8e6f0] text-[#1a1a2e] hover:bg-[#faf9fc] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSend}
            disabled={!feedback.trim() || isSubmitting}
            className={cn(
              'flex-1 py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2',
              !feedback.trim() || isSubmitting
                ? 'bg-brand-pink/50 text-white/80 cursor-not-allowed'
                : 'bg-brand-pink text-white hover:bg-brand-pink/90 cursor-pointer',
            )}
          >
            {isSubmitting && <Loader2 size={15} className="animate-spin" />}
            {isSubmitting ? 'Sending…' : 'Send request'}
          </button>
        </div>
      </div>
    </div>
  );
}
