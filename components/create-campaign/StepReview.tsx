'use client';

import Image from 'next/image';
import StepFooter from './StepFooter';
import { type Step1Values } from '@/lib/validations/createCampaignSchemas';
import type { Step2Values } from '@/lib/validations/createCampaignSchemas';
import type { Step3Values } from './StepSuccess';
import { useCreatorCategories, useCampaignPlatforms } from '@/hooks/useCampaign';

interface StepReviewProps {
  step1: Step1Values;
  step2: Step2Values;
  step3: Step3Values;
  onNext: () => void;
  onBack: () => void;
  onSaveDraft?: () => void;
  isLoading?: boolean;
}

function ReviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-[#e8e6f0] rounded-lg overflow-hidden">
      <div className="px-4 py-3 bg-[#faf9fc] border-b border-[#e8e6f0]">
        <h3 className="text-sm font-medium text-[#1a1a2e]">{title}</h3>
      </div>
      <div className="px-4 py-4 flex flex-col gap-3">{children}</div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value?: string | number }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-sm text-[#9a99b0] font-light shrink-0">{label}</span>
      <span className="text-sm text-[#1a1a2e] font-light text-right">{value ?? '—'}</span>
    </div>
  );
}

function ReviewList({ label, items }: { label: string; items: { value: string }[] }) {
  const filled = items.filter((i) => i.value.trim());
  if (!filled.length) return null;
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-[#9a99b0] font-light">{label}</span>
      <ul className="flex flex-col gap-1 pl-2">
        {filled.map((item, idx) => (
          <li key={idx} className="text-sm text-[#1a1a2e] font-light flex items-start gap-1.5">
            <span className="text-[#c4c2d4] shrink-0">{idx + 1}.</span>
            {item.value}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function StepReview({
  step1,
  step2,
  step3,
  onNext,
  onBack,
  onSaveDraft,
  isLoading,
}: StepReviewProps) {
  // Resolve IDs → human-readable names
  const { data: creatorCategories = [] } = useCreatorCategories();
  const { data: platforms = [] } = useCampaignPlatforms();

  const tierName =
    creatorCategories.find((c) => c.id === step1.creatorTier)?.name ?? step1.creatorTier;
  const platformNames = step1.platforms
    .map((id) => platforms.find((p) => p.id === id)?.name ?? id)
    .join(', ');

  return (
    <div className="flex flex-col gap-5">
      {/* Cover image preview */}
      {step1.coverImage && (
        <div className="relative w-full h-44 rounded-lg overflow-hidden border border-[#e8e6f0]">
          <Image src={step1.coverImage} alt="Campaign cover" fill className="object-cover" />
        </div>
      )}

      {/* Section 1: Campaign details */}
      <ReviewSection title="Campaign details">
        <ReviewRow label="Title" value={step1.title} />
        <ReviewRow label="Goal" value={step1.goal} />
        <ReviewRow
          label="Budget"
          value={step1.budget ? `₦${Number(step1.budget).toLocaleString()}` : undefined}
        />
        <ReviewRow label="Creator tier" value={tierName} />
        <ReviewRow label="Platforms" value={platformNames} />
      </ReviewSection>

      {/* Section 2: Campaign brief */}
      <ReviewSection title="Campaign brief">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-[#9a99b0] font-light">Brief</span>
          <p className="text-sm text-[#1a1a2e] font-light leading-relaxed">{step2.brief}</p>
        </div>
        <ReviewList label="Deliverables" items={step2.deliverables} />
        <ReviewList label="Content direction" items={step2.contentDirection} />
        <ReviewList label="Do's" items={step2.dos} />
        <ReviewList label="Don'ts" items={step2.donts} />
      </ReviewSection>

      {/* Section 3: Success */}
      <ReviewSection title="Success criteria">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-[#9a99b0] font-light">What success looks like</span>
          <p className="text-sm text-[#1a1a2e] font-light leading-relaxed">
            {step3.successDescription}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm text-[#9a99b0] font-light">Usage rights</span>
          <p className="text-sm text-[#1a1a2e] font-light leading-relaxed">{step3.usageRights}</p>
        </div>
      </ReviewSection>

      <StepFooter
        onBack={onBack}
        onSaveDraft={onSaveDraft}
        onContinue={onNext}
        continueLabel="Continue to payment"
        isLoading={isLoading}
      />
    </div>
  );
}
