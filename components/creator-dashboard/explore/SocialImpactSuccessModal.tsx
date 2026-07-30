'use client';

import { Check } from 'lucide-react';
import FeedbackModal from '@/shared/FeedBackModal';

interface SocialImpactSuccessModalProps {
  campaignTitle: string;
  onGoToCampaign: () => void;
}

const STEPS = [
  'Review the content direction and guidelines.',
  'Create your content according to the deliverables.',
  'Submit your work for review.',
];

export default function SocialImpactSuccessModal({
  campaignTitle,
  onGoToCampaign,
}: SocialImpactSuccessModalProps) {
  return (
    <FeedbackModal
      icon={Check}
      iconColor="text-emerald-500"
      message={
        <>
          <span className="block text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-2">
            Application Sent
          </span>
          <strong className="block text-lg font-bold text-[#1a1a2e] mb-2">You&apos;re in</strong>
          <span className="block text-sm font-light text-[#7a7a9a]">
            You&apos;ve successfully joined the {campaignTitle} campaign. It&apos;s time to start
            creating your magic!
          </span>
        </>
      }
      actions={[{ label: 'Go to campaign', variant: 'primary', onClick: onGoToCampaign }]}
    >
      <ol className="flex flex-col gap-2.5 w-full text-left">
        {STEPS.map((step, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-brand-pink-light text-brand-pink text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
              {i + 1}
            </span>
            <span className="text-sm text-[#4a4a5e]">{step}</span>
          </li>
        ))}
      </ol>
    </FeedbackModal>
  );
}
