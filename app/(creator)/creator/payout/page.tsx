'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { schema, Values } from '@/lib/validations/payoutFormSchema';
import { BankCombobox } from '@/shared/BankComboBox';
import { useAuthStore } from '@/store/authStore';
import { useUpdateProfilePayout } from '@/hooks/useProfile';

export default function CreatorPayoutPage() {
  const { user } = useAuthStore();
  const { mutate: updatePayout, isPending } = useUpdateProfilePayout();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      bankName: user?.bankName || '',
      bankId: '',
      accountNumber: user?.bankAccountNumber || '',
      bankAccountName: user?.bankAccountName || '',
    },
  });

  const bankName = useWatch({ control, name: 'bankName' });
  const bankId = useWatch({ control, name: 'bankId' });

  const saving = isSubmitting || isPending;

  function onSubmit(values: Values) {
    updatePayout({
      bankId: values.bankId,
      bankAccountNumber: values.accountNumber,
      bankAccountName: values.bankAccountName,
    });
  }

  return (
    <div className="flex flex-col gap-6 w-full pb-12 select-none">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-[28px] font-bold text-[#1a1a2e] tracking-tight">Payout Settings</h1>
        <p className="text-sm font-light text-[#7a7a9a]">
          Manage your bank details and view payout history
        </p>
      </div>

      <div className="max-w-xl bg-white border border-[#e8e6f0]/60 rounded-3xl p-8 shadow-[0_4px_24px_rgba(4,0,57,0.02)] flex flex-col gap-6">
        {/* Warning banner */}
        <div className="flex gap-2.5 bg-red-50 border border-red-100/60 rounded-2xl p-4">
          <AlertCircle size={18} className="text-red-400 mt-0.5 shrink-0" />
          <p className="text-xs text-red-500 leading-relaxed font-light">
            Your account name must match the name on your Trendupp profile. If your profile says
            &apos;Alex Okafor&apos;, your bank account must also be registered under &apos;Alex
            Okafor&apos; or a close variation. Mismatched names will delay your payouts.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-bold text-[#7a7a9a] uppercase tracking-wider">
              Bank Name
            </Label>
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
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-bold text-[#7a7a9a] uppercase tracking-wider">
              Account number
            </Label>
            <Input
              {...register('accountNumber')}
              placeholder="10 digit account number"
              maxLength={10}
              inputMode="numeric"
              className="border-[#e8e6f0] h-11 text-xs font-light focus-visible:ring-brand-pink/30 focus-visible:border-brand-pink"
            />
            {errors.accountNumber && (
              <p className="text-[11px] text-red-400 mt-0.5">{errors.accountNumber.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-bold text-[#7a7a9a] uppercase tracking-wider">
              Account holder name
            </Label>
            <Input
              {...register('bankAccountName')}
              placeholder="Name on the bank account"
              className="border-[#e8e6f0] h-11 text-xs font-light focus-visible:ring-brand-pink/30 focus-visible:border-brand-pink"
            />
            {errors.bankAccountName && (
              <p className="text-[11px] text-red-400 mt-0.5">{errors.bankAccountName.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={saving}
            className="w-full shadow-md bg-brand-pink hover:bg-brand-pink-dark rounded-xl h-12 text-xs font-bold text-white mt-2 flex items-center justify-center gap-2 disabled:bg-brand-pink/40"
          >
            {saving ? 'Saving...' : 'Save Payout Details'}
          </Button>
        </form>
      </div>
    </div>
  );
}
