'use client';

import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PasswordRequirementsChecklistProps {
  password: string;
}

const REQUIREMENTS: { label: string; test: (value: string) => boolean }[] = [
  { label: '8+ letters', test: (v) => v.length >= 8 },
  { label: 'Uppercase', test: (v) => /[A-Z]/.test(v) },
  { label: 'Lowercase', test: (v) => /[a-z]/.test(v) },
  { label: 'Number', test: (v) => /\d/.test(v) },
  { label: 'Symbol', test: (v) => /[^A-Za-z0-9]/.test(v) },
];

const STRENGTH_COLORS = [
  'bg-red-500',
  'bg-orange-500',
  'bg-yellow-500',
  'bg-lime-500',
  'bg-emerald-500',
];

export function PasswordRequirementsChecklist({ password }: PasswordRequirementsChecklistProps) {
  if (!password) return null;

  const results = REQUIREMENTS.map((req) => req.test(password));
  const passedCount = results.filter(Boolean).length;
  const filledColor = passedCount > 0 ? STRENGTH_COLORS[passedCount - 1] : '';

  return (
    <div className="grid grid-cols-5 gap-1">
      {REQUIREMENTS.map((req, i) => {
        const passed = results[i];
        const filled = i < passedCount;
        return (
          <div key={req.label} className="flex flex-col items-center gap-1">
            <span
              className={cn(
                'h-1.5 w-full rounded-full transition-colors duration-300',
                filled ? filledColor : 'bg-gray-200',
              )}
            />
            <span
              className={cn(
                'flex flex-col items-center gap-0.5 text-[9px] leading-tight text-center',
                passed ? 'text-emerald-500' : 'text-red-400',
              )}
            >
              {passed ? <Check size={10} /> : <X size={10} />}
              {req.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
