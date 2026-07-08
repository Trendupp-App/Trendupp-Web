'use client';

import { useEffect, useRef, useState } from 'react';
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
  useCampaign,
} from '@/hooks/useCampaign';
import StepPayment from '@/components/create-campaign/StepPayment';
import type { PaymentBreakdown } from '@/types/campaign';
import {
  saveCampaignProgress,
  loadCampaignProgress,
  clearCampaignProgress,
} from '@/lib/CampaignDraftStorage';
import {
  mapCampaignToStep1,
  mapCampaignToStep2,
  mapCampaignToStep3,
} from '@/lib/mapCampaignToSteps';
import CampaignDetailSkeleton from '@/components/skeletons/CampaignDetailsSkeleton';

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
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [editingFromReview, setEditingFromReview] = useState(false);
  const [alreadySubmittedNotice, setAlreadySubmittedNotice] = useState(false);
  const hasRehydratedRef = useRef(false);

  const progressRef = useRef(typeof window === 'undefined' ? null : loadCampaignProgress());

  const [restoredCampaignId] = useState<string | null>(progressRef.current?.campaignId ?? null);
  const [restoredStep] = useState<number | null>(progressRef.current?.currentStep ?? null);
  const [isRehydrated, setIsRehydrated] = useState(!progressRef.current?.campaignId);

  const {
    data: restoredCampaign,
    isLoading: campaignLoading,
    isError: campaignLoadError,
  } = useCampaign(restoredCampaignId);

  useEffect(() => {
    if (!restoredCampaignId) return;
    if (hasRehydratedRef.current) return;
    if (campaignLoading) return;

    hasRehydratedRef.current = true;

    /* eslint-disable react-hooks/set-state-in-effect */
    if (campaignLoadError || !restoredCampaign) {
      clearCampaignProgress();
      setIsRehydrated(true);
      return;
    }

    // If the campaign has already moved past 'draft', the wizard has nothing
    // left to do — the user needs to go complete payment, not re-edit or
    // re-submit (submit is not safe to call twice).
    if (restoredCampaign.status !== 'draft') {
      setCampaignId(restoredCampaign.id);
      setAlreadySubmittedNotice(true);
      clearCampaignProgress();
      setIsRehydrated(true);
      return;
    }

    setCampaignId(restoredCampaign.id);
    setStep1Data(mapCampaignToStep1(restoredCampaign) as Step1Values);
    setStep2Data(mapCampaignToStep2(restoredCampaign));
    setStep3Data(mapCampaignToStep3(restoredCampaign));
    setCurrentStep(Math.min(restoredStep ?? 1, 4));
    setIsRehydrated(true);
  }, [restoredCampaignId, restoredCampaign, campaignLoading, campaignLoadError, restoredStep]);

  // Persist progress on every step/campaign change so a refresh or tab close
  // can resume exactly where the user left off.
  useEffect(() => {
    if (!campaignId) return;
    saveCampaignProgress({ campaignId, currentStep });
  }, [campaignId, currentStep]);

  const createCampaign = useCreateCampaign((id) => {
    setCampaignId(id);
    goTo(2);
  });

  const patchCampaign = usePatchCampaign(() => {
    // goTo(currentStep + 1);
  });

  const submitCampaign = useSubmitCampaign((bd, url) => {
    setBreakdown(bd);
    setPaymentUrl(url);
    goTo(5);
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

  // ── Step 1
  function handleStep1Next(data: Step1Values & { _coverFile?: File }) {
    setStep1Data(data);
    if (campaignId) {
      patchCampaign.mutate(
        {
          id: campaignId,
          payload: {
            currentStep: 1,
            title: data.title,
            goal: data.goal,
            totalBudget: Number(data.budget),
            creatorCategoryId: data.creatorTier,
            creatorNicheId: data.creatorNicheId,
            preferredPlatformIds: data.platforms,
            timeline: new Date(data.timeline).toISOString(),
            coverImage: data._coverFile,
          },
        },
        {
          onSuccess: () => {
            if (editingFromReview) {
              setEditingFromReview(false);
              goTo(4);
            } else {
              goTo(2);
            }
          },
        },
      );
      return;
    }

    createCampaign.mutate({
      title: data.title,
      goal: data.goal,
      totalBudget: Number(data.budget),
      creatorCategoryId: data.creatorTier,
      preferredPlatformIds: data.platforms,
      creatorNicheId: data.creatorNicheId,
      timeline: new Date(data.timeline).toISOString(),
      coverImage: data._coverFile,
    });
  }

  // ── Step 2

  function handleStep2Next(data: Step2Values) {
    setStep2Data(data);
    if (!campaignId) return;

    patchCampaign.mutate(
      {
        id: campaignId,
        payload: {
          currentStep: 2,
          campaignBrief: data.brief,
          deliverables: data.deliverables.map((d) => d.value).filter(Boolean),
          contentDirection: data.contentDirection.map((d) => d.value).filter(Boolean),
          contentGuidelines: {
            dos: data.dos.map((d) => d.value).filter(Boolean),
            donts: data.donts.map((d) => d.value).filter(Boolean),
          },
        },
      },
      {
        onSuccess: () => {
          if (editingFromReview) {
            setEditingFromReview(false);
            goTo(4);
          } else {
            goTo(3);
          }
        },
      },
    );
  }

  // ── Step 3
  function handleStep3Next(data: Step3Values) {
    setStep3Data(data);
    if (!campaignId) return;

    patchCampaign.mutate(
      {
        id: campaignId,
        payload: {
          currentStep: 3,
          usageRights: data.usageRights,
          successLooksLike: data.successDescription,
        },
      },
      {
        onSuccess: () => {
          setEditingFromReview(false);
          goTo(4);
        },
      },
    );
  }

  // ── Review → Edit
  function handleEditStep(step: 1 | 2 | 3) {
    setEditingFromReview(true);
    goTo(step);
  }

  // ── Step 4 (review → submit)
  function handleReviewNext() {
    if (!campaignId) return;
    submitCampaign.mutate(campaignId);
  }

  // ── Step 5 (pay)
  function handlePay() {
    if (!paymentUrl) return;
    window.location.href = paymentUrl;
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

  if (!isRehydrated) {
    return <CampaignDetailSkeleton />;
  }

  return (
    <>
      <CampaignPageShell currentStep={currentStep} onBack={handleBack}>
        {currentStep === 1 && (
          <StepDetails
            defaultValues={step1Data ?? undefined}
            onNext={handleStep1Next}
            onBack={handleBack}
            isLoading={createCampaign.isPending || patchCampaign.isPending}
          />
        )}

        {currentStep === 2 && (
          <StepCampaignBrief
            defaultValues={step2Data ?? undefined}
            onNext={handleStep2Next}
            onBack={() => goTo(1)}
            isLoading={patchCampaign.isPending}
          />
        )}

        {currentStep === 3 && (
          <StepSuccess
            defaultValues={step3Data ?? undefined}
            onNext={handleStep3Next}
            onBack={() => goTo(2)}
            isLoading={patchCampaign.isPending}
          />
        )}

        {currentStep === 4 && step1Data && step2Data && step3Data && (
          <StepReview
            step1={step1Data}
            step2={step2Data}
            step3={step3Data}
            onNext={handleReviewNext}
            onBack={() => goTo(3)}
            onEdit={handleEditStep}
            isLoading={submitCampaign.isPending}
          />
        )}

        {currentStep === 5 && breakdown && (
          <StepPayment breakdown={breakdown} onBack={() => goTo(4)} onPay={handlePay} />
        )}
      </CampaignPageShell>

      {showSuccessModal && (
        <CampaignSuccessModal campaignTitle={paidCampaignTitle} onNewCampaign={handleNewCampaign} />
      )}
    </>
  );
}
