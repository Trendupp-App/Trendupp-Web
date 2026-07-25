'use client';

import { useRef, useState } from 'react';
import { ArrowLeft, X, CloudUpload } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTicketCategories, useCreateTicket } from '@/hooks/useBrandProfileMutations';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const schema = z.object({
  issueCategoryId: z.string().min(1, 'Select a category'),
  subject: z.string().min(1, 'Enter a subject'),
  description: z.string().min(10, 'Please describe your issue'),
});

type Values = z.infer<typeof schema>;

interface SubmitTicketViewProps {
  onBack: () => void;
  onClose: () => void;
}

export default function SubmitTicketView({ onBack, onClose }: SubmitTicketViewProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [attachment, setAttachment] = useState<File | null>(null);
  const { data: categories = [] } = useTicketCategories();
  const { mutate: createTicket, isPending } = useCreateTicket(onClose);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
  });

  function onSubmit(values: Values) {
    createTicket({ ...values, ...(attachment ? { attachment } : {}) });
  }

  const inputCls =
    'w-full border border-[#e8e6f0] rounded-lg px-3 text-sm font-light text-[#1a1a2e] focus:outline-none focus:border-brand-pink focus:ring-1 focus:ring-brand-pink/20 placeholder:text-[#c4c2d4]';

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-[#7a7a9a] hover:text-[#1a1a2e] transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <button onClick={onClose} className="text-[#9a99b0] hover:text-[#1a1a2e] transition-colors">
          <X size={18} />
        </button>
      </div>

      <div>
        <h2 className="text-base font-semibold text-[#1a1a2e]">Submit a ticket</h2>
        <p className="text-sm text-[#9a99b0] mt-0.5">
          Describe your issue below. We&apos;ll get back to you as soon as possible.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Category */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-[#1a1a2e]">Issue category</label>
          <Select onValueChange={(v) => setValue('issueCategoryId', v, { shouldValidate: true })}>
            <SelectTrigger className="border-[#e8e6f0] h-10 text-sm font-light focus:ring-brand-pink/30">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.issueCategoryId && (
            <p className="text-[11px] text-red-400">{errors.issueCategoryId.message}</p>
          )}
        </div>

        {/* Subject */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-[#1a1a2e]">Subject</label>
          <input
            {...register('subject')}
            placeholder="Brief summary of your issue"
            className={`${inputCls} h-10`}
          />
          {errors.subject && <p className="text-[11px] text-red-400">{errors.subject.message}</p>}
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-[#1a1a2e]">Description</label>
          <textarea
            {...register('description')}
            rows={4}
            placeholder="Please provide as much detail as possible to help us resolve your issue quickly."
            className={`${inputCls} py-2.5 resize-none`}
          />
          {errors.description && (
            <p className="text-[11px] text-red-400">{errors.description.message}</p>
          )}
        </div>

        {/* Attachment */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-[#1a1a2e]">Attachment (Optional)</label>
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-[#e8e6f0] rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer hover:border-brand-pink/40 transition-colors"
          >
            <CloudUpload size={28} className="text-brand-pink" />
            {attachment ? (
              <p className="text-sm font-medium text-brand-pink">{attachment.name}</p>
            ) : (
              <>
                <p className="text-sm text-[#1a1a2e]">Tap to upload files</p>
                <p className="text-xs text-[#9a99b0]">PNG, JPG, PDF up to 10MB</p>
              </>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept=".png,.jpg,.jpeg,.pdf"
            className="hidden"
            onChange={(e) => setAttachment(e.target.files?.[0] ?? null)}
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3.5 bg-brand-pink text-white text-sm font-medium rounded-xl hover:bg-brand-pink/90 transition-colors disabled:opacity-60 mt-1"
        >
          {isPending ? 'Submitting…' : 'Submit'}
        </button>
      </form>
    </div>
  );
}
