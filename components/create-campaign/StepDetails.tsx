'use client';

import { useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { ImagePlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import StepFooter from './StepFooter';
import {
  stepDetailsSchema,
  type Step1Values,
  type Step1Input,
} from '@/lib/validations/createCampaignSchemas';
import { CAMPAIGN_GOALS, CONTENT_TYPES } from '@/types/campaign';
import { useCampaignPlatforms, useCreatorCategories } from '@/hooks/useCampaign';
import { ComboBox } from '@/shared/ComboBox';

interface StepDetailsProps {
  defaultValues?: Partial<Step1Input>;
  onNext: (data: Step1Values) => void;
  onBack: () => void;
  onSaveDraft?: (data: Step1Input) => void;
}

export default function StepDetails({
  defaultValues,
  onNext,
  onBack,
  onSaveDraft,
}: StepDetailsProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(defaultValues?.coverImage ?? null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const { data: platforms = [], isLoading: platformsLoading } = useCampaignPlatforms();
  const { data: creatorCategories = [], isLoading: categoriesLoading } = useCreatorCategories();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<Step1Input, unknown, Step1Values>({
    resolver: zodResolver(stepDetailsSchema),
    defaultValues: {
      platforms: [],
      ...defaultValues,
    },
  });

  const selectedPlatforms = useWatch({ control, name: 'platforms' }) ?? [];
  const selectedGoal = useWatch({ control, name: 'goal' });
  const selectedTier = useWatch({ control, name: 'creatorTier' });
  const selectedContentType = useWatch({ control, name: 'contentType' });

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    const url = URL.createObjectURL(file);
    setPreview(url);
    setValue('coverImage', url);
  }

  function togglePlatform(platformId: string) {
    const current = getValues('platforms') ?? [];
    const next = current.includes(platformId)
      ? current.filter((p) => p !== platformId)
      : [...current, platformId];
    setValue('platforms', next, { shouldValidate: true });
  }

  function handleSubmitWithFile(data: Step1Values) {
    onNext({ ...data, _coverFile: coverFile ?? undefined } as Step1Values);
  }

  const inputCls =
    'w-full border border-[#e8e6f0] rounded-md h-10 px-3 text-sm font-light text-[#1a1a2e] focus:outline-none focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink placeholder:text-[#c4c2d4]';

  return (
    <form onSubmit={handleSubmit(handleSubmitWithFile)} className="flex flex-col gap-5">
      {/* Cover image */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-[#1a1a2e]">Cover image</label>
        <div
          onClick={() => fileRef.current?.click()}
          className={cn(
            'relative w-full h-48 rounded-lg overflow-hidden border-2 border-dashed cursor-pointer transition-colors',
            preview ? 'border-transparent' : 'border-brand-pink/50 bg-[#fff5f9] hover:bg-[#ffeef4]',
          )}
        >
          {preview ? (
            <>
              <Image src={preview} alt="Cover" fill className="object-cover" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
                <span className="bg-white/90 text-sm font-medium px-4 py-1.5 rounded-full text-[#1a1a2e]">
                  Change photo
                </span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-2">
              <ImagePlus size={28} className="text-brand-pink" />
              <p className="text-sm text-[#1a1a2e] font-light">Tap to upload files</p>
              <p className="text-xs text-[#9a99b0]">PNG, JPG up to 10MB</p>
            </div>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>

      {/* Campaign title */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[#1a1a2e]">Campaign title</label>
        <input {...register('title')} placeholder="Enter campaign title" className={inputCls} />
        {errors.title && <p className="text-[11px] text-red-400">{errors.title.message}</p>}
      </div>

      {/* Campaign goal */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[#1a1a2e]">Campaign goal</label>
        <ComboBox
          options={CAMPAIGN_GOALS.map((g) => ({ value: g, label: g }))}
          value={selectedGoal}
          onValueChange={(val) =>
            setValue('goal', val as (typeof CAMPAIGN_GOALS)[number], { shouldValidate: true })
          }
          placeholder="Select campaign goal"
          searchPlaceholder="Search goal…"
          emptyText="No goal found."
        />
        {errors.goal && <p className="text-[11px] text-red-400">{errors.goal.message}</p>}
      </div>

      {/* Total budget */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[#1a1a2e]">Total budget</label>
        <input
          {...register('budget')}
          type="number"
          placeholder="Enter amount"
          className={inputCls}
        />
        {errors.budget && <p className="text-[11px] text-red-400">{errors.budget.message}</p>}
      </div>

      {/* Payment per creator */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[#1a1a2e]">Payment per creator</label>
        <input
          {...register('paymentPerCreator')}
          type="number"
          placeholder="Enter amount per creator"
          className={inputCls}
        />
        {errors.paymentPerCreator && (
          <p className="text-[11px] text-red-400">{errors.paymentPerCreator.message}</p>
        )}
      </div>

      {/* Content type */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[#1a1a2e]">Content type</label>
        <ComboBox
          options={CONTENT_TYPES.map((t) => ({ value: t, label: t }))}
          value={selectedContentType}
          onValueChange={(val) =>
            setValue('contentType', val as (typeof CONTENT_TYPES)[number], { shouldValidate: true })
          }
          placeholder="Select content type"
          searchPlaceholder="Search type…"
          emptyText="No type found."
        />
        {errors.contentType && (
          <p className="text-[11px] text-red-400">{errors.contentType.message}</p>
        )}
      </div>

      {/* Duration */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[#1a1a2e]">Duration (seconds)</label>
        <input
          {...register('duration')}
          type="number"
          min={1}
          max={90}
          placeholder="e.g. 30 (max 90s)"
          className={inputCls}
        />
        {errors.duration && <p className="text-[11px] text-red-400">{errors.duration.message}</p>}
      </div>

      {/* Creator tier — from API */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[#1a1a2e]">Creator tier</label>
        <ComboBox
          options={creatorCategories.map((cat) => ({ value: cat.id, label: cat.name }))}
          value={selectedTier}
          onValueChange={(val) => setValue('creatorTier', val, { shouldValidate: true })}
          placeholder="Select tier"
          searchPlaceholder="Search tier…"
          emptyText="No tier found."
          loading={categoriesLoading}
        />
        {errors.creatorTier && (
          <p className="text-[11px] text-red-400">{errors.creatorTier.message}</p>
        )}
      </div>

      {/* <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[#1a1a2e]">Creator niche</label>
        <ComboBox
          options={niches.map((n) => ({ value: n.id, label: n.name }))}
          value={selectedNiche}
          onValueChange={(val) => setValue('creatorNiche', val, { shouldValidate: true })}
          placeholder="Select niche"
          searchPlaceholder="Search niche…"
          emptyText="No niche found."
          loading={nichesLoading}
        />
        {errors.creatorNiche && (
          <p className="text-[11px] text-red-400">{errors.creatorNiche.message}</p>
        )}
      </div> */}

      {/* Platform — from API */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-[#1a1a2e]">Platform</label>
        {platformsLoading ? (
          <p className="text-sm text-[#9a99b0]">Loading platforms…</p>
        ) : (
          <div className="flex items-center gap-2 flex-wrap">
            {platforms.map((p) => {
              const isSelected = selectedPlatforms.includes(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => togglePlatform(p.id)}
                  className={cn(
                    'px-4 py-1.5 rounded-full text-sm font-light border transition-colors',
                    isSelected
                      ? 'border-brand-pink text-brand-pink bg-brand-pink/5'
                      : 'border-[#e8e6f0] text-[#7a7a9a] hover:border-brand-pink/50 hover:text-brand-pink/70',
                  )}
                >
                  {p.name}
                </button>
              );
            })}
          </div>
        )}
        {errors.platforms && <p className="text-[11px] text-red-400">{errors.platforms.message}</p>}
      </div>

      <StepFooter
        onBack={onBack}
        onSaveDraft={onSaveDraft ? () => onSaveDraft(getValues()) : undefined}
        onContinue={handleSubmit(handleSubmitWithFile)}
        continueDisabled={false}
      />
    </form>
  );
}
