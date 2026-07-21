'use client';

import { ArrowDownLeft, Clock, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/Utilities';
import type { PayoutTransactionItem } from '@/types/payout';

interface TransactionHistoryListProps {
  transactions: PayoutTransactionItem[];
  currency?: string;
}

function getStatusBadge(status: string) {
  const normalized = status.toLowerCase();
  const styles: Record<string, string> = {
    pending: 'text-[#eab308] bg-[#fef9c3]',
    paid: 'text-[#00c37b] bg-[#00c37b]/10',
    completed: 'text-[#00c37b] bg-[#00c37b]/10',
    released: 'text-[#00c37b] bg-[#00c37b]/10',
    failed: 'text-red-600 bg-red-50',
    disputed: 'text-orange-600 bg-orange-50',
  };

  return (
    <span
      className={cn(
        'text-[9.5px] font-bold px-2 py-0.5 rounded-[4px] leading-none uppercase select-none',
        styles[normalized] ?? 'text-[#7a7a9a] bg-[#f4f3f6]',
      )}
    >
      {normalized.replace(/_/g, ' ')}
    </span>
  );
}

function getStatusIcon(status: string) {
  const normalized = status.toLowerCase();
  if (normalized === 'failed' || normalized === 'disputed') {
    return (
      <div className="w-9 h-9 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0">
        <X size={16} className="stroke-[2.5]" />
      </div>
    );
  }
  if (normalized === 'pending') {
    return (
      <div className="w-9 h-9 rounded-full bg-[#fef9c3] text-[#eab308] flex items-center justify-center shrink-0">
        <Clock size={16} className="stroke-[2.5]" />
      </div>
    );
  }
  return (
    <div className="w-9 h-9 rounded-full bg-[#00c37b]/10 text-[#00c37b] flex items-center justify-center shrink-0">
      <ArrowDownLeft size={16} className="stroke-[2.5]" />
    </div>
  );
}

export default function TransactionHistoryList({
  transactions,
  currency = 'USD',
}: TransactionHistoryListProps) {
  return (
    <div className="flex flex-col gap-3.5 w-full select-none">
      {transactions.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-[#e8e6f0] rounded-3xl text-sm font-light text-[#9a99b0]">
          No transaction history found
        </div>
      ) : (
        transactions.map((tx) => (
          <div
            key={tx.id}
            className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-4.5 flex items-center justify-between gap-4 shadow-[0_4px_24px_rgba(4,0,57,0.01)] hover:shadow-[0_4px_24px_rgba(4,0,57,0.02)] transition-shadow"
          >
            {/* Left side: Icon & Title/Details */}
            <div className="flex items-center gap-3 min-w-0">
              {getStatusIcon(tx.status)}

              <div className="flex flex-col gap-0.5 min-w-0">
                <h4 className="text-xs font-bold text-[#1a1a2e] leading-snug truncate">
                  {tx.campaignTitle}
                </h4>
                <span className="text-[10px] font-light text-[#7a7a9a] leading-none truncate">
                  {tx.brandName ? `${tx.brandName} • ` : ''}
                  {new Date(tx.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                <span className="text-[10px] font-light text-[#9a99b0] leading-snug truncate mt-0.5">
                  {tx.errorDetails || tx.statusDescription}
                </span>
              </div>
            </div>

            {/* Right side: Amount & Status Badge */}
            <div className="flex flex-col items-end gap-1.5 shrink-0 text-right">
              <span className="text-xs font-bold leading-none text-[#1a1a2e]">
                {formatCurrency(tx.amount, tx.currency ?? currency)}
              </span>
              {getStatusBadge(tx.status)}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
