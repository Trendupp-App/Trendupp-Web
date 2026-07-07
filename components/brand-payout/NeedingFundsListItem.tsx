import { Megaphone, SquarePen, Trash2 } from 'lucide-react';
import type { NeedingFundingItem } from '@/types/payout';

interface NeedingFundingListItemProps {
  item: NeedingFundingItem;
  onContinue: (item: NeedingFundingItem) => void;
  onDelete: (item: NeedingFundingItem) => void;
}

export default function NeedingFundingListItem({
  item,
  onContinue,
  onDelete,
}: NeedingFundingListItemProps) {
  return (
    <div className="bg-white border border-[#e8e6f0]/70 rounded-2xl p-5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-11 h-11 rounded-xl bg-[#eef0ff] flex items-center justify-center shrink-0">
          <Megaphone size={18} className="text-[#4f46e5]" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-[#1a1a2e] truncate">{item.title}</p>
          <p className="text-xs text-[#9a99b0] mt-0.5 truncate">
            {item.category} · Last edited {item.lastEditedLabel}
          </p>
          <p className="text-xs text-[#9a99b0] mt-1">
            {item.sectionsCompleted}/{item.sectionsTotal} sections
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => onContinue(item)}
          className="flex items-center gap-1.5 px-4 py-2 border border-[#e8e6f0] rounded-xl text-xs font-medium text-[#1a1a2e] hover:bg-[#faf9fc] transition-colors cursor-pointer"
        >
          <SquarePen size={14} />
          Continue
        </button>
        <button
          onClick={() => onDelete(item)}
          className="w-9 h-9 rounded-full bg-[#f4f3f6] hover:bg-red-50 flex items-center justify-center text-[#7a7a9a] hover:text-red-500 transition-colors cursor-pointer"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
