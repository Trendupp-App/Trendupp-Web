import { TrendingUp } from 'lucide-react';
import {
  IMPACT_BADGE_ORDER,
  getImpactBadgeProgress,
  type ImpactBadgeName,
} from '@/constants/impactBadges';

interface AchievementsHeroProps {
  totalTokens: number;
}

const SHORT_NAME: Record<ImpactBadgeName, string> = {
  'Impact Advocate': 'Advocate',
  'Impact Leader': 'Leader',
  'Impact Champion': 'Champion',
};

export default function AchievementsHero({ totalTokens }: AchievementsHeroProps) {
  const { currentBadge, currentLevel, nextBadge, nextGoal, tokensToNext, progressPct } =
    getImpactBadgeProgress(totalTokens);

  const title = currentBadge ?? 'No Badge Yet';
  const tokensLabel = nextGoal ? `${totalTokens}/${nextGoal} tokens` : `${totalTokens} tokens`;
  const caption = nextBadge
    ? `${tokensToNext} more ${tokensToNext === 1 ? 'token' : 'tokens'} to unlock ${nextBadge}.`
    : "You've reached the highest Impact tier!";

  return (
    <div className="relative bg-gradient-to-br from-[#e91e8c] to-[#8f0b4c] rounded-3xl p-6 md:p-8 flex flex-col items-center overflow-hidden shadow-lg">
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 blur-[70px] pointer-events-none" />

      <div className="flex items-center gap-1.5 bg-white/15 text-white text-xs font-medium px-4 py-1.5 rounded-full z-10">
        <TrendingUp size={13} />
        Your Current Badge
      </div>

      <h1 className="text-white text-2xl md:text-3xl font-bold tracking-tight mt-4 z-10">
        {title}
      </h1>

      <p className="text-white/70 text-xs md:text-sm font-medium mt-2 z-10">
        Level {Math.max(currentLevel, 0)}/{IMPACT_BADGE_ORDER.length} ·{' '}
        {IMPACT_BADGE_ORDER.map((b) => SHORT_NAME[b]).join(' · ')}
      </p>

      <div className="w-full bg-white/10 rounded-2xl p-5 mt-6 z-10">
        <div className="flex items-center justify-between text-white">
          <span className="text-sm font-semibold">Your progress</span>
          <span className="text-sm font-bold">{tokensLabel}</span>
        </div>
        <div className="w-full h-2 bg-white/25 rounded-full mt-3 overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="text-white/60 text-xs font-medium mt-2.5">{caption}</p>
      </div>
    </div>
  );
}
