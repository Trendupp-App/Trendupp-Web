'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import CampaignPageShell from '@/components/create-campaign/CampaignPageShell';
import StepDetails from '@/components/create-campaign/StepDetails';
import { type Step2Values } from '@/lib/validations/createCampaignSchemas';
import StepCampaignBrief from '@/components/create-campaign/StepCampaignBrief';
import StepReview from '@/components/create-campaign/StepReview';
import { type Step1Values } from '@/lib/validations/createCampaignSchemas';
import {
  useCreateCampaign,
  usePatchCampaign,
  useSubmitCampaign,
  useCampaign,
} from '@/hooks/useCampaign';
import StepPayment from '@/components/create-campaign/StepPayment';
import type { PaymentBreakdown } from '@/types/campaign';
import { mapCampaignToStep1, mapCampaignToStep2 } from '@/lib/mapCampaignToSteps';
import CampaignDetailSkeleton from '@/components/skeletons/CampaignDetailsSkeleton';

export default function NewCampaignPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const draftId = searchParams.get('draft');
  const [currentStep, setCurrentStep] = useState(1);
  const [step1Data, setStep1Data] = useState<Step1Values | null>(null);
  const [step2Data, setStep2Data] = useState<Step2Values | null>(null);
  const [campaignId, setCampaignId] = useState<string | null>(null);
  const [breakdown, setBreakdown] = useState<PaymentBreakdown | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [editingFromReview, setEditingFromReview] = useState(false);
  const [isHydratingDraft, setIsHydratingDraft] = useState(!!draftId);
  const [draftNotEditable, setDraftNotEditable] = useState(false);
  const hasHydratedDraftRef = useRef(false);

  const {
    data: draftCampaign,
    isLoading: draftLoading,
    isError: draftLoadError,
  } = useCampaign(draftId);

  useEffect(() => {
    if (!draftId) return;
    if (hasHydratedDraftRef.current) return;
    if (draftLoading) return;

    hasHydratedDraftRef.current = true;

    /* eslint-disable react-hooks/set-state-in-effect */
    if (draftLoadError || !draftCampaign) {
      setDraftNotEditable(true);
      setIsHydratingDraft(false);
      return;
    }

    // Hard gate: only 'draft' status campaigns get loaded into the wizard.
    // Submitted/live/active/completed campaigns are explicitly out of scope
    // for this resume flow — never re-enter the wizard for those.
    if (draftCampaign.status !== 'draft') {
      setDraftNotEditable(true);
      setIsHydratingDraft(false);
      return;
    }

    setCampaignId(draftCampaign.id);
    setStep1Data(mapCampaignToStep1(draftCampaign) as Step1Values);
    setStep2Data(mapCampaignToStep2(draftCampaign));
    setCurrentStep(Math.min(draftCampaign.currentStep, 3));
    setIsHydratingDraft(false);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [draftId, draftCampaign, draftLoading, draftLoadError]);
  const createCampaign = useCreateCampaign((id) => {
    setCampaignId(id);
    goTo(2);
  });

  const patchCampaign = usePatchCampaign();

  const submitCampaign = useSubmitCampaign((bd, url) => {
    setBreakdown(bd);
    setPaymentUrl(url);
    goTo(4);
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
            creatorCategoryIds: data.creatorTierIds,
            creatorNicheIds: data.creatorNicheIds,
            preferredPlatformIds: data.platforms,
            coverImage: data._coverFile,
          },
        },
        {
          onSuccess: () => {
            if (editingFromReview) {
              setEditingFromReview(false);
              goTo(3);
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
      creatorCategoryIds: data.creatorTierIds,
      creatorNicheIds: data.creatorNicheIds,
      preferredPlatformIds: data.platforms,
      coverImage: data._coverFile,
      amplificationAsset: data.goal === 'Amplify Content' ? data.amplificationAsset : undefined,
    });
  }

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
          setEditingFromReview(false);
          goTo(3);
        },
      },
    );
  }

  function handleEditStep(step: 1 | 2) {
    setEditingFromReview(true);
    goTo(step);
  }

  function handleReviewNext() {
    if (!campaignId) return;
    if (submitCampaign.isPending) return;
    submitCampaign.mutate(campaignId);
  }

  function handlePay() {
    if (!paymentUrl) return;
    window.open(paymentUrl, '_blank', 'noopener,noreferrer');
    router.push('/brand/campaign');
  }

  if (isHydratingDraft) {
    return <CampaignDetailSkeleton />;
  }

  if (draftNotEditable) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="max-w-md text-center flex flex-col items-center gap-3">
          <h2 className="text-xl font-bold text-[#1a1a2e]">This campaign isn&apos;t editable</h2>
          <p className="text-sm text-[#7a7a9a]">
            This campaign is no longer in draft — it may already be submitted, live, or completed.
          </p>
          <button
            onClick={() => router.push('/brand/campaign')}
            className="mt-2 px-6 py-2.5 bg-brand-pink text-white text-sm font-medium rounded-md hover:bg-brand-pink/90 transition-colors cursor-pointer"
          >
            Back to campaigns
          </button>
        </div>
      </div>
    );
  }

  return (
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

      {currentStep === 3 && step1Data && step2Data && (
        <StepReview
          step1={step1Data}
          step2={step2Data}
          onNext={handleReviewNext}
          onBack={() => goTo(2)}
          onEdit={handleEditStep}
          isLoading={submitCampaign.isPending}
        />
      )}

      {currentStep === 4 && breakdown && paymentUrl && (
        <StepPayment breakdown={breakdown} onBack={() => goTo(3)} onPay={handlePay} />
      )}
    </CampaignPageShell>
  );
}
