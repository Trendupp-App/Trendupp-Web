import { ArrowDownLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PayoutTransaction } from '@/types/payout';

function fmt(n: number) {
  return `₦${n.toLocaleString('en-NG')}`;
}

const STATUS_STYLES: Record<PayoutTransaction['status'], string> = {
  on_hold: 'bg-amber-50 text-amber-700',
  available: 'bg-emerald-50 text-emerald-700',
  completed: 'bg-[#f4f3f6] text-[#7a7a9a]',
};

const STATUS_LABELS: Record<PayoutTransaction['status'], string> = {
  on_hold: 'On hold',
  available: 'available',
  completed: 'Completed',
};

export default function TransactionListItem({ transaction }: { transaction: PayoutTransaction }) {
  return (
    <div className="bg-white border border-[#e8e6f0]/70 rounded-2xl p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
          <ArrowDownLeft size={16} className="text-emerald-600" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-[#1a1a2e] truncate">{transaction.title}</p>
          <p className="text-xs text-[#9a99b0] mt-0.5 truncate">{transaction.subtitle}</p>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <span
          className={cn(
            'text-sm font-semibold',
            transaction.direction === 'credit' ? 'text-emerald-600' : 'text-red-500',
          )}
        >
          {transaction.direction === 'credit' ? '+' : '-'}
          {fmt(transaction.amount)}
        </span>
        <span
          className={cn(
            'text-[10px] font-medium px-2.5 py-1 rounded-full',
            STATUS_STYLES[transaction.status],
          )}
        >
          {STATUS_LABELS[transaction.status]}
        </span>
      </div>
    </div>
  );
}
