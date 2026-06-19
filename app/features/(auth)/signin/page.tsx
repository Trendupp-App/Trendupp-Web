'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { socials } from '@/constants/socials';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/components/auth/AuthLayout';
import { signinSchema, SigninValues } from '@/lib/validations/loginSchema';
import { BackButton } from '@/shared/BackButton';
import { useLogin } from '@/hooks/useAuthMutations';
import { AxiosError } from 'axios';

export default function SigninPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SigninValues>({
    resolver: zodResolver(signinSchema),
  });

  async function onSubmit(values: SigninValues) {
    try {
      const { data } = await login.mutateAsync(values);
      const dest =
        data.user.role === 'creator' ? '/features/creator/dashboard' : '/features/brand/dashboard';
      setTimeout(() => {
        router.push(dest);
      }, 1500);
    } catch (err) {
      const message: string =
        (err as AxiosError<{ message?: string }>)?.response?.data?.message ?? '';
      if (message.toLowerCase().includes('email is not verified')) {
        router.push(`/features/verify-email?email=${encodeURIComponent(values.email)}`);
      }
    }
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
      <div className="w-full items-center flex flex-col relative">
        <BackButton className="absolute top-0" />

        {/* Decorative stars */}
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="hidden md:block absolute left-8 top-20 w-7 h-7 text-brand-pink"
        >
          <path d="M12 2l2.5 7.5H22l-6 4.5 2.5 7.5L12 17l-6.5 4.5L8 14 2 9.5h7.5z" />
        </svg>
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="hidden md:block absolute right-8 top-20 w-7 h-7 text-brand-pink"
        >
          <path d="M12 2l2.5 7.5H22l-6 4.5 2.5 7.5L12 17l-6.5 4.5L8 14 2 9.5h7.5z" />
        </svg>

        <div className="max-w-[500px] w-full flex flex-col">
          <h1 className="text-2xl font-extralight text-[#1a1a2e] text-center mb-1">Sign in</h1>
          <p className="text-sm font-light text-text-secondary text-center mb-6">
            Continue with your login details{' '}
            <span className="text-brand-pink font-medium">Trendupp</span>
          </p>

          {/* Social */}
          <div className="flex items-center justify-center gap-3 mb-4">
            {socials?.map(({ label, icon: Icon }) => (
              <button
                key={label}
                aria-label={`Sign in with ${label}`}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#e8e6f0] bg-white transition-colors hover:border-brand-pink/40"
              >
                <Icon size={20} />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-[#e8e6f0]" />
            <span className="text-xs text-brand-pink font-medium">Or</span>
            <div className="flex-1 h-px bg-[#e8e6f0]" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
            {/* Email */}
            <div className="flex flex-col gap-1">
              <Label className="text-sm font-light text-[#1a1a2e]">Email address</Label>
              <div className="relative">
                <Mail size={15} className={iconCls} />
                <Input
                  {...register('email')}
                  type="email"
                  placeholder="Enter email address"
                  className={`pl-9 ${inputCls}`}
                />
              </div>
              {errors.email && <p className="text-[11px] text-red-400">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <Label className="text-sm font-light text-[#1a1a2e]">Password</Label>
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

            <div className="flex justify-end">
              <Link
                href="/features/forgot-password"
                className="text-xs font-medium text-brand-pink hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full shadow-xl shadow-brand-pink-light bg-brand-pink rounded-md h-12 text-[15px] font-extralight text-white mt-2 disabled:bg-brand-pink/40"
            >
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <p className="text-sm text-text-secondary text-center mt-5">
            Don&apos;t have an account?{' '}
            <Link
              href="/features/user-type"
              className="text-brand-pink font-semibold hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
