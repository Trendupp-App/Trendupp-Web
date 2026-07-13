'use client';

import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const inputCls =
  'border-[#e8e6f0] h-10 text-xs font-light focus-visible:ring-brand-pink/30 focus-visible:border-brand-pink';
const iconCls = 'absolute left-3 top-1/2 -translate-y-1/2 text-[#9a99b0] pointer-events-none';

// Shared step header
export function StepHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <>
      <h1 className="text-2xl font-extralight text-[#1a1a2e] text-center mb-1">{title}</h1>
      <p className="text-sm font-light text-text-secondary text-center mb-6">{subtitle}</p>
    </>
  );
}

// Email input field
interface EmailFieldProps {
  registration: object;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  value?: string;
}
export function EmailField({
  registration,
  placeholder = 'Enter email address',
  error,
  disabled,
  value,
}: EmailFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <Label className="text-sm font-light text-[#1a1a2e]">Email address</Label>
      <div className={`relative ${disabled ? 'opacity-70' : ''}`}>
        <Mail size={15} className={iconCls} />
        <Input
          {...(registration as object)}
          type="email"
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          className={`pl-9 ${disabled ? 'bg-[#f3f2fa] cursor-not-allowed' : ''} ${inputCls}`}
        />
      </div>
      {error && <p className="text-[11px] text-red-400">{error}</p>}
    </div>
  );
}

// Password input field with show/hide toggle
interface PasswordFieldProps {
  label?: string;
  registration: object;
  placeholder?: string;
  error?: string;
}
export function PasswordField({
  label = 'Password',
  registration,
  placeholder = 'Enter password',
  error,
}: PasswordFieldProps) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-1">
      <Label className="text-sm font-light text-[#1a1a2e]">{label}</Label>
      <div className="relative">
        <Lock size={15} className={iconCls} />
        <Input
          {...(registration as object)}
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          className={`pl-9 pr-10 ${inputCls}`}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9a99b0] hover:text-[#1a1a2e]"
        >
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
      {error && <p className="text-[11px] text-red-400">{error}</p>}
    </div>
  );
}

// Primary branded CTA button
interface PinkButtonProps {
  loading?: boolean;
  disabled?: boolean;
  label: string;
  loadingLabel?: string;
  inactive?: boolean;
}
export function PinkButton({ loading, disabled, label, loadingLabel, inactive }: PinkButtonProps) {
  return (
    <Button
      type="submit"
      disabled={loading || disabled}
      className={`w-full rounded-md h-12 text-[15px] font-extralight text-white mt-2 transition-all cursor-pointer ${
        inactive
          ? 'bg-brand-pink/10 text-brand-pink border border-brand-pink/20 pointer-events-none'
          : 'shadow-xl shadow-brand-pink-light bg-brand-pink hover:bg-brand-pink/90 disabled:bg-brand-pink/40'
      }`}
    >
      {loading && loadingLabel ? loadingLabel : label}
    </Button>
  );
}
