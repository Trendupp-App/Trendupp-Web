import type { EscrowItem } from '@/types/payout';
import EscrowListItem from './EscrowListItem';

export default function EscrowsTab({ escrows }: { escrows: EscrowItem[] }) {
  if (escrows.length === 0) {
    return <div className="py-16 text-center text-sm text-[#9a99b0]">No funds in escrow.</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {escrows.map((e) => (
        <EscrowListItem key={e.id} escrow={e} />
      ))}
    </div>
  );
}
