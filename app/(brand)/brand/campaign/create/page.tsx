'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CampaignPageShell from '@/components/create-campaign/CampaignPageShell';
import StepDetails from '@/components/create-campaign/StepDetails';
import { type Step2Values } from '@/lib/validations/createCampaignSchemas';
import StepCampaignBrief from '@/components/create-campaign/StepCampaignBrief';
import StepSuccess, { type Step3Values } from '@/components/create-campaign/StepSuccess';
import StepReview from '@/components/create-campaign/StepReview';
import CampaignSuccessModal from '@/components/create-campaign/CampaignSuccessModal';
import { Step1Input, type Step1Values } from '@/lib/validations/createCampaignSchemas';
import {
  useCreateCampaign,
  usePatchCampaign,
  useSubmitCampaign,
  usePayCampaign,
} from '@/hooks/useCampaign';
import StepPayment from '@/components/create-campaign/StepPayment';
import type { PaymentBreakdown } from '@/types/campaign';

type DraftData = {
  step1?: Partial<Step1Input>;
  step2?: Partial<Step2Values>;
  step3?: Partial<Step3Values>;
};

export default function NewCampaignPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [step1Data, setStep1Data] = useState<Step1Values | null>(null);
  const [step2Data, setStep2Data] = useState<Step2Values | null>(null);
  const [step3Data, setStep3Data] = useState<Step3Values | null>(null);
  const [draft, setDraft] = useState<DraftData>({});
  const [campaignId, setCampaignId] = useState<string | null>(null);
  const [breakdown, setBreakdown] = useState<PaymentBreakdown | null>(null);
  const [paidCampaignTitle, setPaidCampaignTitle] = useState<string | undefined>();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const createCampaign = useCreateCampaign((id) => {
    setCampaignId(id);
    goTo(2);
  });

  const patchCampaign = usePatchCampaign(() => {
    goTo(currentStep + 1);
  });

  const submitCampaign = useSubmitCampaign((bd) => {
    setBreakdown(bd);
    goTo(5);
  });

  const payCampaign = usePayCampaign((title) => {
    setPaidCampaignTitle(title);
    setShowSuccessModal(true);
  });

  function goTo(step: number) {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleBack() {
    if (currentStep === 1) {
      router.push('/brand/campaign');
    } else {
      goTo(currentStep - 1);
    }
  }

  // ── Step 1 ────────────────────────────────────────────────────────────────
  function handleStep1Next(data: Step1Values & { _coverFile?: File }) {
    setStep1Data(data);
    setDraft((d) => ({ ...d, step1: data }));

    createCampaign.mutate({
      title: data.title,
      goal: data.goal,
      totalBudget: Number(data.budget),
      creatorCategoryId: data.creatorTier,
      preferredPlatformIds: data.platforms,
      coverImage: data._coverFile,
    });
  }

  // ── Step 2 ────────────────────────────────────────────────────────────────

  function handleStep2Next(data: Step2Values) {
    setStep2Data(data);
    setDraft((d) => ({ ...d, step2: data }));
    if (!campaignId) return;

    patchCampaign.mutate({
      id: campaignId,
      payload: {
        currentStep: 2,
        campaignBrief: data.brief, // renamed to match API
        deliverables: data.deliverables.map((d) => d.value).filter(Boolean),
        contentDirection: data.contentDirection.map((d) => d.value).filter(Boolean),
        contentGuidelines: {
          dos: data.dos.map((d) => d.value).filter(Boolean),
          donts: data.donts.map((d) => d.value).filter(Boolean),
        },
      },
    });
  }

  // ── Step 3 ────────────────────────────────────────────────────────────────
  function handleStep3Next(data: Step3Values) {
    setStep3Data(data);
    setDraft((d) => ({ ...d, step3: data }));
    if (!campaignId) return;

    patchCampaign.mutate({
      id: campaignId,
      payload: {
        currentStep: 3,
        usageRights: data.usageRights,
        successLooksLike: data.successDescription,
      },
    });
  }

  // ── Step 4 (review → submit) ──────────────────────────────────────────────
  function handleReviewNext() {
    if (!campaignId) return;
    submitCampaign.mutate(campaignId);
  }

  // ── Step 5 (pay) ──────────────────────────────────────────────────────────
  function handlePay() {
    if (!campaignId) return;
    // Replace paymentReference with your gateway's returned ref when integrated
    payCampaign.mutate({
      id: campaignId,
      payload: { paymentReference: `pay_ref_${Date.now()}` },
    });
  }

  // ── Draft helpers ─────────────────────────────────────────────────────────
  function handleSaveDraft1(data: Step1Input) {
    setDraft((d) => ({ ...d, step1: data }));
  }

  function handleSaveDraft2(data: Step2Values) {
    setDraft((d) => ({ ...d, step2: data }));
  }

  function handleSaveDraft3(data: Step3Values) {
    setDraft((d) => ({ ...d, step3: data }));
  }

  // ── Success modal ─────────────────────────────────────────────────────────
  function handleNewCampaign() {
    setShowSuccessModal(false);
    setCampaignId(null);
    setBreakdown(null);
    setStep1Data(null);
    setStep2Data(null);
    setStep3Data(null);
    setDraft({});
    goTo(1);
  }

  return (
    <>
      <CampaignPageShell currentStep={currentStep} onBack={handleBack}>
        {currentStep === 1 && (
          <StepDetails
            defaultValues={draft.step1}
            onNext={handleStep1Next}
            onBack={handleBack}
            onSaveDraft={handleSaveDraft1}
          />
        )}

        {currentStep === 2 && (
          <StepCampaignBrief
            defaultValues={draft.step2}
            onNext={handleStep2Next}
            onBack={() => goTo(1)}
            onSaveDraft={handleSaveDraft2}
          />
        )}

        {currentStep === 3 && (
          <StepSuccess
            defaultValues={draft.step3}
            onNext={handleStep3Next}
            onBack={() => goTo(2)}
            onSaveDraft={handleSaveDraft3}
          />
        )}

        {currentStep === 4 && step1Data && step2Data && step3Data && (
          <StepReview
            step1={step1Data}
            step2={step2Data}
            step3={step3Data}
            onNext={handleReviewNext}
            onBack={() => goTo(3)}
            isLoading={submitCampaign.isPending}
            onSaveDraft={() => {
              /* drafts saved per-step */
            }}
          />
        )}

        {currentStep === 5 && breakdown && (
          <StepPayment
            breakdown={breakdown}
            onBack={() => goTo(4)}
            onPay={handlePay}
            isLoading={payCampaign.isPending}
          />
        )}
      </CampaignPageShell>

      {showSuccessModal && (
        <CampaignSuccessModal campaignTitle={paidCampaignTitle} onNewCampaign={handleNewCampaign} />
      )}
    </>
  );
}
