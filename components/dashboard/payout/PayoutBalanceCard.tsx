'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/Utilities';

interface PayoutBalanceCardProps {
  availableBalance: number;
  hold30Day: number;
  totalEarned: number;
  currency?: string;
}

export default function PayoutBalanceCard({
  availableBalance,
  hold30Day,
  totalEarned,
  currency = 'USD',
}: PayoutBalanceCardProps) {
  const [showBalance, setShowBalance] = useState(true);

  const formatAmount = (amount: number) => formatCurrency(amount, currency);

  return (
    <div className="w-full bg-[#d7176f] text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[0_6px_24px_rgba(215,23,111,0.18)] select-none">
      {/* Available Balance block */}
      <div className="flex flex-col gap-1.5 w-full md:w-auto">
        <div className="flex items-center gap-2">
          <span className="text-[11px] sm:text-xs font-medium text-white/80 uppercase tracking-wider">
            Available Balance
          </span>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="text-white/80 hover:text-white transition-all duration-300 hover:scale-110 active:scale-95 bg-transparent border-none outline-none cursor-pointer p-0.5"
            aria-label={showBalance ? 'Hide balance' : 'Show balance'}
          >
            {showBalance ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        <div className="relative overflow-hidden h-9 sm:h-12 w-full min-w-[200px] flex items-center">
          {/* Visible Balance */}
          <span
            className={cn(
              'text-3xl sm:text-[40px] font-extrabold tracking-tight leading-none transition-all duration-300 absolute left-0',
              showBalance
                ? 'opacity-100 translate-y-0 filter-none'
                : 'opacity-0 translate-y-3.5 pointer-events-none blur-[4px]',
            )}
          >
            {formatAmount(availableBalance)}
          </span>
          {/* Hidden Balance Dots */}
          <span
            className={cn(
              'text-3xl sm:text-[40px] font-extrabold tracking-widest leading-none transition-all duration-300 absolute left-0 select-none',
              !showBalance
                ? 'opacity-100 translate-y-0 filter-none'
                : 'opacity-0 -translate-y-3.5 pointer-events-none blur-[4px]',
            )}
          >
            ₦••••••
          </span>
        </div>
      </div>

      {/* Stats sub-cards row */}
      <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto">
        <div className="bg-white/10 backdrop-blur-[2px] rounded-2xl p-4 flex-1 md:w-[150px] flex flex-col gap-1">
          <span className="text-[10px] text-white/70 font-medium uppercase tracking-wider">
            30-Day Hold
          </span>
          <span className="text-sm sm:text-base font-bold truncate">{formatAmount(hold30Day)}</span>
        </div>
        <div className="bg-white/10 backdrop-blur-[2px] rounded-2xl p-4 flex-1 md:w-[150px] flex flex-col gap-1">
          <span className="text-[10px] text-white/70 font-medium uppercase tracking-wider">
            Total Earned
          </span>
          <span className="text-sm sm:text-base font-bold truncate">
            {formatAmount(totalEarned)}
          </span>
        </div>
      </div>
    </div>
  );
}
