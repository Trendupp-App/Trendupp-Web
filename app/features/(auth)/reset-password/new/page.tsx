'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/components/auth/AuthLayout';
import { BackButton } from '@/shared/BackButton';
import { newPasswordSchema, NewPasswordValues } from '@/lib/validations/newPasswordSchema';

export default function NewPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get('email') ?? '';
  const code = params.get('code') ?? '';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NewPasswordValues>({
    resolver: zodResolver(newPasswordSchema),
  });

  async function onSubmit(values: NewPasswordValues) {
    console.log('New password values:', { email, code, ...values });
    // TODO: call reset-password API
    router.push('/features/signin');
  }

  const inputCls =
    'border-[#e8e6f0] h-10 text-xs font-light focus-visible:ring-brand-pink/30 focus-visible:border-brand-pink';
  const iconCls = 'absolute left-3 top-1/2 -translate-y-1/2 text-[#9a99b0] pointer-events-none';

  return (
    <AuthLayout
      imageSrc="/auth/onb3.svg"
      imageAlt="Creator"
      headlineTop="Discover"
      headlineBottom="Paid Campaigns"
      tagline="Find brand campaigns that match your niche and grow your creator career with real money."
      slideIndex={1}
    >
      <div className="w-full items-center flex flex-col">
        <BackButton className="absolute top-4" />
        <div className="w-full max-w-[500px] flex flex-col items-center">
          <h1 className="text-2xl font-extralight text-[#1a1a2e] text-center mb-2">
            Create new password
          </h1>
          <p className="text-sm font-light text-text-secondary text-center mb-8">
            Choose a strong password with at least 8 characters, numbers and symbols.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-3">
            {/* New password */}
            <div className="flex flex-col gap-1">
              <Label className="text-sm font-light text-[#1a1a2e]">New password</Label>
              <div className="relative">
                <Lock size={15} className={iconCls} />
                <Input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  className={`pl-9 pr-10 ${inputCls}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9a99b0] hover:text-[#1a1a2e]"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] text-red-400">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm password */}
            <div className="flex flex-col gap-1">
              <Label className="text-sm font-light text-[#1a1a2e]">Confirm password</Label>
              <div className="relative">
                <Lock size={15} className={iconCls} />
                <Input
                  {...register('confirmPassword')}
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Confirm password"
                  className={`pl-9 pr-10 ${inputCls}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9a99b0] hover:text-[#1a1a2e]"
                >
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-[11px] text-red-400">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full shadow-xl shadow-brand-pink-light bg-brand-pink rounded-md h-12 text-[15px] font-extralight text-white mt-4 disabled:bg-brand-pink-light"
            >
              {isSubmitting ? 'Updating…' : 'Update password'}
            </Button>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
}
