'use client';

import { Loader2, Check, X } from 'lucide-react';

interface UsernameAvailabilityHintProps {
  value: string;
  isChecking: boolean;
  isTaken: boolean;
  isAvailable: boolean;
  fallback?: string;
}

export function UsernameAvailabilityHint({
  value,
  isChecking,
  isTaken,
  isAvailable,
  fallback,
}: UsernameAvailabilityHintProps) {
  if (value.trim().length < 3) {
    return fallback ? <p className="text-[11px] text-[#9a99b0]">{fallback}</p> : null;
  }

  if (isChecking) {
    return (
      <p className="text-[11px] text-[#9a99b0] flex items-center gap-1">
        <Loader2 size={11} className="animate-spin" />
        Checking availability…
      </p>
    );
  }

  if (isTaken) {
    return (
      <p className="text-[11px] text-red-400 flex items-center gap-1">
        <X size={11} />
        This name is already taken
      </p>
    );
  }

  if (isAvailable) {
    return (
      <p className="text-[11px] text-emerald-500 flex items-center gap-1">
        <Check size={11} />
        Available
      </p>
    );
  }

  return null;
}
