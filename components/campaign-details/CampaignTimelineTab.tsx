'use client';

import { Check } from 'lucide-react';
import type { Campaign } from '@/types/campaign';

interface TimelineMilestone {
  label: string;
  date: string;
  done: boolean;
}

function getMilestones(campaign: Campaign): TimelineMilestone[] {
  // Static for now — same shape for every sub-status, per current scope.
  // createdAt anchors "Brief issued"; the rest are illustrative offsets
  // until a real endpoint provides actual milestone dates.
  const created = new Date(campaign.createdAt);
  const addDays = (n: number) => {
    const d = new Date(created);
    d.setDate(d.getDate() + n);
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return [
    { label: 'Brief issued', date: addDays(0), done: true },
    { label: 'Escrow funded', date: addDays(2), done: false },
    { label: 'Creator selected', date: addDays(3), done: false },
    { label: 'Content deadline', date: addDays(10), done: false },
    { label: 'Post live deadline', date: addDays(13), done: false },
    { label: 'Campaign complete', date: addDays(14), done: false },
  ];
}

export default function CampaignTimelineTab({ campaign }: { campaign: Campaign }) {
  const milestones = getMilestones(campaign);

  return (
    <div className="flex flex-col">
      {milestones.map((m, i) => (
        <div key={m.label} className="flex items-start gap-4">
          <div className="flex flex-col items-center">
            <div
              className={
                m.done
                  ? 'w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0'
                  : 'w-7 h-7 rounded-full bg-[#e8e6f0] text-transparent flex items-center justify-center shrink-0'
              }
            >
              {m.done && <Check size={14} strokeWidth={2.5} />}
            </div>
            {i < milestones.length - 1 && (
              <div
                className={
                  m.done ? 'w-px flex-1 bg-emerald-500 my-1' : 'w-px flex-1 bg-[#e8e6f0] my-1'
                }
              />
            )}
          </div>
          <div className="pb-6">
            <p className="text-sm font-semibold text-[#1a1a2e]">{m.label}</p>
            <p className="text-xs text-[#9a99b0] mt-0.5">{m.date}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
