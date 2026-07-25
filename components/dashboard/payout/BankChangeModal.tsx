'use client';

import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { BankCombobox } from '@/shared/BankComboBox';
import { X, Check, Landmark, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { useBanks } from '@/hooks/useOnboardingQueries';

interface BankChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: {
    bankId: string;
    bankName: string;
    accountNumber: string;
    accountName: string;
  }) => void;
  initialBankName?: string;
  initialAccountNumber?: string;
  initialAccountName?: string;
}

export default function BankChangeModal({
  isOpen,
  onClose,
  onSave,
  initialBankName = '',
  initialAccountNumber = '',
  initialAccountName = '',
}: BankChangeModalProps) {
  const { user } = useAuthStore();
  const [step, setStep] = useState<'input' | 'confirm'>('input');

  const [bankId, setBankId] = useState('');
  const [bankName, setBankName] = useState(initialBankName);
  const [accountNumber, setAccountNumber] = useState(initialAccountNumber);
  const [accountName, setAccountName] = useState(initialAccountName);

  const [isResolving, setIsResolving] = useState(false);
  const [isVerified, setIsVerified] = useState(!!initialAccountName);

  const resolveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (resolveTimerRef.current) {
        clearTimeout(resolveTimerRef.current);
      }
    };
  }, []);

  // The backend never sends back the bank's id, only its display name, so when a
  // creator already has a bank on file we have to re-resolve its id by name — otherwise
  // bankId stays empty and Continue silently no-ops unless they re-pick the bank.
  const { data: matchedBanks } = useBanks(
    { search: initialBankName },
    !!initialBankName && !bankId,
  );

  const resolvedBankId =
    bankId ||
    matchedBanks?.find((bank) => bank.name.toLowerCase() === initialBankName.toLowerCase())?.id ||
    '';

  const resolveAccount = (num: string, name: string) => {
    if (resolveTimerRef.current) {
      clearTimeout(resolveTimerRef.current);
      resolveTimerRef.current = null;
    }

    if (num.length === 10 && name) {
      setIsResolving(true);
      setIsVerified(false);
      resolveTimerRef.current = setTimeout(() => {
        setIsResolving(false);
        setIsVerified(true);
        const resolvedName = user ? `${user.firstName} ${user.lastName}` : 'Alex Okafor';
        setAccountName(resolvedName);
      }, 1200);
    } else {
      setIsResolving(false);
      setIsVerified(false);
    }
  };

  const handleBankChange = (bank: { id: string; name: string }) => {
    setBankName(bank.name);
    setBankId(bank.id);
    resolveAccount(accountNumber, bank.name);
  };

  const handleAccountNumberChange = (val: string) => {
    setAccountNumber(val);
    resolveAccount(val, bankName);
  };

  const handleContinue = () => {
    if (isVerified && resolvedBankId) {
      setStep('confirm');
    }
  };

  const handleSave = () => {
    onSave({
      bankId: resolvedBankId,
      bankName,
      accountNumber,
      accountName,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-[420px] max-h-[90vh] overflow-y-auto rounded-[24px] bg-white border border-[#e8e6f0]/60 p-6 flex flex-col gap-6 shadow-xl scrollbar-hide select-none"
      >
        {/* Step 1: Input / Verify */}
        {step === 'input' && (
          <div className="flex flex-col gap-5 w-full">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-0.5">
                <DialogTitle className="text-base font-bold text-[#1a1a2e]">
                  Change Bank Account
                </DialogTitle>
                <p className="text-[11px] font-light text-[#7a7a9a]">
                  Enter your payout bank details
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-[#f4f4f8] hover:bg-[#eaeaf0] flex items-center justify-center text-[#7a7a9a] transition-colors border-none cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Form */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider">
                  Bank Name
                </Label>
                <BankCombobox
                  value={bankName ? { id: bankId, name: bankName } : null}
                  onChange={handleBankChange}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider">
                  Account Number
                </Label>
                <Input
                  type="text"
                  maxLength={10}
                  inputMode="numeric"
                  placeholder="10-digit account number"
                  value={accountNumber}
                  onChange={(e) => handleAccountNumberChange(e.target.value.replace(/[^0-9]/g, ''))}
                  className="border-[#e8e6f0] h-11 text-xs font-light focus-visible:ring-brand-pink/30 focus-visible:border-brand-pink"
                />
              </div>

              {/* Status messages */}
              {isResolving && (
                <div className="text-[10.5px] text-[#7a7a9a] italic flex items-center gap-1.5 px-0.5">
                  <span className="w-3.5 h-3.5 border-2 border-[#7a7a9a] border-t-transparent rounded-full animate-spin shrink-0" />
                  <span>Resolving account name...</span>
                </div>
              )}

              {isVerified && (
                <div className="flex gap-2.5 bg-[#00c37b]/5 border border-[#00c37b]/15 rounded-xl p-3.5 text-xs text-[#00c37b]">
                  <Check size={16} className="shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-bold">Account verified</span>
                    <span className="text-[10.5px] font-light mt-0.5">{accountName}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom action button */}
            <Button
              onClick={handleContinue}
              disabled={!isVerified}
              className={cn(
                'w-full text-white font-semibold text-[13px] py-5.5 rounded-xl transition-all border-none mt-1 shadow-sm flex items-center justify-center gap-1.5',
                isVerified
                  ? 'bg-brand-pink hover:bg-brand-pink/95 cursor-pointer'
                  : 'bg-zinc-200 hover:bg-zinc-200 text-zinc-400 cursor-not-allowed shadow-none',
              )}
            >
              <span>Continue</span>
              <span>&rarr;</span>
            </Button>
          </div>
        )}

        {/* Step 2: Confirm details */}
        {step === 'confirm' && (
          <div className="flex flex-col gap-5 w-full">
            {/* Header */}
            <div className="flex justify-between items-start">
              <DialogTitle className="text-base font-bold text-[#1a1a2e]">
                Confirm New Account
              </DialogTitle>
              <button
                onClick={() => setStep('input')}
                className="w-7 h-7 rounded-full bg-[#f4f4f8] hover:bg-[#eaeaf0] flex items-center justify-center text-[#7a7a9a] transition-colors border-none cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Confirmation Box */}
            <div className="bg-[#f8f7fa] border border-[#e8e6f0]/40 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#fdf2f6] flex items-center justify-center text-[#d7176f] shrink-0">
                <Landmark size={20} />
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                <span className="text-xs font-bold text-[#1a1a2e] leading-none truncate">
                  {bankName}
                </span>
                <span className="text-[10.5px] font-light text-[#7a7a9a] leading-none">
                  {accountNumber}
                </span>
                <span className="text-[10.5px] font-bold text-[#1a1a2e] mt-1.5 leading-none">
                  Account Name: {accountName}
                </span>
              </div>
            </div>

            {/* Warning Banner */}
            <div className="flex gap-2.5 bg-amber-50/50 border border-amber-100/70 rounded-xl p-3.5">
              <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[10.5px] text-amber-600 leading-relaxed font-light">
                All future withdrawals will be sent to this account. Changes take effect
                immediately.
              </p>
            </div>

            {/* Bottom action button */}
            <Button
              onClick={handleSave}
              className="w-full text-white font-semibold text-[13px] py-5.5 rounded-xl bg-brand-pink hover:bg-brand-pink/95 transition-all border-none mt-1 shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Save bank account</span>
              <span>&rarr;</span>
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
