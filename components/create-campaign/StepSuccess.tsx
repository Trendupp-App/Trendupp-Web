'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronDown, ChevronUp } from 'lucide-react';
import StepFooter from './StepFooter';

// ── Schema ────────────────────────────────────────────────────────────────────
const schema = z.object({
  successDescription: z.string().min(1, 'Please describe what success looks like'),
  usageRights: z.string().min(1, 'Please describe your usage rights'),
});

export type Step3Values = z.infer<typeof schema>;

const PLATFORM_RULES = [
  'Content must not contain explicit, hateful, or politically sensitive material.',
  'All sponsored content must be clearly disclosed (#ad or Paid Partnership).',
  'Creators retain copyright; brands receive usage rights as specified.',
  'Content must go live within 7 days of approval.',
  'Trendupp reserves the right to flag content that violates community standards.',
];

interface StepSuccessProps {
  defaultValues?: Partial<Step3Values>;
  onNext: (data: Step3Values) => void;
  onBack: () => void;
  onSaveDraft?: (data: Step3Values) => void;
}

export default function StepSuccess({
  defaultValues,
  onNext,
  onBack,
  onSaveDraft,
}: StepSuccessProps) {
  const [rulesOpen, setRulesOpen] = useState(true);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<Step3Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      successDescription: '',
      usageRights: '',
      ...defaultValues,
    },
  });

  const textareaCls =
    'w-full border border-[#e8e6f0] rounded-md px-3 py-2.5 text-sm font-light text-[#1a1a2e] resize-none focus:outline-none focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink placeholder:text-[#c4c2d4]';

  return (
    <form className="flex flex-col gap-6">
      {/* What success looks like */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[#1a1a2e]">What Success Looks Like</label>
        <p className="text-xs text-[#9a99b0]">
          Describe the KPIs, outcomes, or feeling you&apos;re optimizing for. This helps creators
          align their creative decisions with your goals.
        </p>
        <textarea
          {...register('successDescription')}
          rows={5}
          placeholder="Describes success"
          className={textareaCls}
        />
        {errors.successDescription && (
          <p className="text-[11px] text-red-400">{errors.successDescription.message}</p>
        )}
      </div>

      {/* Usage rights */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[#1a1a2e]">Usage rights</label>
        <p className="text-xs text-[#9a99b0]">
          Specify how you may use creator content after the campaign (e.g. reposts, paid ads,
          white-labelling)
        </p>
        <textarea
          {...register('usageRights')}
          rows={5}
          placeholder="Describe success right"
          className={textareaCls}
        />
        {errors.usageRights && (
          <p className="text-[11px] text-red-400">{errors.usageRights.message}</p>
        )}
      </div>

      {/* Trendupp platform rules */}
      <div className="border border-[#e8e6f0] rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => setRulesOpen((o) => !o)}
          className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-[#faf9fc] transition-colors"
        >
          <span className="text-sm font-medium text-[#1a1a2e]">Trendupp platform rules</span>
          {rulesOpen ? (
            <ChevronUp size={16} className="text-[#9a99b0]" />
          ) : (
            <ChevronDown size={16} className="text-[#9a99b0]" />
          )}
        </button>

        {rulesOpen && (
          <div className="px-4 pb-4 flex flex-col gap-2.5 border-t border-[#e8e6f0] pt-3">
            {PLATFORM_RULES.map((rule, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-brand-pink text-white text-[10px] font-medium flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm font-light text-[#4a4a6a]">{rule}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <StepFooter
        onBack={onBack}
        onSaveDraft={onSaveDraft ? () => onSaveDraft(getValues()) : undefined}
        onContinue={handleSubmit(onNext)}
      />
    </form>
  );
}
