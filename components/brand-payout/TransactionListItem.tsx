import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BrandTransactionItem } from '@/types/payout';
import { formatCurrency } from '@/utils/Utilities';

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700',
  released: 'bg-emerald-50 text-emerald-700',
  completed: 'bg-[#f4f3f6] text-[#7a7a9a]',
  failed: 'bg-red-50 text-red-600',
  disputed: 'bg-orange-50 text-orange-600',
};

const TYPE_LABELS: Record<string, string> = {
  creator_payout: 'Creator payout',
  escrow_funded: 'Escrow funded',
};

export default function TransactionListItem({
  transaction,
}: {
  transaction: BrandTransactionItem;
}) {
  const dateLabel = new Date(transaction.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="bg-white border border-[#e8e6f0]/70 rounded-2xl p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center shrink-0">
          <ArrowUpRight size={16} className="text-red-500" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-[#1a1a2e] truncate">{transaction.campaignTitle}</p>
          <p className="text-xs text-[#9a99b0] mt-0.5 truncate">
            {TYPE_LABELS[transaction.type] ?? transaction.type} • {dateLabel}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <span className="text-sm font-semibold text-red-500">
          -{formatCurrency(Math.abs(transaction.amount), transaction.currency)}
        </span>
        <span
          className={cn(
            'text-[10px] font-medium px-2.5 py-1 rounded-full capitalize',
            STATUS_STYLES[transaction.status] ?? 'bg-[#f4f3f6] text-[#7a7a9a]',
          )}
        >
          {transaction.status.replace(/_/g, ' ')}
        </span>
      </div>
    </div>
  );
}
