'use client';

import { useRouter } from 'next/navigation';
import { Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/components/auth/AuthLayout';
import { BackButton } from '@/shared/BackButton';
import { forgotPasswordSchema, ForgotPasswordValues } from '@/lib/validations/forgotPasswordSchema';
import { useForgotPassword } from '@/hooks/useAuthMutations';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const forgotPassword = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  async function onSubmit(values: ForgotPasswordValues) {
    await forgotPassword.mutateAsync(values.email);
    router.push(`/reset-password/verify?email=${encodeURIComponent(values.email)}`);
  }

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
            Forgot your password?
          </h1>
          <p className="text-sm font-light text-text-secondary text-center mb-8">
            Enter your registered email address and we&apos;ll send a 6-digit verification code.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-1">
            <Label className="text-sm font-light text-[#1a1a2e]">Email address</Label>
            <div className="relative">
              <Mail
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9a99b0] pointer-events-none"
              />
              <Input
                {...register('email')}
                type="email"
                placeholder="you@email.com"
                className="pl-9 border-[#e8e6f0] h-10 text-xs font-light focus-visible:ring-brand-pink/30 focus-visible:border-brand-pink"
              />
            </div>
            {errors.email && <p className="text-[11px] text-red-400">{errors.email.message}</p>}

            <Button
              type="submit"
              disabled={isValid || isSubmitting}
              className="w-full shadow-xl shadow-brand-pink-light bg-brand-pink rounded-md h-12 text-[15px] font-extralight text-white mt-6 disabled:bg-brand-pink/40"
            >
              {isSubmitting ? 'Sending…' : 'Send code'}
            </Button>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
}
