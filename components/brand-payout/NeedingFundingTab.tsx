import type { NeedingFundingItem } from '@/types/payout';
import NeedingFundingListItem from './NeedingFundsListItem';

interface NeedingFundingTabProps {
  items: NeedingFundingItem[];
  onContinue: (item: NeedingFundingItem) => void;
  onDelete: (item: NeedingFundingItem) => void;
}

export default function NeedingFundingTab({ items, onContinue, onDelete }: NeedingFundingTabProps) {
  if (items.length === 0) {
    return (
      <div className="py-16 text-center text-sm text-[#9a99b0]">
        Nothing needs funding right now.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {items.map((item) => (
        <NeedingFundingListItem
          key={item.id}
          item={item}
          onContinue={onContinue}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
