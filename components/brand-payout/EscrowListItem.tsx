import { Clock } from 'lucide-react';
import type { BrandEscrowItem } from '@/types/payout';
import { formatCurrency } from '@/utils/Utilities';

export default function EscrowListItem({ escrow }: { escrow: BrandEscrowItem }) {
  const percent = Math.max(0, Math.min(100, ((30 - escrow.daysRemaining) / 30) * 100));
  const releaseDateLabel = new Date(escrow.releaseDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="bg-white border border-[#e8e6f0]/70 rounded-2xl p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-[#1a1a2e]">{escrow.campaignTitle}</p>
          <p className="text-xs text-[#9a99b0] mt-0.5">{escrow.statusDescription}</p>
        </div>
        <span className="text-base font-bold text-[#1a1a2e] shrink-0">
          {formatCurrency(escrow.amount, escrow.currency)}
        </span>
      </div>

      <div className="w-full h-1.5 bg-[#f4f3f6] rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-500 rounded-full transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs font-medium text-amber-600">
          <Clock size={13} />
          {escrow.daysRemaining} days remaining
        </span>
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-[#9a99b0]">Release date</span>
          <span className="text-xs font-bold text-[#1a1a2e]">{releaseDateLabel}</span>
        </div>
      </div>
    </div>
  );
}
