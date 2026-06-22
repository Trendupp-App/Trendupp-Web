'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { socials } from '@/constants/socials';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import AuthLayout from '@/components/auth/AuthLayout';
import { creatorSignupSchema, CreatorSignupValues } from '@/lib/validations/creatorSignupSchema';
import { BackButton } from '@/shared/BackButton';
import { useRoles, useSignup } from '@/hooks/useAuthMutations';
import { toast } from 'sonner';
import { TermsDialog } from '@/shared/TermsDialog';

export default function CreatorSignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const router = useRouter();
  const { data: roles } = useRoles();
  const signup = useSignup();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatorSignupValues>({
    resolver: zodResolver(creatorSignupSchema),
    defaultValues: {
      terms: false,
      acceptedPromotions: false,
    },
  });

  async function onSubmit(values: CreatorSignupValues) {
    const creatorRole = roles?.find((r) => r.name === 'creator');

    if (!creatorRole) {
      toast.error('Could not load roles. Please refresh and try again.');
      return;
    }

    try {
      await signup.mutateAsync({
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        role: creatorRole.id,
        acceptedTerms: values.terms,
        acceptedPromotions: values.acceptedPromotions,
      });
      setTimeout(() => {
        router.push(
          `/features/verify-email?email=${encodeURIComponent(values.email)}&type=creator`,
        );
      }, 500);
    } catch {}
  }

  const inputCls =
    'border-[#e8e6f0] h-10 text-xs font-light focus-visible:ring-brand-pink/30 focus-visible:border-brand-pink';
  const iconCls = 'absolute left-3 top-1/2 -translate-y-1/2 text-[#9a99b0] pointer-events-none';

  return (
    <>
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
          <div className="max-w-[500px] w-full flex flex-col">
            <h1 className="text-xl font-extralight text-[#1a1a2e] text-center mb-1">Sign up</h1>
            <p className="text-sm font-light text-text-secondary text-center mb-4">
              Get started with an account on{' '}
              <span className="text-brand-pink font-medium">Trendupp</span>
            </p>

            {/* Social */}
            <div className="flex items-center justify-center gap-3 mb-4">
              {socials?.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  aria-label={`Sign up with ${label}`}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#e8e6f0] bg-white transition-colors hover:border-brand-pink/40"
                >
                  <Icon size={20} />
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-[#e8e6f0]" />
              <span className="text-xs text-text-secondary">Or</span>
              <div className="flex-1 h-px bg-[#e8e6f0]" />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
              {/* First / Last */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <Label className="text-sm font-light text-[#1a1a2e]">First name</Label>
                  <div className="relative">
                    <User size={15} className={iconCls} />
                    <Input
                      {...register('firstName')}
                      placeholder="Enter first name"
                      className={`pl-9 ${inputCls}`}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-[11px] text-red-400">{errors.firstName.message}</p>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <Label className="text-sm font-light text-[#1a1a2e]">Last name</Label>
                  <div className="relative">
                    <User size={15} className={iconCls} />
                    <Input
                      {...register('lastName')}
                      placeholder="Enter last name"
                      className={`pl-9 ${inputCls}`}
                    />
                  </div>
                  {errors.lastName && (
                    <p className="text-[11px] text-red-400">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

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

              {/* Confirm Password */}
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
                {errors.confirmPassword ? (
                  <p className="text-[11px] text-red-400">{errors.confirmPassword.message}</p>
                ) : (
                  <p className="text-[11px] text-[#9a99b0]">At least 8 characters</p>
                )}
              </div>

              <div className="flex flex-col gap-3">
                {/* Terms — required */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-start gap-2">
                    <Controller
                      name="terms"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          id="terms"
                          checked={!!field.value}
                          onCheckedChange={(checked) => field.onChange(checked === true)}
                          className="mt-0.5 border-[#e8e6f0] data-[state=checked]:bg-brand-pink data-[state=checked]:border-brand-pink"
                        />
                      )}
                    />
                    <label
                      htmlFor="terms"
                      className="text-[11px] text-[#7a7a9a] leading-relaxed cursor-pointer"
                    >
                      By registering you agree with our{' '}
                      <button
                        type="button"
                        onClick={() => setTermsOpen(true)}
                        className="text-brand-pink cursor-pointer hover:underline"
                      >
                        Terms & Conditions
                      </button>
                    </label>
                  </div>
                  {errors.terms && (
                    <p className="text-[11px] text-red-400">{errors.terms.message}</p>
                  )}
                </div>

                {/* Promo — optional */}
                <div className="flex items-start gap-2">
                  <Controller
                    name="acceptedPromotions"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="promo"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="mt-0.5 border-[#e8e6f0] data-[state=checked]:bg-brand-pink data-[state=checked]:border-brand-pink"
                      />
                    )}
                  />
                  <label
                    htmlFor="promo"
                    className="text-[11px] text-text-secondary leading-relaxed cursor-pointer"
                  >
                    I agree to receive promotional emails, updates, product announcements, and
                    campaign opportunities from Trendupp
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                disabled={signup.isPending}
                className="w-full shadow-xl shadow-brand-pink-light bg-brand-pink rounded-md h-12 text-[15px] font-extralight text-white mt-2 disabled:bg-brand-pink/40"
              >
                {signup.isPending ? 'Creating account…' : 'Sign up'}
              </Button>
            </form>
          </div>
        </div>
        <TermsDialog open={termsOpen} onOpenChange={setTermsOpen} />
      </AuthLayout>
    </>
  );
}
