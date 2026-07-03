import type { Campaign } from '@/types/campaign';

function fmt(n: number) {
  return `₦${n.toLocaleString('en-NG')}`;
}

function daysLeft(timeline?: string): number {
  if (!timeline) return 0;
  const deadline = new Date(timeline).getTime();
  const diff = deadline - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

interface CampaignStatsRowProps {
  campaign: Campaign;
  applicantsCount?: number;
}

export default function CampaignStatsRow({ campaign }: CampaignStatsRowProps) {
  return (
    <div className="border border-[#e8e6f0] rounded-xl p-5 flex items-center justify-around gap-4 mb-6">
      <div>
        <p className="text-xs text-[#9a99b0]">Budget range</p>
        <p className="text-sm font-semibold text-brand-pink mt-0.5">{fmt(campaign.totalBudget)}</p>
      </div>
      <div>
        <p className="text-xs text-[#9a99b0]">Deadline</p>
        <p className="text-sm font-semibold text-[#1a1a2e] mt-0.5">
          {daysLeft(campaign.timeline)} days left
        </p>
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
