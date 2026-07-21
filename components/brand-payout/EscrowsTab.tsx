import type { BrandEscrowItem } from '@/types/payout';
import EscrowListItem from './EscrowListItem';
import { formatCurrency } from '@/utils/Utilities';

interface EscrowsTabProps {
  escrows: BrandEscrowItem[];
  totalActiveEscrow: number;
  currency?: string;
}

export default function EscrowsTab({
  escrows,
  totalActiveEscrow,
  currency = 'USD',
}: EscrowsTabProps) {
  if (escrows.length === 0) {
    return <div className="py-16 text-center text-sm text-[#9a99b0]">No funds in escrow.</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {escrows.map((e) => (
          <EscrowListItem key={e.campaignId} escrow={e} />
        ))}
      </div>

      <div className="bg-[#fdf2f6] border border-[#fbcfe8]/45 rounded-3xl p-5 flex flex-col items-center justify-center text-center gap-1 shadow-xs mt-1.5">
        <span className="text-[10px] text-[#7a7a9a] font-medium uppercase tracking-wider leading-none">
          Total Active Escrow
        </span>
        <span className="text-xl font-extrabold text-[#d7176f] mt-0.5 leading-none">
          {formatCurrency(totalActiveEscrow, currency)}
        </span>
        <span className="text-[9.5px] font-light text-[#9a99b0] mt-1.5 leading-none">
          Across {escrows.length} {escrows.length === 1 ? 'campaign' : 'campaigns'}
        </span>
      </div>
    </div>
  );
}
