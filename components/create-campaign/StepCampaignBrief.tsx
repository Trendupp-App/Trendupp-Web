'use client';

import {
  useForm,
  useFieldArray,
  type UseFormRegister,
  type FieldValues,
  type Path,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Trash2, Plus } from 'lucide-react';
import StepFooter from './StepFooter';

// ── Schema ────────────────────────────────────────────────────────────────────
const listItemSchema = z.object({ value: z.string() });

const schema = z.object({
  brief: z.string().min(1, 'Campaign brief is required'),
  deliverables: z.array(listItemSchema).min(1, 'Add at least one deliverable'),
  contentDirection: z.array(listItemSchema),
  dos: z.array(listItemSchema),
  donts: z.array(listItemSchema),
});

export type Step2Values = z.infer<typeof schema>;

interface StepCampaignBriefProps {
  defaultValues?: Partial<Step2Values>;
  onNext: (data: Step2Values) => void;
  onBack: () => void;
  onSaveDraft?: (data: Step2Values) => void;
}

// ── Fix: use the generic base type UseFormRegister<FieldValues> so any
//    strongly-typed register is assignable to it ────────────────────────────
function ListField<TFieldValues extends FieldValues>({
  label,
  placeholder,
  fields,
  append,
  remove,
  register,
  name,
  error,
}: {
  label: string;
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
      <label className="text-sm font-medium text-[#1a1a2e]">{label}</label>
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
  onSaveDraft,
}: StepCampaignBriefProps) {
  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<Step2Values>({
    resolver: zodResolver(schema),
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
        <label className="text-sm font-medium text-[#1a1a2e]">Campaign brief</label>
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
        placeholder="e.g. 1x Instagram Reel (30–60 seconds)"
        fields={deliverables.fields}
        append={() => deliverables.append({ value: '' })}
        remove={deliverables.remove}
        register={register as UseFormRegister<FieldValues>}
        name="deliverables"
        error={errors.deliverables?.message}
      />

      <ListField
        label="Content direction"
        placeholder="e.g. Show yourself actively using the product outdoors"
        fields={contentDirection.fields}
        append={() => contentDirection.append({ value: '' })}
        remove={contentDirection.remove}
        register={register as UseFormRegister<FieldValues>}
        name="contentDirection"
      />

      <ListField
        label="Content guidelines - Do's"
        placeholder="e.g. Use natural lighting throughout the video"
        fields={dos.fields}
        append={() => dos.append({ value: '' })}
        remove={dos.remove}
        register={register as UseFormRegister<FieldValues>}
        name="dos"
      />

      <ListField
        label="Content guidelines - Dont's"
        placeholder="e.g. Do not feature or mention competitor products"
        fields={donts.fields}
        append={() => donts.append({ value: '' })}
        remove={donts.remove}
        register={register as UseFormRegister<FieldValues>}
        name="donts"
      />

      <StepFooter
        onBack={onBack}
        onSaveDraft={onSaveDraft ? () => onSaveDraft(getValues()) : undefined}
        onContinue={handleSubmit(onNext)}
      />
    </form>
  );
}
