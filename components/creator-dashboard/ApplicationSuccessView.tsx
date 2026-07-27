'use client';

import { X, Check, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { CampaignTimeline, CampaignTimelineStage } from '@/types/campaign';
import { formatTimeRemaining } from '@/lib/campaignTimelineStage';

interface ApplicationSuccessViewProps {
  timeline?: CampaignTimeline;
  onClose: () => void;
}

function stageOrder(key: string): number {
  const match = key.match(/^stage(\d+)/);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
}

interface Step {
  key: string;
  title: string;
  subtext: string;
  status: 'completed' | 'in_progress' | 'pending';
}

function buildSteps(timeline?: CampaignTimeline): Step[] {
  const steps: Step[] = [
    {
      key: 'application-received',
      title: 'Application Received',
      subtext: 'Now',
      status: 'completed',
    },
  ];

  if (!timeline) return steps;

  const stages = Object.entries(timeline).sort(([a], [b]) => stageOrder(a) - stageOrder(b));

  for (const [key, stage] of stages as [string, CampaignTimelineStage][]) {
    const status: Step['status'] =
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

export default function ApplicationSuccessView({ timeline, onClose }: ApplicationSuccessViewProps) {
  const steps = buildSteps(timeline);

  return (
    <>
      {/* Success Sticky Header */}
      <div className="sticky top-0 bg-white py-4.5 px-5 flex items-center justify-end z-20 shrink-0">
        <button
          onClick={onClose}
          className="text-[#7a7a9a] hover:text-[#1a1a2e] transition-colors focus:outline-none border-none bg-transparent cursor-pointer"
          aria-label="Close success screen"
        >
          <X size={18} />
        </button>
      </div>

      {/* Success Body */}
      <div className="flex-1 flex flex-col items-center py-6 px-8 text-center my-auto min-h-[350px]">
        <div className="w-16 h-16 rounded-full border border-[#00c37b]/25 bg-[#00c37b]/5 flex items-center justify-center text-[#00c37b] mb-6 shadow-sm">
          <Check size={28} className="stroke-[2.5]" />
        </div>

        <span className="text-[10px] font-bold text-[#00c37b] leading-none uppercase tracking-wider mb-2">
          Application Sent
        </span>

        <h3 className="text-xl font-bold text-[#1a1a2e] mb-3 select-none leading-none">
          You&apos;re in the running!
        </h3>

        <p className="text-xs font-light text-[#7a7a9a] leading-relaxed max-w-[340px] mb-8">
          The brand reviews all applications after the 48-hour window closes. You will get a
          push+email notification whether your application is approved or rejected.
        </p>

        {/* Progress Timeline List */}
        <div className="w-full max-w-[280px] text-left flex flex-col gap-6 pl-8 ml-3 border-l border-[#e8e6f0]/80 relative mb-10 select-none">
          {steps.map((step) => (
            <div key={step.key} className="relative">
              <div
                className={cn(
                  'absolute -left-[42px] top-0.5 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center select-none',
                  step.status === 'completed'
                    ? 'bg-[#00c37b] text-white'
                    : step.status === 'in_progress'
                      ? 'bg-brand-pink text-white'
                      : 'bg-[#e8e6f0] text-[#9a99b0]',
                )}
              >
                {step.status === 'completed' ? (
                  <Check size={10} className="stroke-[3]" />
                ) : step.status === 'in_progress' ? (
                  <Clock size={10} />
                ) : (
                  <div className="w-1.5 h-1.5 bg-[#9a99b0] rounded-full" />
                )}
              </div>
              <div className="flex flex-col gap-0.5">
                <h4 className="text-xs font-bold text-[#1a1a2e]">{step.title}</h4>
                <span className="text-[10px] text-[#9a99b0] font-light mt-0.5">{step.subtext}</span>
              </div>
            </div>
          ))}
        </div>

        <Button
          onClick={onClose}
          className="w-full max-w-[280px] bg-brand-pink text-white font-semibold text-[14px] py-6.5 rounded-xl hover:bg-brand-pink/95 shadow-[0_6px_22px_rgba(215,23,111,0.22)] active:scale-[0.99] transition-all border-none cursor-pointer"
        >
          Back to Campaigns
        </Button>
      </div>
    </>
  );
}
