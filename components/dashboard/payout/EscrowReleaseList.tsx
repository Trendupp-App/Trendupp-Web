'use client';

import { Clock, Info } from 'lucide-react';
import { formatCurrency } from '@/utils/Utilities';
import type { PayoutEscrowItem } from '@/types/payout';

interface EscrowReleaseListProps {
  pendingReleases: PayoutEscrowItem[];
  totalFundsYetToBeReleased: number;
  currency?: string;
}

export default function EscrowReleaseList({
  pendingReleases,
  totalFundsYetToBeReleased,
  currency = 'USD',
}: EscrowReleaseListProps) {
  return (
    <div className="flex flex-col gap-5 w-full select-none">
      {/* 30-Day Security Hold warning */}
      <div className="flex gap-3.5 bg-amber-50/45 border border-amber-100 rounded-2xl p-4">
        <div className="w-5 h-5 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 shrink-0 mt-0.5">
          <Info size={20} />
        </div>
        <div className="flex flex-col gap-0.5">
          <h4 className="text-xs font-bold text-[#1a1a2e]">30-Day Security Hold</h4>
          <p className="text-[10.5px] font-light text-[#7a7a9a] leading-relaxed mt-0.5">
            Every campaign payment is held for 30 days after posting is verified. This protects both
            you and the advertiser during the dispute window. Funds automatically move to your Bank
            account on the release date.
          </p>
        </div>
      </div>

      {/* List items */}
      <div className="flex flex-col gap-3.5 w-full">
        {pendingReleases.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-[#e8e6f0] rounded-3xl text-sm font-light text-[#9a99b0]">
            No pending releases in escrow
          </div>
        ) : (
          pendingReleases.map((item) => {
            // Calculate progress percentage (assuming 30-day default hold window)
            const percent = Math.max(0, Math.min(100, ((30 - item.daysRemaining) / 30) * 100));
            const releaseDateLabel = new Date(item.releaseDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <div
                key={item.id}
                className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-3 shadow-[0_4px_24px_rgba(4,0,57,0.01)]"
              >
                {/* Title and Amount */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <h4 className="text-xs font-bold text-[#1a1a2e] leading-snug truncate">
                      {item.campaignTitle}
                    </h4>
                    {item.brandName && (
                      <span className="text-[10px] font-light text-[#7a7a9a] leading-none truncate">
                        {item.brandName}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-bold text-[#1a1a2e] shrink-0 text-right leading-none mt-0.5">
                    {formatCurrency(item.amount, item.currency ?? currency)}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-[#f4f3f6] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#f59e0b] h-full rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                {/* Footer release info */}
                <div className="flex items-center justify-between gap-4 text-[10px] leading-none">
                  <span className="flex items-center gap-1 font-bold text-[#f59e0b]">
                    <Clock size={11} className="stroke-[2.5]" />
                    <span>{item.daysRemaining} days remaining</span>
                  </span>
                  <span className="text-[#7a7a9a] font-light">
                    Access Payment:{' '}
                    <span className="font-bold text-[#1a1a2e]">{releaseDateLabel}</span>
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Summary card */}
      {pendingReleases.length > 0 && (
        <div className="bg-[#fdf2f6] border border-[#fbcfe8]/45 rounded-3xl p-5 flex flex-col items-center justify-center text-center gap-1 shadow-xs mt-1.5">
          <span className="text-[10px] text-[#7a7a9a] font-medium uppercase tracking-wider leading-none">
            Total Outstanding Payment
          </span>
          <span className="text-xl font-extrabold text-[#d7176f] mt-0.5 leading-none">
            {formatCurrency(totalFundsYetToBeReleased, currency)}
          </span>
          <span className="text-[9.5px] font-light text-[#9a99b0] mt-1.5 leading-none">
            Across {pendingReleases.length}{' '}
            {pendingReleases.length === 1 ? 'campaign' : 'campaigns'}
          </span>
        </div>
      )}
    </div>
  );
}
