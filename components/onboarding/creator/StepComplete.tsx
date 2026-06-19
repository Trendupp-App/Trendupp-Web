'use client';

import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  userName?: string;
  onGoToDashboard: () => void;
}

export default function StepComplete({ userName, onGoToDashboard }: Props) {
  return (
    <div className="flex flex-col items-center w-full py-8">
      {/* Success icon */}
      <div className="w-16 h-16 rounded-full bg-green-50 border border-green-100 flex items-center justify-center mb-6">
        <CheckCircle2 size={36} className="text-green-500" />
      </div>

      <p className="text-xs font-semibold tracking-widest text-green-500 uppercase mb-1">
        Successful
      </p>
      <h1 className="text-2xl font-light text-[#1a1a2e] text-center mb-2">Profile Verified</h1>
      <p className="text-sm font-light text-[#7a7a9a] text-center mb-10">
        Hey {userName ?? 'there'}! Your profile has been verified
      </p>

      <Button
        type="button"
        onClick={onGoToDashboard}
        className="w-full shadow-xl shadow-brand-pink-light bg-brand-pink rounded-md h-12 text-[15px] font-light text-white flex items-center justify-center gap-2"
      >
        Go to Dashboard
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
    </div>
  );
}
