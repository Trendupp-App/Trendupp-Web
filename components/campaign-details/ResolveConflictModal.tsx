'use client';

import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Portal } from '@/components/ui/portal';

interface ResolveConflictModalProps {
  creatorName: string;
  isSubmitting?: boolean;
  onClose: () => void;
  onSend: (reason: string) => void;
}

export default function ResolveConflictModal({
  creatorName,
  isSubmitting = false,
  onClose,
  onSend,
}: ResolveConflictModalProps) {
  const [reason, setReason] = useState('');

  function handleSend() {
    if (!reason.trim() || isSubmitting) return;
    onSend(reason.trim());
  }

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
        <div className="bg-white rounded-2xl w-full max-w-[480px] p-6 shadow-2xl flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold text-[#1a1a2e]">Raise a dispute</h3>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="text-[#9a99b0] hover:text-[#1a1a2e] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X size={18} />
            </button>
          </div>

          <p className="text-sm text-[#4a4a6a] leading-relaxed">
            The revision has already been used for{' '}
            <span className="font-semibold text-[#1a1a2e]">{creatorName}</span>&apos;s submission.
            If this still doesn&apos;t meet requirements, our team will step in to mediate. Explain
            what&apos;s still wrong below.
          </p>

          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={isSubmitting}
            rows={5}
            placeholder="Describe why this submission still doesn't meet the campaign requirements..."
            className="w-full border border-[#e8e6f0] rounded-lg px-4 py-3 text-sm text-[#1a1a2e] resize-none focus:outline-none focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink placeholder:text-[#c4c2d4] disabled:bg-[#faf9fc] disabled:cursor-not-allowed"
          />

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
              disabled={!reason.trim() || isSubmitting}
              className={cn(
                'flex-1 py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2',
                !reason.trim() || isSubmitting
                  ? 'bg-brand-pink/50 text-white/80 cursor-not-allowed'
                  : 'bg-brand-pink text-white hover:bg-brand-pink/90 cursor-pointer',
              )}
            >
              {isSubmitting && <Loader2 size={15} className="animate-spin" />}
              {isSubmitting ? 'Submitting…' : 'Raise dispute'}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
