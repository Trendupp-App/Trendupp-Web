'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { schema, Values } from '@/lib/validations/payoutFormSchema';

const BANKS = [
  'Access Bank',
  'First Bank',
  'GTBank',
  'Zenith Bank',
  'UBA',
  'Fidelity Bank',
  'Sterling Bank',
  'Wema Bank',
  'Polaris Bank',
  'Keystone Bank',
  'Union Bank',
];

interface Props {
  onNext: (data: Values) => void;
  onSkip: () => void;
  defaultValues?: Partial<Values>;
}

export default function StepPayout({ onNext, onSkip, defaultValues }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ?? {},
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="flex flex-col gap-4 w-full">
      {/* Warning banner */}
      <div className="flex gap-2 bg-red-50 border border-red-100 rounded-xl p-3.5">
        <AlertCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
        <p className="text-xs text-red-500 leading-relaxed">
          Your account name must match the name on your Trendupp profile. If your profile says
          &apos;Alex Okafor&apos;, your bank account must also be registered under &apos;Alex
          Okafor&apos; or a close variation. Mismatched names will delay your payouts.
        </p>
      </div>

      {/* Bank Name */}
      <div className="flex flex-col gap-1">
        <Label className="text-sm font-light text-[#1a1a2e]">Bank Name</Label>
        <Select
          onValueChange={(v) => setValue('bankName', v)}
          defaultValue={defaultValues?.bankName}
        >
          <SelectTrigger className="border-[#e8e6f0] w-full h-10 text-xs font-light focus:ring-brand-pink/30 focus:border-brand-pink">
            <SelectValue placeholder="Select bank" />
          </SelectTrigger>
          <SelectContent>
            {BANKS.map((bank) => (
              <SelectItem key={bank} value={bank}>
                {bank}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.bankName && <p className="text-[11px] text-red-400">{errors.bankName.message}</p>}
      </div>

      {/* Account Number */}
      <div className="flex flex-col gap-1">
        <Label className="text-sm font-light text-[#1a1a2e]">Account number</Label>
        <Input
          {...register('accountNumber')}
          placeholder="10 digit account number"
          maxLength={10}
          inputMode="numeric"
          className="border-[#e8e6f0] h-10 text-xs font-light focus-visible:ring-brand-pink/30 focus-visible:border-brand-pink"
        />
        {errors.accountNumber && (
          <p className="text-[11px] text-red-400">{errors.accountNumber.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full shadow-xl shadow-brand-pink-light bg-brand-pink rounded-md h-12 text-[15px] font-light text-white mt-2 flex items-center justify-center gap-2 disabled:bg-brand-pink-light"
      >
        Submit
        <svg
          width="16"
          height="16"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </Button>

      <p className="text-xs text-[#9a99b0] text-center leading-relaxed">
        Your profile will be reviewed by Trendupp within 24–48 hours after submission.
      </p>

      <button
        type="button"
        onClick={onSkip}
        className="text-sm text-[#7a7a9a] underline underline-offset-2 hover:text-[#1a1a2e] text-center transition-colors"
      >
        I&apos;ll do that later
      </button>
    </form>
  );
}
