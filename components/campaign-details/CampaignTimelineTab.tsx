'use client';

import { Check } from 'lucide-react';
import type { Campaign } from '@/types/campaign';
import { useCampaignActivityTimeline } from '@/hooks/useCampaign';

const ACTOR_LABELS: Record<string, string> = {
  Brand: 'Brand',
  Creator: 'Creator',
  System: 'System',
  Admin: 'Admin',
};

export default function CampaignTimelineTab({ campaign }: { campaign: Campaign }) {
  const { data, isLoading, isError } = useCampaignActivityTimeline(campaign.id);
  const activities = data?.activities ?? [];

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-14 bg-[#f4f3f8] rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-sm text-red-500">
        Could not load this campaign&apos;s activity timeline.
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-10 text-sm text-[#9a99b0]">No activity recorded yet.</div>
    );
  }

  return (
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
  );
}
