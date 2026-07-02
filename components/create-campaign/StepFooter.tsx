'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepFooterProps {
  onBack: () => void;
  onSaveDraft?: () => void;
  onContinue: () => void;
  continueLabel?: string;
  continueDisabled?: boolean;
  isLoading?: boolean;
  hideSaveDraft?: boolean;
}

export default function StepFooter({
  onBack,
  onSaveDraft,
  onContinue,
  continueLabel = 'Continue',
  continueDisabled = false,
  isLoading = false,
  hideSaveDraft = false,
}: StepFooterProps) {
  return (
    <div className="flex items-center justify-between mt-8 pt-4">
      {/* Back */}
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 px-5 py-2.5 bg-[#f4f3f8] text-[#1a1a2e] text-sm font-light rounded-md hover:bg-[#ece9f4] transition-colors"
      >
        <ArrowLeft size={15} />
        Back
      </button>

      <div className="flex items-center gap-3">
        {/* Save as draft */}
        {!hideSaveDraft && onSaveDraft && (
          <button
            type="button"
            onClick={onSaveDraft}
            className="px-5 py-2.5 text-sm font-light text-[#9a99b0] hover:text-[#1a1a2e] transition-colors"
          >
            Save as draft
          </button>
        )}

        {/* Continue */}
        <button
          type="button"
          onClick={onContinue}
          disabled={continueDisabled || isLoading}
          className={cn(
            'flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-md transition-colors',
            continueDisabled || isLoading
              ? 'bg-brand-pink/30 text-white/70 cursor-not-allowed'
              : 'bg-brand-pink text-white hover:bg-brand-pink/90 shadow-sm',
          )}
        >
          {isLoading ? 'Saving…' : continueLabel}
          {!isLoading && <ArrowRight size={15} />}
        </button>
      </div>
    </div>
  );
}
