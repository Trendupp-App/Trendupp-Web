import type { Campaign } from '@/types/campaign';
import NeedingFundingListItem from './NeedingFundsListItem';

interface NeedingFundingTabProps {
  campaigns: Campaign[];
  onContinue: (campaign: Campaign) => void;
}

export default function NeedingFundingTab({ campaigns, onContinue }: NeedingFundingTabProps) {
  if (campaigns.length === 0) {
    return (
      <div className="py-16 text-center text-sm text-[#9a99b0]">
        Nothing needs funding right now.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {campaigns.map((campaign) => (
        <NeedingFundingListItem key={campaign.id} campaign={campaign} onContinue={onContinue} />
      ))}
    </div>
  );
}
