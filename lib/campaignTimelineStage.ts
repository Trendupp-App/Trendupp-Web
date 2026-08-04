import type { CampaignTimeline, CampaignTimelineStage } from '@/types/campaign';

function stageOrder(key: string): number {
  const match = key.match(/^stage(\d+)/);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
}

export interface CurrentTimelineStage {
  key: string;
  stage: CampaignTimelineStage;
}

// Finds the stage most relevant to show "right now": prefers the one that's
// in progress, falls back to the next upcoming (pending) stage, then the
// most recently completed stage if the whole timeline is done. Not hardcoded
// to a fixed set of stages — sorts by the numeric "stageN_..." key prefix so
// it keeps working as more stages get added later in the campaign lifecycle.
export function getCurrentTimelineStage(timeline?: CampaignTimeline): CurrentTimelineStage | null {
  if (!timeline) return null;
  const entries = Object.entries(timeline)
    .filter((entry): entry is [string, CampaignTimelineStage] => !!entry[1])
    .sort(([a], [b]) => stageOrder(a) - stageOrder(b));
  if (entries.length === 0) return null;

  const inProgress = entries.find(([, s]) => s.status === 'in_progress');
  if (inProgress) return { key: inProgress[0], stage: inProgress[1] };

  const pending = entries.find(([, s]) => s.status === 'pending');
  if (pending) return { key: pending[0], stage: pending[1] };

  const lastCompleted = [...entries].reverse().find(([, s]) => s.status === 'completed');
  if (lastCompleted) return { key: lastCompleted[0], stage: lastCompleted[1] };

  const [key, stage] = entries[entries.length - 1];
  return { key, stage };
}

// A live countdown only makes sense while a stage is actually in progress —
// pending/completed stages don't have an active deadline worth surfacing.
export function getActiveDeadline(timeline?: CampaignTimeline): string | null {
  const current = getCurrentTimelineStage(timeline);
  if (!current || current.stage.status !== 'in_progress') return null;
  return current.stage.endedDate;
}

// Forward-looking countdown formatter — "2d 5h left" / "5h left" / "Ending soon" / "Ended".
// (utils/Utilities.ts's formatRelativeTime is past-tense only — "2 hours ago" —
// wrong direction for a deadline countdown.)
export function formatTimeRemaining(endedDate: string | null | undefined): string | null {
  if (!endedDate) return null;
  const ts = Date.parse(endedDate);
  if (Number.isNaN(ts)) return null;
  const diff = ts - Date.now();
  if (diff <= 0) return 'Ended';
  const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (diffDays > 0) return `${diffDays}d ${diffHours}h left`;
  if (diffHours > 0) return `${diffHours}h left`;
  return 'Ending soon';
}

// Numeric days-remaining for sorting (e.g. "Closing soonest first"). Campaigns
// with no active deadline sort last.
export function getRemainingDays(endedDate: string | null | undefined): number {
  if (!endedDate) return Number.MAX_SAFE_INTEGER;
  const ts = Date.parse(endedDate);
  if (Number.isNaN(ts)) return Number.MAX_SAFE_INTEGER;
  return Math.max(0, Math.floor((ts - Date.now()) / (1000 * 60 * 60 * 24)));
}

export function getCampaignDeadlineInfo(timeline?: CampaignTimeline): {
  label: string | null;
  daysRemaining: number;
} {
  const deadline = getActiveDeadline(timeline);
  return {
    label: formatTimeRemaining(deadline),
    daysRemaining: getRemainingDays(deadline),
  };
}

export interface TimelineStep {
  key: string;
  title: string;
  subtext: string;
  status: 'completed' | 'in_progress' | 'pending';
}

// Turns the raw stageN_... timeline map into an ordered, display-ready step
// list — shared by the pre-apply Timeline tab and the post-apply success
// screen so both read the exact same real `CampaignTimeline` data.
export function buildTimelineSteps(
  timeline: CampaignTimeline | undefined,
  leadingStep?: TimelineStep,
): TimelineStep[] {
  const steps: TimelineStep[] = leadingStep ? [leadingStep] : [];
  if (!timeline) return steps;

  const stages = Object.entries(timeline)
    .filter((entry): entry is [string, CampaignTimelineStage] => !!entry[1])
    .sort(([a], [b]) => stageOrder(a) - stageOrder(b));

  for (const [key, stage] of stages) {
    const status: TimelineStep['status'] =
      stage.status === 'completed'
        ? 'completed'
        : stage.status === 'in_progress'
          ? 'in_progress'
          : 'pending';

    const subtext =
      status === 'completed'
        ? 'Completed'
        : status === 'in_progress'
          ? (formatTimeRemaining(stage.endedDate) ?? stage.intendedFor ?? 'In progress')
          : (stage.intendedFor ?? 'Not started');

    steps.push({ key, title: stage.goal, subtext, status });
  }

  return steps;
}
