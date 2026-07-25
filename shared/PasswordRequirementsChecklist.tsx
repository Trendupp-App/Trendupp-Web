'use client';

import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PasswordRequirementsChecklistProps {
  password: string;
}

const REQUIREMENTS: { label: string; test: (value: string) => boolean }[] = [
  { label: 'At least 8 characters', test: (v) => v.length >= 8 },
  { label: 'One uppercase letter', test: (v) => /[A-Z]/.test(v) },
  { label: 'One lowercase letter', test: (v) => /[a-z]/.test(v) },
  { label: 'One number', test: (v) => /\d/.test(v) },
  { label: 'One special character', test: (v) => /[^A-Za-z0-9]/.test(v) },
];

export function PasswordRequirementsChecklist({ password }: PasswordRequirementsChecklistProps) {
  if (!password) return null;

  return (
    <ul className="flex flex-col gap-0.5">
      {REQUIREMENTS.map((req) => {
        const passed = req.test(password);
        return (
          <li
            key={req.label}
            className={cn(
              'text-[11px] flex items-center gap-1',
              passed ? 'text-emerald-500' : 'text-red-400',
            )}
          >
            {passed ? <Check size={11} /> : <X size={11} />}
            {req.label}
          </li>
        );
      })}
    </ul>
  );
}
