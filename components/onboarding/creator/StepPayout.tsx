'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { schema, Values } from '@/lib/validations/payoutFormSchema';
import { BankCombobox } from '@/shared/BankComboBox';
import { useUpdatePayout } from '@/hooks/useOnboardingMutations';

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
    control,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ?? {},
  });

  const bankName = useWatch({ control, name: 'bankName' });
  const bankId = useWatch({ control, name: 'bankId' });

  const { mutate: updatePayout, isPending } = useUpdatePayout();
  const saving = isSubmitting || isPending;

  function onSubmit(values: Values) {
    updatePayout(
      {
        bankId: values.bankId,
        bankAccountNumber: values.accountNumber,
        bankAccountName: values.bankAccountName,
      },
      {
        onSuccess: () => onNext(values),
      },
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
      {/* Warning banner */}
      <div className="flex gap-2 bg-red-50 border border-red-100 rounded-xl p-3.5">
        <AlertCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
        <p className="text-xs text-red-500 leading-relaxed">
          Your account name must match the name on your Trendupp profile. If your profile says
          &apos;Alex Okafor&apos;, your bank account must also be registered under &apos;Alex
          Okafor&apos; or a close variation. Mismatched names will delay your payouts.
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-sm font-light text-[#1a1a2e]">Bank Name</Label>
        <BankCombobox
          value={bankName ? { id: bankId, name: bankName } : null}
          onChange={(bank) => {
            setValue('bankName', bank.name, { shouldValidate: true });
            setValue('bankId', bank.id, { shouldValidate: true });
          }}
          error={errors.bankName?.message ?? errors.bankId?.message}
        />
      </div>

      {/* Account Number */}
      <div className="flex flex-col gap-1">
        <Label className="text-sm font-light text-[#1a1a2e]">Account Number</Label>
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

      <div className="flex flex-col gap-1">
        <Label className="text-sm font-light text-[#1a1a2e]">Account Holder Name</Label>
        <Input
          {...register('bankAccountName')}
          placeholder="Name on the bank account"
          className="border-[#e8e6f0] h-10 text-xs font-light focus-visible:ring-brand-pink/30 focus-visible:border-brand-pink"
        />
        {errors.bankAccountName && (
          <p className="text-[11px] text-red-400">{errors.bankAccountName.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={saving}
        className="w-full shadow-xl shadow-brand-pink-light bg-brand-pink rounded-md h-12 text-[15px] font-light text-white mt-2 flex items-center justify-center gap-2 disabled:bg-brand-pink/40"
      >
        {saving ? 'Saving...' : 'Submit'}
        {!saving && (
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
        )}
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
