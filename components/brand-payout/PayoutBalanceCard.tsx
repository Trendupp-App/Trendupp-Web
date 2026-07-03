'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import type { PayoutSummary } from '@/types/payout';

function fmt(n: number) {
  return `₦${n.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

interface PayoutBalanceCardProps {
  summary: PayoutSummary;
}

export default function PayoutBalanceCard({ summary }: PayoutBalanceCardProps) {
  const [balanceVisible, setBalanceVisible] = useState(true);

  return (
    <div className="bg-gradient-to-br from-[#c8146b] to-[#a30e56] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-stretch gap-6">
      {/* Available balance */}
      <div className="flex-1 flex flex-col gap-3 justify-center">
        <button
          onClick={() => setBalanceVisible((v) => !v)}
          className="flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors w-fit cursor-pointer"
        >
          Available Balance
          {balanceVisible ? <Eye size={15} /> : <EyeOff size={15} />}
        </button>
        <span className="text-4xl md:text-[44px] font-extrabold text-white tracking-tight">
          {balanceVisible ? fmt(summary.availableBalance) : '₦••••••'}
        </span>
      </div>

      {/* Mini stat cards */}
      <div className="grid grid-cols-2 gap-3 md:w-[420px] shrink-0">
        <div className="bg-[#e0147f]/60 rounded-2xl p-4 flex flex-col justify-between gap-8">
          <span className="text-xs text-white/80">Total Earned</span>
          <span className="text-2xl font-bold text-white">{fmt(summary.totalEarned)}</span>
        </div>
        <div className="bg-[#e0147f]/60 rounded-2xl p-4 flex flex-col justify-between gap-8">
          <span className="text-xs text-white/80">Total Withdrawn</span>
          <span className="text-2xl font-bold text-white">{fmt(summary.totalWithdrawn)}</span>
        </div>
      </div>
    </div>
  );
}
