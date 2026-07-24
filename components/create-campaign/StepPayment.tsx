'use client';

import { useState } from 'react';
import { Lock } from 'lucide-react';
import StepFooter from './StepFooter';
import TermsModal from './TermsModal';
import { formatCurrency } from '@/utils/Utilities';

export interface PaymentBreakdown {
  campaignBudget: number;
  trenduppFee: number;
  vat: number;
  totalToPay: number;
}

interface StepPaymentProps {
  breakdown: PaymentBreakdown;
  currency?: string;
  onBack: () => void;
  onPay: () => void;
  isLoading?: boolean;
}

export default function StepPayment({
  breakdown,
  currency,
  onBack,
  onPay,
  isLoading,
}: StepPaymentProps) {
  const fmt = (n: number) => formatCurrency(n, currency ?? 'NGN');
  const [checkboxTicked, setCheckboxTicked] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  function handleCheckboxChange(e: React.ChangeEvent<HTMLInputElement>) {
    const checked = e.target.checked;
    setCheckboxTicked(checked);
    // Only open terms modal on first tick (if not already agreed)
    if (checked && !agreedToTerms) {
      setShowTerms(true);
    }
    if (!checked) {
      setAgreedToTerms(false);
    }
  }

  function handleAgree() {
    setAgreedToTerms(true);
    setShowTerms(false);
  }

  const canPay = checkboxTicked && agreedToTerms;

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* Info notice */}
        <p className="text-sm text-[#4a4a6a] font-light leading-relaxed">
          Your campaign <span className="font-medium">ONLY</span> becomes visible to creators after
          payment is confirmed AND admin approves.
        </p>

        {/* Payment breakdown — figures from API */}
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-medium text-[#1a1a2e] mb-3">Payment Breakdown</h2>
          <div className="border border-[#e8e6f0] rounded-lg overflow-hidden">
            <div className="flex flex-col divide-y divide-[#f0eef8]">
              <div className="flex items-center justify-between px-5 py-4">
                <span className="text-sm font-light text-[#4a4a6a]">Campaign Budget</span>
                <span className="text-sm font-light text-[#1a1a2e]">
                  {fmt(breakdown.campaignBudget)}
                </span>
              </div>
              <div className="flex items-center justify-between px-5 py-4">
                <span className="text-sm font-light text-[#4a4a6a]">Trendupp Fee (15%)</span>
                <span className="text-sm font-light text-[#1a1a2e]">
                  {fmt(breakdown.trenduppFee)}
                </span>
              </div>
              <div className="flex items-center justify-between px-5 py-4">
                <span className="text-sm font-light text-[#4a4a6a]">VAT (7.5%)</span>
                <span className="text-sm font-light text-[#1a1a2e]">{fmt(breakdown.vat)}</span>
              </div>
            </div>
            <div className="flex items-center justify-between px-5 py-4 border-t border-[#e8e6f0] bg-[#faf9fc]">
              <span className="text-sm font-medium text-[#1a1a2e]">Total to pay</span>
              <span className="text-lg font-semibold text-brand-pink">
                {fmt(breakdown.totalToPay)}
              </span>
            </div>
          </div>
        </div>

        {/* Escrow notice */}
        <div className="flex items-start gap-3 bg-[#fff5f9] border-l-4 border-brand-pink rounded-lg px-4 py-4">
          <div className="w-8 h-8 rounded-full bg-brand-pink flex items-center justify-center shrink-0 mt-0.5">
            <Lock size={14} className="text-white" />
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-semibold text-[#1a1a2e]">Secured by Trendupp Escrow</p>
            <p className="text-sm font-light text-[#4a4a6a] leading-relaxed">
              Funds held safely until content is delivered and verified. Never transferred to
              creators without your approval.
            </p>
          </div>
        </div>

        {/* Terms checkbox — clicking opens modal */}
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={checkboxTicked}
            onChange={handleCheckboxChange}
            className="mt-0.5 w-4 h-4 accent-brand-pink shrink-0 cursor-pointer"
          />
          <span className="text-sm font-light text-[#4a4a6a] leading-relaxed">
            I agree to receive promotional emails, update, product announcement, and campaign
            opportunities from Trendupp <span className="text-red-500">*</span>
          </span>
        </label>

        <StepFooter
          onBack={onBack}
          onContinue={onPay}
          continueLabel={`Pay ${fmt(breakdown.totalToPay)}`}
          continueDisabled={!canPay}
          isLoading={isLoading}
        />
      </div>

      {/* Terms & Conditions modal */}
      {showTerms && (
        <TermsModal
          onAgree={handleAgree}
          onClose={() => {
            setShowTerms(false);
            // Uncheck if they close without agreeing
            setCheckboxTicked(false);
          }}
        />
      )}
    </>
  );
}
