'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import CampaignStepper from './CampaignStepper';

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
          onClick={handleBack}
          className="flex items-center gap-1.5 text-sm text-[#7a7a9a] hover:text-[#1a1a2e] transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          {currentStep === 1 ? 'Back to campaign' : 'Back'}
        </button>

        {/* Title */}
        <h1 className="text-2xl font-bold text-[#1a1a2e] mb-1">Create Campaign</h1>
        <p className="text-sm text-[#9a99b0] mb-6">
          Fill in each section — you can save as draft and return anytime.
        </p>

        {/* Stepper */}
        <CampaignStepper currentStep={currentStep} />

        {/* Step content */}
        {children}
      </div>
    </div>
  );
}
