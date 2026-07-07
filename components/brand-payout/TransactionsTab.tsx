import type { PayoutTransaction } from '@/types/payout';
import TransactionListItem from './TransactionListItem';

export default function TransactionsTab({ transactions }: { transactions: PayoutTransaction[] }) {
  if (transactions.length === 0) {
    return <div className="py-16 text-center text-sm text-[#9a99b0]">No transactions yet.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {transactions.map((t) => (
        <TransactionListItem key={t.id} transaction={t} />
      ))}
    </div>
  );
}
