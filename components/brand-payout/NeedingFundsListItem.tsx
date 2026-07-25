import { Clock, Megaphone, SquarePen } from 'lucide-react';
import type { Campaign } from '@/types/campaign';
import { formatCurrency, formatRelativeTime } from '@/utils/Utilities';

interface NeedingFundingListItemProps {
  campaign: Campaign;
  onContinue: (campaign: Campaign) => void;
}

export default function NeedingFundingListItem({
  campaign,
  onContinue,
}: NeedingFundingListItemProps) {
  const amountDue = campaign.paymentBreakdown?.totalToPay ?? campaign.totalBudget;

  return (
    <div className="bg-white border border-[#e8e6f0]/70 rounded-2xl p-5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-11 h-11 rounded-xl bg-[#eef0ff] flex items-center justify-center shrink-0">
          <Megaphone size={18} className="text-[#4f46e5]" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-[#1a1a2e] truncate">{campaign.title}</p>
            <span className="flex items-center gap-1 shrink-0 px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 text-[10px] font-medium">
              <Clock size={10} />
              Awaiting payment
            </span>
          </div>
          <p className="text-xs text-[#9a99b0] mt-0.5 truncate">
            {campaign.goal} · Last edited {formatRelativeTime(campaign.updatedAt)}
          </p>
          <p className="text-xs text-[#9a99b0] mt-1">
            {formatCurrency(amountDue, campaign.currency)} due
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => onContinue(campaign)}
          className="flex items-center gap-1.5 px-4 py-2 border border-[#e8e6f0] rounded-xl text-xs font-medium text-[#1a1a2e] hover:bg-[#faf9fc] transition-colors cursor-pointer"
        >
          <SquarePen size={14} />
          Pay now
        </button>
      </div>
    </div>
  );
}
