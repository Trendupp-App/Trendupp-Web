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
import { CAMPAIGN_GOALS } from '@/types/campaign';
import { useCampaignPlatforms, useCreatorCategories } from '@/hooks/useCampaign';
import { ComboBox } from '@/shared/ComboBox';
import { useNiches, useCountries } from '@/hooks/useOnboardingQueries';
import { MultiSelectDropdown } from '@/shared/MultiSelectDropDown';
import {
  formatTierFollowerRange,
  formatMinCostLabel,
  formatMinCostUsdLabel,
} from '@/utils/Utilities';
import { useAuthStore } from '@/store/authStore';
import FieldLabel from './FieldLabel';
import { FIELD_TOOLTIPS } from '@/lib/data/fieldTooltips';

interface StepDetailsProps {
  defaultValues?: Partial<Step1Input>;
  onNext: (data: Step1Values) => void;
  onBack: () => void;
  isLoading?: boolean;
}

export default function StepDetails({
  defaultValues,
  onNext,
  onBack,
  isLoading,
}: StepDetailsProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(defaultValues?.coverImage ?? null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const { data: platforms = [], isLoading: platformsLoading } = useCampaignPlatforms();
  const { data: creatorCategories = [], isLoading: categoriesLoading } = useCreatorCategories();
  const { data: niches = [], isLoading: nichesLoading } = useNiches();
  const { data: countries = [] } = useCountries();
  const user = useAuthStore((s) => s.user);
  const isNigerianBrand = countries.find((c) => c.id === user?.countryId)?.name === 'Nigeria';

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
      creatorTierIds: [],
      creatorNicheIds: [],
      ...defaultValues,
    },
  });

  const selectedPlatforms = useWatch({ control, name: 'platforms' }) ?? [];
  const selectedGoal = useWatch({ control, name: 'goal' });
  const budget = useWatch({ control, name: 'budget' }) ?? '';
  const selectedTierIds = useWatch({ control, name: 'creatorTierIds' }) ?? [];
  // const selectedTier = useWatch({ control, name: 'creatorTier' });
  const selectedNicheIds = useWatch({ control, name: 'creatorNicheIds' }) ?? [];
  // const selectedNiche = useWatch({ control, name: 'creatorNicheId' });

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    const url = URL.createObjectURL(file);
    setPreview(url);
    setValue('coverImage', url);
  }

  // function togglePlatform(platformId: string) {
  //   const current = getValues('platforms') ?? [];
  //   const next = current.includes(platformId)
  //     ? current.filter((p) => p !== platformId)
  //     : [...current, platformId];
  //   setValue('platforms', next, { shouldValidate: true });
  // }

  function handleSubmitWithFile(data: Step1Values) {
    onNext({ ...data, _coverFile: coverFile ?? undefined } as Step1Values);
  }

  function handleBudgetChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/[^\d]/g, '');
    setValue('budget', digits, { shouldValidate: true });
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
        <FieldLabel label="Campaign title" required />
        <input {...register('title')} placeholder="Enter campaign title" className={inputCls} />
        {errors.title && <p className="text-[11px] text-red-400">{errors.title.message}</p>}
      </div>

      {/* Campaign goal */}
      <div className="flex flex-col gap-1.5">
        <FieldLabel label="Campaign goal" required />
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
        {selectedGoal === 'Amplify Content' && (
          <div className="flex flex-col gap-1.5 mt-2">
            <FieldLabel label="Link to content for amplification" required />
            <input
              {...register('amplificationAsset')}
              placeholder="https://drive.google.com/..."
              className={inputCls}
            />
            {errors.amplificationAsset && (
              <p className="text-[11px] text-red-400">{errors.amplificationAsset.message}</p>
            )}
          </div>
        )}
      </div>

      {/* Total budget */}
      <div className="flex flex-col gap-1.5">
        <FieldLabel label="Total budget" required />
        <input
          type="text"
          inputMode="numeric"
          value={budget ? Number(budget).toLocaleString('en-US') : ''}
          onChange={handleBudgetChange}
          placeholder="Enter amount"
          className={inputCls}
        />
        {errors.budget && <p className="text-[11px] text-red-400">{errors.budget.message}</p>}
      </div>

      {/* Creator tier — from API */}
      <div className="flex flex-col gap-1.5">
        <FieldLabel label="Creator tier" required />
        <MultiSelectDropdown
          options={creatorCategories.map((cat) => ({
            value: cat.id,
            label: cat.name,
            sublabel: formatTierFollowerRange(cat.minFollowers, cat.maxFollowers),
            meta: isNigerianBrand
              ? formatMinCostLabel(cat.minCostCreateNaira)
              : formatMinCostUsdLabel(cat.minCostCreateUsd),
          }))}
          selected={selectedTierIds}
          onChange={(vals) => setValue('creatorTierIds', vals, { shouldValidate: true })}
          placeholder="Select tier"
          loading={categoriesLoading}
          max={3}
        />
        {errors.creatorTierIds && (
          <p className="text-[11px] text-red-400">{errors.creatorTierIds.message}</p>
        )}
      </div>
      {/* <div className="flex flex-col gap-1.5">
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
      </div> */}

      {/* Creator niche — multiselect */}
      <div className="flex flex-col gap-1.5">
        <FieldLabel label="Creator niche" tooltip={FIELD_TOOLTIPS.creatorNiche} required />
        <MultiSelectDropdown
          options={niches.map((n) => ({ value: n.id, label: n.name }))}
          selected={selectedNicheIds}
          onChange={(vals) => setValue('creatorNicheIds', vals, { shouldValidate: true })}
          placeholder="Select niche"
          loading={nichesLoading}
          max={3}
        />
        {errors.creatorNicheIds && (
          <p className="text-[11px] text-red-400">{errors.creatorNicheIds.message}</p>
        )}
      </div>

      {/* <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[#1a1a2e]">Creator niche</label>
        <ComboBox
          options={niches.map((n) => ({ value: n.id, label: n.name }))}
          value={selectedNiche}
          onValueChange={(val) => setValue('creatorNicheId', val, { shouldValidate: true })}
          placeholder="Select niche"
          searchPlaceholder="Search niche…"
          emptyText="No niche found."
          loading={nichesLoading}
        />
        {errors.creatorNicheId && (
          <p className="text-[11px] text-red-400">{errors.creatorNicheId.message}</p>
        )}
      </div> */}

      {/* Platform — from API */}
      <div className="flex flex-col gap-1.5">
        <FieldLabel label="Platform" tooltip={FIELD_TOOLTIPS.platform} required />
        <MultiSelectDropdown
          options={platforms.map((p) => ({ value: p.id, label: p.name }))}
          selected={selectedPlatforms}
          onChange={(vals) => setValue('platforms', vals, { shouldValidate: true })}
          placeholder="Select platforms"
          loading={platformsLoading}
        />
        {errors.platforms && <p className="text-[11px] text-red-400">{errors.platforms.message}</p>}
      </div>
      {/* <div className="flex flex-col gap-2">
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
                    'px-4 py-1.5 cursor-pointer rounded-full text-sm font-light border transition-colors',
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
      </div> */}

      <StepFooter
        onBack={onBack}
        onContinue={handleSubmit(handleSubmitWithFile)}
        continueDisabled={false}
        isLoading={isLoading}
      />
    </form>
  );
}
