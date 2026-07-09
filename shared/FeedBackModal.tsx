'use client';

import { Loader2, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FeedbackModalAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  loading?: boolean;
}

export interface FeedbackModalProps {
  icon: LucideIcon;
  iconColor?: string;
  message: React.ReactNode;
  actions: FeedbackModalAction[];
}

export default function FeedbackModal({
  icon: Icon,
  iconColor = 'text-emerald-500',
  message,
  actions,
}: FeedbackModalProps) {
  const borderColor = iconColor.replace('text-', 'border-');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl w-full max-w-[360px] flex flex-col items-center px-8 py-10 shadow-2xl text-center gap-5">
        {/* Icon circle */}
        <div
          className={cn(
            'w-16 h-16 rounded-full border-2 flex items-center justify-center shrink-0',
            borderColor,
          )}
        >
          <Icon size={28} strokeWidth={2} className={iconColor} />
        </div>

        {/* Message */}
        <p className="text-sm text-[#1a1a2e] leading-relaxed">{message}</p>

        {/* Actions */}
        <div className="flex gap-3 w-full mt-1">
          {actions.map((action) => (
            <button
              type="button"
              key={action.label}
              onClick={action.onClick}
              disabled={action.loading}
              className={cn(
                'w-full py-1 rounded-xl text-xs transition-colors',
                action.variant === 'primary'
                  ? 'bg-brand-pink cursor-pointer text-white font-medium hover:bg-brand-pink/90'
                  : 'border border-[#e8e6f0] text-[#1a1a2e] font-light hover:bg-[#faf9fc]',
                action.loading && 'opacity-70 cursor-not-allowed',
              )}
            >
              {action.loading && <Loader2 size={14} className="animate-spin" />}
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
