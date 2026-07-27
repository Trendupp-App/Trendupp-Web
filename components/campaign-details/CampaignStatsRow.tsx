import type { Campaign } from '@/types/campaign';
import { formatCurrency } from '@/utils/Utilities';
import { formatTimeRemaining, getActiveDeadline } from '@/lib/campaignTimelineStage';

interface CampaignStatsRowProps {
  campaign: Campaign;
  applicantsCount?: number;
}

export default function CampaignStatsRow({ campaign }: CampaignStatsRowProps) {
  const timeRemaining = formatTimeRemaining(getActiveDeadline(campaign.timeline));

  return (
    <div className="border border-[#e8e6f0] rounded-xl p-5 flex items-center justify-around gap-4 mb-6">
      <div>
        <p className="text-xs text-[#9a99b0]">Budget range</p>
        <p className="text-sm font-semibold text-brand-pink mt-0.5">
          {formatCurrency(campaign.totalBudget, campaign.currency ?? 'NGN')}
        </p>
      </div>
      <div>
        <p className="text-xs text-[#9a99b0]">Deadline</p>
        <p className="text-sm font-semibold text-[#1a1a2e] mt-0.5">{timeRemaining ?? '—'}</p>
      </div>
      <div>
        <p className="text-xs text-[#9a99b0]">Creator Tier</p>
        <p className="text-sm font-semibold text-[#1a1a2e] mt-0.5">
          {campaign.creatorCategory?.name ?? '—'}
        </p>
      </div>
    </div>
  );
}
