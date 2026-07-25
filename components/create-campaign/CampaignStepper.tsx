'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export type CampaignStep = {
  id: number;
  label: string;
};

export const CAMPAIGN_STEPS: CampaignStep[] = [
  { id: 1, label: 'Details' },
  { id: 2, label: 'Campaign brief' },
  { id: 3, label: 'Review' },
  { id: 4, label: 'Payment' },
];

interface CampaignStepperProps {
  currentStep: number; // 1-based
}

export default function CampaignStepper({ currentStep }: CampaignStepperProps) {
  return (
    <div className="flex items-center gap-0 mb-8 overflow-x-auto pb-1">
      {CAMPAIGN_STEPS.map((step, idx) => {
        const isDone = step.id < currentStep;
        const isActive = step.id === currentStep;
        const isLast = idx === CAMPAIGN_STEPS.length - 1;

        return (
          <div key={step.id} className="flex items-center shrink-0">
            {/* Step pill */}
            <div className="flex items-center gap-1.5">
              <div
                className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium border transition-colors shrink-0',
                  isDone
                    ? 'bg-transparent border-transparent text-emerald-500'
                    : isActive
                      ? 'border-emerald-500 text-emerald-500 bg-transparent'
                      : 'border-[#d4d2e3] text-[#9a99b0] bg-transparent',
                )}
              >
                {isDone ? <Check size={13} strokeWidth={2.5} /> : step.id}
              </div>
              <span
                className={cn(
                  'text-sm whitespace-nowrap',
                  isDone
                    ? 'text-emerald-500 font-light'
                    : isActive
                      ? 'text-emerald-500 font-medium'
                      : 'text-[#9a99b0] font-light',
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {!isLast && (
              <div
                className={cn(
                  'h-px w-10 mx-2 shrink-0',
                  isDone ? 'bg-emerald-500' : 'bg-[#e8e6f0]',
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
