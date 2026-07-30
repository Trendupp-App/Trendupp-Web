import { Megaphone, Coins, Info } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import {
  IMPACT_BADGE_ORDER,
  IMPACT_BADGE_META,
  IMPACT_BADGE_TOKEN_REQUIREMENT,
} from '@/constants/impactBadges';
import type { ImpactBadgeName } from '@/constants/impactBadges';

interface ImpactStatsSectionProps {
  appliedCampaigns: number;
  totalTokens: number;
  currentBadge: ImpactBadgeName | null;
}

export default function ImpactStatsSection({
  appliedCampaigns,
  totalTokens,
  currentBadge,
}: ImpactStatsSectionProps) {
  const currentIndex = currentBadge ? IMPACT_BADGE_ORDER.indexOf(currentBadge) : -1;

  return (
    <div className="flex flex-col gap-6">
      {/* Impact stats */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold text-[#1a1a2e]">Impact stats</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-white border border-[#e8e6f0]/70 rounded-2xl p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#f3f2fe] flex items-center justify-center text-[#574aff] shrink-0">
                <Megaphone size={18} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-[#1a1a2e] truncate">
                  Social Impact Campaigns
                </span>
                <span className="text-xs text-[#9a99b0]">Total applied</span>
              </div>
            </div>
            <span className="text-lg font-bold text-[#1a1a2e] shrink-0">{appliedCampaigns}</span>
          </div>

          <div className="bg-white border border-[#e8e6f0]/70 rounded-2xl p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#fcecf3] flex items-center justify-center text-brand-pink shrink-0">
                <Coins size={18} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-[#1a1a2e] truncate">Token Rewarded</span>
                <span className="text-xs text-[#9a99b0]">Current balance</span>
              </div>
            </div>
            <span className="text-lg font-bold text-[#1a1a2e] shrink-0">{totalTokens}</span>
          </div>
        </div>
      </div>

      {/* Impact Badge Tiers */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold text-[#1a1a2e]">Impact Badge Tiers</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {IMPACT_BADGE_ORDER.map((name, idx) => {
            const meta = IMPACT_BADGE_META[name];
            const requirement = IMPACT_BADGE_TOKEN_REQUIREMENT[name];
            const isCurrent = idx === currentIndex;
            const isUnlocked = currentIndex >= idx;
            const requirementLabel =
              name === 'Impact Champion' ? `${requirement}+ Tokens` : `${requirement} Tokens`;

            return (
              <div
                key={name}
                className={cn(
                  'rounded-2xl p-4 flex items-center gap-3',
                  isCurrent ? 'bg-brand-pink' : 'bg-white border border-[#e8e6f0]/70',
                )}
              >
                <div
                  className={cn(
                    'w-11 h-11 rounded-xl flex items-center justify-center shrink-0',
                    isCurrent ? 'bg-white/15' : meta.bg,
                  )}
                >
                  <Image src={meta.icon} alt="" width={22} height={23} />
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'text-sm font-bold truncate',
                        isCurrent ? 'text-white' : 'text-[#1a1a2e]',
                      )}
                    >
                      {name}
                    </span>
                    <span
                      className={cn(
                        'text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full shrink-0',
                        isUnlocked
                          ? 'bg-emerald-100 text-emerald-600'
                          : isCurrent
                            ? 'bg-white/20 text-white'
                            : 'bg-[#f4f3f6] text-[#9a99b0]',
                      )}
                    >
                      {isUnlocked ? 'Unlocked' : 'Locked'}
                    </span>
                  </div>
                  <span
                    className={cn(
                      'text-xs font-medium',
                      isCurrent ? 'text-white/70' : 'text-[#9a99b0]',
                    )}
                  >
                    {isCurrent
                      ? 'You are here!'
                      : isUnlocked
                        ? requirementLabel
                        : `Collect ${requirementLabel.toLowerCase()} to reach this level`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Token Expiry Policy */}
      <div className="flex gap-3 bg-pink-50 border border-pink-100 rounded-2xl p-4">
        <div className="w-8 h-8 rounded-full bg-pink-100/70 flex items-center justify-center text-brand-pink shrink-0">
          <Info size={16} />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-bold text-[#1a1a2e]">Token Expiry Policy</span>
          <p className="text-xs text-[#7a7a9a] leading-relaxed">
            Tokens expire 12 months after you receive them and will be deducted from your total.
          </p>
        </div>
      </div>
    </div>
  );
}
