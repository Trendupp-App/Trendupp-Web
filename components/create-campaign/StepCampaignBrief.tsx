'use client';

import {
  useForm,
  useFieldArray,
  type UseFormRegister,
  type FieldValues,
  type Path,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2, Plus } from 'lucide-react';
import StepFooter from './StepFooter';
import FieldLabel from './FieldLabel';
import TrendUppPlatformRules from './TrendUppPlatformRules';
import { FIELD_TOOLTIPS } from '@/lib/data/fieldTooltips';
import { stepCampaignBriefSchema, type Step2Values } from '@/lib/validations/createCampaignSchemas';

interface StepCampaignBriefProps {
  defaultValues?: Partial<Step2Values>;
  onNext: (data: Step2Values) => void;
  onBack: () => void;
  isLoading?: boolean;
}

function ListField<TFieldValues extends FieldValues>({
  label,
  tooltip,
  required,
  placeholder,
  fields,
  append,
  remove,
  register,
  name,
  error,
}: {
  label: string;
  tooltip?: string;
  required?: boolean;
  placeholder: string;
  fields: { id: string }[];
  append: () => void;
  remove: (index: number) => void;
  register: UseFormRegister<TFieldValues>;
  name: Path<TFieldValues>;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <FieldLabel label={label} tooltip={tooltip} required={required} />
      <div className="flex flex-col gap-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <div className="flex items-center gap-2 flex-1 border border-[#e8e6f0] rounded-md px-3 h-10 focus-within:border-brand-pink focus-within:ring-2 focus-within:ring-brand-pink/10">
              <span className="text-sm text-[#c4c2d4] shrink-0">{index + 1}.</span>
              <input
                {...register(`${name}.${index}.value` as Path<TFieldValues>)}
                placeholder={placeholder}
                className="flex-1 text-sm font-light text-[#1a1a2e] focus:outline-none placeholder:text-[#c4c2d4] bg-transparent"
              />
            </div>
            <button
              type="button"
              onClick={() => remove(index)}
              className="w-9 h-9 flex items-center justify-center rounded-md border border-[#e8e6f0] text-[#c4c2d4] hover:text-red-400 hover:border-red-200 transition-colors shrink-0"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={append}
        className="flex items-center gap-1.5 text-sm text-[#7a7a9a] hover:text-brand-pink transition-colors w-fit"
      >
        <Plus size={14} />
        Add another
      </button>
      {error && <p className="text-[11px] text-red-400">{error}</p>}
    </div>
  );
}

export default function StepCampaignBrief({
  defaultValues,
  onNext,
  onBack,
  isLoading,
}: StepCampaignBriefProps) {
  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<Step2Values>({
    resolver: zodResolver(stepCampaignBriefSchema),
    defaultValues: {
      brief: '',
      deliverables: [{ value: '' }],
      contentDirection: [{ value: '' }],
      dos: [{ value: '' }],
      donts: [{ value: '' }],
      ...defaultValues,
    },
  });

  const deliverables = useFieldArray({ control, name: 'deliverables' });
  const contentDirection = useFieldArray({ control, name: 'contentDirection' });
  const dos = useFieldArray({ control, name: 'dos' });
  const donts = useFieldArray({ control, name: 'donts' });

  return (
    <form className="flex flex-col gap-6">
      {/* Campaign brief */}
      <div className="flex flex-col gap-1.5">
        <FieldLabel label="Campaign brief" tooltip={FIELD_TOOLTIPS.campaignBrief} required />
        <textarea
          {...register('brief')}
          rows={4}
          placeholder="Describe your campaign goals, audience, and what you want creators to convey..."
          className="w-full border border-[#e8e6f0] rounded-md px-3 py-2.5 text-sm font-light text-[#1a1a2e] resize-none focus:outline-none focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink placeholder:text-[#c4c2d4]"
        />
        {errors.brief && <p className="text-[11px] text-red-400">{errors.brief.message}</p>}
      </div>

      <ListField
        label="Deliverables"
        tooltip={FIELD_TOOLTIPS.deliverables}
        required
        placeholder="e.g. 1x Instagram Reel (30–60 seconds)"
        fields={deliverables.fields}
        append={() => deliverables.append({ value: '' })}
        remove={deliverables.remove}
        register={register}
        name="deliverables"
        error={errors.deliverables?.message}
      />

      <ListField
        label="Content direction"
        tooltip={FIELD_TOOLTIPS.contentDirection}
        required
        placeholder="e.g. Show yourself actively using the product outdoors"
        fields={contentDirection.fields}
        append={() => contentDirection.append({ value: '' })}
        remove={contentDirection.remove}
        register={register}
        name="contentDirection"
        error={errors.contentDirection?.message}
      />

      <ListField
        label="Content guidelines - Do's"
        tooltip={FIELD_TOOLTIPS.dos}
        required
        placeholder="e.g. Use natural lighting throughout the video"
        fields={dos.fields}
        append={() => dos.append({ value: '' })}
        remove={dos.remove}
        register={register}
        name="dos"
        error={errors.dos?.message}
      />

      <ListField
        label="Content guidelines - Dont's"
        tooltip={FIELD_TOOLTIPS.donts}
        required
        placeholder="e.g. Do not feature or mention competitor products"
        fields={donts.fields}
        append={() => donts.append({ value: '' })}
        remove={donts.remove}
        register={register}
        name="donts"
        error={errors.donts?.message}
      />

      <TrendUppPlatformRules />

      <StepFooter onBack={onBack} onContinue={handleSubmit(onNext)} isLoading={isLoading} />
    </form>
  );
}
