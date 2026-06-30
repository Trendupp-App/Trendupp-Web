'use client';

import { Edit3 } from 'lucide-react';

interface BankDetailsCardProps {
  bankName: string;
  accountName: string;
  accountNumber: string;
  onChange: () => void;
}

export default function BankDetailsCard({
  bankName,
  accountName,
  accountNumber,
  onChange,
}: BankDetailsCardProps) {
  // Format account number to obscure most of it e.g. ****4521
  const obfuscatedAccountNumber = accountNumber ? `****${accountNumber.slice(-4)}` : '****';

  return (
    <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-4 shadow-[0_4px_24px_rgba(4,0,57,0.02)] select-none">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider">
          Payout Bank Account
        </span>
        <button
          onClick={onChange}
          className="flex items-center gap-1.5 text-xs font-bold text-[#d7176f] bg-transparent border-none outline-none cursor-pointer hover:opacity-85 transition-opacity"
        >
          <Edit3 size={13} className="text-[#d7176f]" />
          <span>Change</span>
        </button>
      </div>

      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-full bg-[#fdf2f6] flex items-center justify-center text-[#d7176f] shrink-0">
          {/* Bank/card custom SVG icon */}
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-bold text-[#1a1a2e] leading-snug">
            {bankName || 'No bank linked'}
          </span>
          <span className="text-[11px] font-light text-[#7a7a9a] leading-none">
            {accountName
              ? `${accountName} - ${obfuscatedAccountNumber}`
              : 'Link your account to receive payouts'}
          </span>
        </div>
      </div>
    </div>
  );
}
