import { Clock, Users, Megaphone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Campaign } from '@/types/campaign';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/Utilities';

function daysLeft(timeline?: string): number {
  if (!timeline) return 0;
  const deadline = new Date(timeline).getTime();
  const diff = deadline - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    badgeCls: string;
    ctaLabel: string;
  }
> = {
  live: {
    label: 'Live',
    badgeCls: 'text-emerald-700 border-emerald-700',
    ctaLabel: 'Review applications',
  },
  active: {
    label: 'Active',
    badgeCls: 'text-blue-600 border-blue-100',
    ctaLabel: 'View progress',
  },
  in_progress: {
    label: 'In progress',
    badgeCls: 'text-blue-600 border-blue-100',
    ctaLabel: 'View progress',
  },
  content_review: {
    label: 'Content review',
    badgeCls: 'text-amber-600 border-amber-100',
    ctaLabel: 'Review content',
  },
  revision: {
    label: 'Revision',
    badgeCls: 'text-orange-600 border-orange-100',
    ctaLabel: 'View revision',
  },
  live_content: {
    label: 'Live content',
    badgeCls: 'text-emerald-600 border-emerald-100',
    ctaLabel: 'View live content',
  },
  completed: {
    label: 'Completed',
    badgeCls: 'text-slate-600 border-slate-200',
    ctaLabel: 'View summary',
  },
  submitted: {
    label: 'Submitted',
    badgeCls: 'text-purple-600 border-purple-100',
    ctaLabel: 'Awaiting approval',
  },
  draft: {
    label: 'Draft',
    badgeCls: 'text-[#9a99b0] border-[#e8e6f0]',
    ctaLabel: 'Continue editing',
  },
};

interface CampaignCardProps {
  campaign: Campaign;
  onViewDetails?: (campaign: Campaign) => void;
}

export default function CampaignCard({ campaign, onViewDetails }: CampaignCardProps) {
  const router = useRouter();
  // const config = STATUS_CONFIG[campaign.status] ?? STATUS_CONFIG.live;
  const displayStatus = campaign.subStatus ?? campaign.status;
  const config = STATUS_CONFIG[displayStatus] ?? STATUS_CONFIG.live;

  function handleClick() {
    if (onViewDetails) {
      onViewDetails(campaign);
    } else {
      router.push(`/brand/campaign/${campaign.id}`);
    }
  }
  return (
    <div className="bg-white border border-[#e8e6f0] rounded-2xl overflow-hidden flex flex-col">
      {/* Cover image */}
      <div className="relative w-full h-44 bg-[#ede9fb] flex items-center justify-center shrink-0">
        {campaign.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={campaign.coverImage}
            alt={campaign.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <Megaphone size={32} className="text-[#7c6fe0]" />
        )}

        {campaign.status === 'live' && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-full">
            <Clock size={10} />
            {daysLeft(campaign.timeline)}days left
          </div>
        )}

        <div
          className={cn(
            'absolute bottom-2 right-2 bg-white text-[10px] font-semibold px-2.5 py-1 rounded-full border-[1.5px]',
            campaign.status === 'live' && 'animate-caret-blink',
            config.badgeCls,
          )}
        >
          {config.label}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-2 p-4 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold text-[#1a1a2e] leading-snug">{campaign.title}</p>
          <span className="text-[10px] font-medium text-[#7c6fe0] bg-[#ede9fb] px-2 py-0.5 rounded-full shrink-0">
            {/* Tier name resolved via creatorCategory relation */}
            {(campaign as Campaign).creatorCategory?.name ?? ''}
          </span>
        </div>

        <p className="text-xs text-[#9a99b0]">{campaign.goal}</p>

        <div className="flex items-center justify-between mt-1">
          <span className="text-sm font-semibold text-brand-pink">
            {formatCurrency(campaign.totalBudget, campaign.currency ?? 'NGN')}
          </span>
          {campaign.status === 'live' && (
            <div className="flex items-center gap-1 text-xs text-[#9a99b0]">
              <Users size={12} />
              {campaign?.applicationsCount?.total} applied
            </div>
          )}
        </div>

        <button
          onClick={handleClick}
          className="w-full mt-1 cursor-pointer py-2.5 border border-[#e8e6f0] rounded-xl text-xs text-[#1a1a2e] font-light hover:bg-[#faf9fc] transition-colors"
        >
          {onViewDetails ? 'View details' : config.ctaLabel}
        </button>
      </div>
    </div>
  );
}
