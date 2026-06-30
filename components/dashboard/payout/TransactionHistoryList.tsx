'use client';

import { cn } from '@/lib/utils';

export interface Transaction {
  id: string;
  title: string;
  brandOrDetails: string;
  date: string;
  amount: number;
  type: 'credit' | 'debit';
  status: 'available' | 'completed' | 'on_hold';
}

interface TransactionHistoryListProps {
  transactions: Transaction[];
}

export default function TransactionHistoryList({ transactions }: TransactionHistoryListProps) {
  const formatAmount = (amount: number, type: 'credit' | 'debit') => {
    const formatted = amount.toLocaleString('en-US');
    return type === 'credit' ? `+₦${formatted}` : `-₦${formatted}`;
  };

  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'available':
        return (
          <span className="text-[9.5px] font-bold text-[#00c37b] bg-[#00c37b]/10 px-2 py-0.5 rounded-[4px] leading-none uppercase select-none">
            available
          </span>
        );
      case 'completed':
        return (
          <span className="text-[9.5px] font-bold text-[#7a7a9a] bg-[#f4f3f6] px-2 py-0.5 rounded-[4px] leading-none uppercase select-none">
            completed
          </span>
        );
      case 'on_hold':
        return (
          <span className="text-[9.5px] font-bold text-[#eab308] bg-[#fef9c3] px-2 py-0.5 rounded-[4px] leading-none uppercase select-none">
            On hold
          </span>
        );
      default:
        return null;
    }
  };

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
              {tx.type === 'credit' ? (
                <div className="w-9 h-9 rounded-full bg-[#00c37b]/10 text-[#00c37b] flex items-center justify-center shrink-0">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </div>
              ) : (
                <div className="w-9 h-9 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 15.75l7.5-7.5 7.5 7.5"
                    />
                  </svg>
                </div>
              )}

              <div className="flex flex-col gap-0.5 min-w-0">
                <h4 className="text-xs font-bold text-[#1a1a2e] leading-snug truncate">
                  {tx.title}
                </h4>
                <span className="text-[10px] font-light text-[#7a7a9a] leading-none truncate">
                  {tx.brandOrDetails} • {tx.date}
                </span>
              </div>
            </div>

            {/* Right side: Amount & Status Badge */}
            <div className="flex flex-col items-end gap-1.5 shrink-0 text-right">
              <span
                className={cn(
                  'text-xs font-bold leading-none',
                  tx.type === 'credit' ? 'text-[#00c37b]' : 'text-red-500',
                )}
              >
                {formatAmount(tx.amount, tx.type)}
              </span>
              {getStatusBadge(tx.status)}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
