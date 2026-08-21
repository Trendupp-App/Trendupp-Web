'use client';

import { useState } from 'react';
import { X, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DisputeCreatorOption {
  id: string;
  name: string;
}

interface RaiseDisputeModalProps {
  creators: DisputeCreatorOption[];
  isSubmitting?: boolean;
  onClose: () => void;
  onSend: (creatorId: string, reason: string) => void;
}

export default function RaiseDisputeModal({
  creators,
  isSubmitting = false,
  onClose,
  onSend,
}: RaiseDisputeModalProps) {
  const [creatorId, setCreatorId] = useState(creators.length === 1 ? creators[0].id : '');
  const [reason, setReason] = useState('');

  function handleSend() {
    if (!creatorId || !reason.trim() || isSubmitting) return;
    onSend(creatorId, reason.trim());
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl w-full max-w-[480px] p-6 shadow-2xl flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-[#1a1a2e]">Raise a campaign dispute</h3>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-[#9a99b0] hover:text-[#1a1a2e] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X size={18} />
          </button>
        </div>

        <div className="bg-[#eff6ff] border border-[#dbeafe] rounded-2xl p-4 flex gap-3 text-left">
          <AlertCircle className="w-5 h-5 text-[#2563eb] shrink-0 mt-0.5" />
          <span className="text-xs text-[#1e40af] leading-relaxed">
            Disputing this campaign will notify Trendupp administrators. They will review the case
            details and mediate communication between you and the creator.
          </span>
        </div>

        {creators.length > 1 && (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#7a7a9a] uppercase tracking-wide">
              Creator
            </label>
            <select
              value={creatorId}
              onChange={(e) => setCreatorId(e.target.value)}
              disabled={isSubmitting}
              className="w-full border border-[#e8e6f0] rounded-lg px-4 py-3 text-sm text-[#1a1a2e] focus:outline-none focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink disabled:bg-[#faf9fc] disabled:cursor-not-allowed"
            >
              <option value="" disabled>
                Select a creator
              </option>
              {creators.map((creator) => (
                <option key={creator.id} value={creator.id}>
                  {creator.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          disabled={isSubmitting}
          rows={5}
          placeholder="Describe the issue in detail (e.g. creator is unresponsive, delivered content doesn't match the brief, etc.)..."
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
            disabled={!creatorId || !reason.trim() || isSubmitting}
            className={cn(
              'flex-1 py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2',
              !creatorId || !reason.trim() || isSubmitting
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
  );
}
