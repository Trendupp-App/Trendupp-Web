'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import type { BrandPayoutSummary } from '@/types/payout';
import { formatCurrency } from '@/utils/Utilities';

interface PayoutBalanceCardProps {
  summary: BrandPayoutSummary;
}

export default function PayoutBalanceCard({ summary }: PayoutBalanceCardProps) {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const fmt = (n: number) => formatCurrency(n, summary.currency);

  return (
    <div className="bg-gradient-to-br from-[#c8146b] to-[#a30e56] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-stretch gap-6">
      {/* Escrow balance */}
      <div className="flex-1 flex flex-col gap-3 justify-center">
        <button
          onClick={() => setBalanceVisible((v) => !v)}
          className="flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors w-fit cursor-pointer"
        >
          Escrow Balance
          {balanceVisible ? <Eye size={15} /> : <EyeOff size={15} />}
        </button>
        <span className="text-4xl md:text-[44px] font-extrabold text-white tracking-tight">
          {balanceVisible ? fmt(summary.escrowBalance) : '••••••'}
        </span>
      </div>

      {/* Mini stat cards */}
      <div className="grid grid-cols-2 gap-3 md:w-[420px] shrink-0">
        <div className="bg-[#e0147f]/60 rounded-2xl p-4 flex flex-col justify-between gap-8">
          <span className="text-xs text-white/80">30-Day Hold</span>
          <span className="text-2xl font-bold text-white">{fmt(summary.thirtyDayHold)}</span>
        </div>
        <div className="bg-[#e0147f]/60 rounded-2xl p-4 flex flex-col justify-between gap-8">
          <span className="text-xs text-white/80">Total Payout</span>
          <span className="text-2xl font-bold text-white">{fmt(summary.totalPayout)}</span>
        </div>
      </div>
    </div>
  );
}
