'use client';

import { Check, Clock } from 'lucide-react';
import type { Campaign, CampaignTimeline, CampaignTimelineStage } from '@/types/campaign';
import { useCampaignActivityTimeline } from '@/hooks/useCampaign';
import { formatTimeRemaining } from '@/lib/campaignTimelineStage';
import { cn } from '@/lib/utils';

const ACTOR_LABELS: Record<string, string> = {
  Brand: 'Brand',
  Creator: 'Creator',
  System: 'System',
  Admin: 'Admin',
};

function stageOrder(key: string): number {
  const match = key.match(/^stage(\d+)/);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
}

function StageTracker({ timeline }: { timeline: CampaignTimeline }) {
  const stages = Object.entries(timeline)
    .filter((entry): entry is [string, CampaignTimelineStage] => !!entry[1])
    .sort(([a], [b]) => stageOrder(a) - stageOrder(b));
  if (stages.length === 0) return null;

  return (
    <div className="flex flex-col mb-8">
      <p className="text-xs font-semibold text-[#9a99b0] uppercase tracking-wider mb-4">Progress</p>
      {stages.map(([key, stage], i) => {
        const isDone = stage.status === 'completed';
        const isActive = stage.status === 'in_progress';
        const remaining = isActive ? formatTimeRemaining(stage.endedDate) : null;

        return (
          <div key={key} className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center shrink-0',
                  isDone
                    ? 'bg-emerald-500 text-white'
                    : isActive
                      ? 'bg-brand-pink text-white'
                      : 'bg-[#e8e6f0] text-transparent',
                )}
              >
                {isDone ? (
                  <Check size={14} strokeWidth={2.5} />
                ) : isActive ? (
                  <Clock size={12} />
                ) : null}
              </div>
              {i < stages.length - 1 && (
                <div
                  className={cn('w-px flex-1 my-1', isDone ? 'bg-emerald-500' : 'bg-[#e8e6f0]')}
                />
              )}
            </div>
            <div className="pb-6">
              <p className="text-sm font-semibold text-[#1a1a2e]">{stage.goal}</p>
              <p className="text-xs text-[#9a99b0] mt-0.5">
                {isDone
                  ? 'Completed'
                  : isActive
                    ? (remaining ?? 'In progress')
                    : (stage.intendedFor ?? 'Not started')}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function CampaignTimelineTab({ campaign }: { campaign: Campaign }) {
  const { data, isLoading, isError } = useCampaignActivityTimeline(campaign.id);
  const activities = data?.activities ?? [];

  return (
    <div className="flex flex-col">
      {campaign.timeline && <StageTracker timeline={campaign.timeline} />}

      <p className="text-xs font-semibold text-[#9a99b0] uppercase tracking-wider mb-4">
        Activity log
      </p>

      {isLoading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 bg-[#f4f3f8] rounded-xl animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-10 text-sm text-red-500">
          Could not load this campaign&apos;s activity timeline.
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-10 text-sm text-[#9a99b0]">No activity recorded yet.</div>
      ) : (
        <div className="flex flex-col">
          {activities.map((event, i) => (
            <div key={event.id} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <Check size={14} strokeWidth={2.5} />
                </div>
                {i < activities.length - 1 && <div className="w-px flex-1 bg-emerald-500 my-1" />}
              </div>
              <div className="pb-6">
                <p className="text-sm font-semibold text-[#1a1a2e]">{event.description}</p>
                <p className="text-xs text-[#9a99b0] mt-0.5">
                  {event.formattedTime} · {ACTOR_LABELS[event.actorType] ?? event.actorType}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
