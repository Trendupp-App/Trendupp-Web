'use client';

import { useState } from 'react';
import { ArrowLeft, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import CampaignStepper from './CampaignStepper';
import SampleBriefModal from './SampleBriefModal';
interface CampaignPageShellProps {
  currentStep: number;
  onBack?: () => void;
  children: React.ReactNode;
}

export default function CampaignPageShell({
  currentStep,
  onBack,
  children,
}: CampaignPageShellProps) {
  const router = useRouter();
  const [showSampleBrief, setShowSampleBrief] = useState(false);

  function handleBack() {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[900px] mx-auto px-6 py-8">
        {/* Back link */}
        <button
          onClick={() => router.replace('/brand/campaign')}
          className="flex cursor-pointer items-center gap-1.5 text-sm text-[#7a7a9a] hover:text-[#1a1a2e] transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          {'Back to campaign'}
        </button>

        {/* Title */}
        <div className="flex items-start justify-between gap-4 mb-1">
          <h1 className="text-2xl font-bold text-[#1a1a2e]">Create Campaign</h1>
          <button
            onClick={() => setShowSampleBrief(true)}
            className="flex cursor-pointer items-center gap-1.5 text-sm text-brand-pink hover:text-brand-pink/80 transition-colors shrink-0 mt-1"
          >
            <FileText size={15} />
            View sample brief
          </button>
        </div>
        <p className="text-sm text-[#9a99b0] mb-6">
          Fill in each section — you can save as draft and return anytime.
        </p>

        {/* Stepper */}
        <CampaignStepper currentStep={currentStep} />

        {/* Step content */}
        {children}
      </div>

      {showSampleBrief && <SampleBriefModal onClose={() => setShowSampleBrief(false)} />}
    </div>
  );
}
