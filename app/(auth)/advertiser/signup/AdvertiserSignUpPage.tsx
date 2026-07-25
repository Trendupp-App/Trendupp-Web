'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import AuthLayout from '@/components/auth/AuthLayout';
import {
  advertiserSignupSchema,
  AdvertiserSignupValues,
} from '@/lib/validations/advertiserSignupSchema';
import { BackButton } from '@/shared/BackButton';
import { toast } from 'sonner';
import { useRoles, useSignup } from '@/hooks/useAuthMutations';
import { GoogleSignInButton, type SocialSignInHandle } from '@/components/auth/GoogleSignInButton';
import { TiktokSignInButton } from '@/components/auth/TiktokSignInButton';
import { InstagramSignInButton } from '@/components/auth/InstagramSignInButton';
import { FacebookSignInButton } from '@/components/auth/FacebookSignInButton';
import { AppleSignInButton } from '@/components/auth/AppleSignInButton';
import Link from 'next/link';
import { useUsernameAvailability } from '@/hooks/useAuthMutations';
import { UsernameAvailabilityHint } from '@/shared/UsernameAvailabilityHint';
import { PasswordRequirementsChecklist } from '@/shared/PasswordRequirementsChecklist';
import TermsModal from '@/components/auth/TermsModal';
import GoogleLoader from '@/components/skeletons/GoogleLoader';
import { useCyclingText } from '@/hooks/useCyclingText';

type PendingAction = 'email' | 'google' | 'tiktok' | 'instagram' | 'facebook' | 'apple' | null;

const SIGNUP_LOADING_MESSAGES = [
  'Creating your account…',
  'Setting things up…',
  'Almost there…',
  'Just a few more seconds…',
];

export default function AdvertiserSignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [googlePending, setGooglePending] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [activeProvider, setActiveProvider] = useState<
    'google' | 'tiktok' | 'instagram' | 'facebook' | 'apple' | null
  >(null);
  const pendingActionRef = useRef<PendingAction>(null);
  const googleRef = useRef<SocialSignInHandle>(null);
  const tiktokRef = useRef<SocialSignInHandle>(null);
  const instagramRef = useRef<SocialSignInHandle>(null);
  const facebookRef = useRef<SocialSignInHandle>(null);
  const appleRef = useRef<SocialSignInHandle>(null);
  const router = useRouter();
  const { data: roles } = useRoles();
  const signup = useSignup();

  const {
    register,
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<AdvertiserSignupValues>({
    resolver: zodResolver(advertiserSignupSchema),
    defaultValues: {
      terms: false,
      acceptedPromotions: false,
    },
  });

  const termsAccepted = useWatch({ control, name: 'terms' });
  const brandNameValue = useWatch({ control, name: 'brandName' }) ?? '';
  const brandNameCheck = useUsernameAvailability(brandNameValue);
  const acceptPromotions = useWatch({ control, name: 'acceptedPromotions' });
  const passwordValue = useWatch({ control, name: 'password' }) ?? '';
  const loadingText = useCyclingText(signup.isPending, SIGNUP_LOADING_MESSAGES);

  function requestTerms(action: PendingAction) {
    pendingActionRef.current = action;
    setShowTermsModal(true);
  }

  async function onSubmit(values: AdvertiserSignupValues) {
    const creatorRole = roles?.find((r) => r.name === 'brand');
    if (!creatorRole) return toast.error('Could not load roles');
    if (brandNameCheck.isTaken) {
      toast.error('That brand name is already taken. Please choose another.');
      return;
    }

    await signup.mutateAsync({
      email: values.email,
      password: values.password,
      brandName: values.brandName,
      role: creatorRole.id,
      acceptedTerms: values.terms,
      acceptedPromotions: values.acceptedPromotions,
    });

    setTimeout(() => {
      const query = new URLSearchParams({ email: values.email, type: 'brand' });
      router.push(`/verify-email?${query.toString()}`);
    }, 500);
  }
  function handleFormEvent(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!termsAccepted) {
      requestTerms('email');
      return;
    }
    void handleSubmit(onSubmit)();
  }

  function handleAgreeToTerms() {
    setValue('terms', true, { shouldValidate: true });
    setShowTermsModal(false);

    const action = pendingActionRef.current;
    pendingActionRef.current = null;

    if (action === 'email') {
      handleSubmit(onSubmit)();
    } else if (action === 'google') {
      googleRef.current?.trigger({ skipTermsCheck: true });
    } else if (action === 'tiktok') {
      tiktokRef.current?.trigger({ skipTermsCheck: true });
    } else if (action === 'instagram') {
      instagramRef.current?.trigger({ skipTermsCheck: true });
    } else if (action === 'facebook') {
      facebookRef.current?.trigger({ skipTermsCheck: true });
    } else if (action === 'apple') {
      appleRef.current?.trigger({ skipTermsCheck: true });
    }
  }

  function handleCloseTermsModal() {
    setShowTermsModal(false);
    pendingActionRef.current = null;
  }

  const inputCls =
    'border-[#e8e6f0] h-10 text-xs font-light focus-visible:ring-brand-pink/30 focus-visible:border-brand-pink';
  const iconCls = 'absolute left-3 top-1/2 -translate-y-1/2 text-[#9a99b0] pointer-events-none';

  return (
    <>
      <AuthLayout
        imageSrc="/auth/onb4.svg"
        imageAlt="Advertiser"
        headlineTop="Launch your"
        headlineBottom="Campaigns"
        tagline="Create, manage, and track influencer campaigns from one centralized platform."
        slideIndex={0}
      >
        {googlePending ? (
          <GoogleLoader />
        ) : (
          <div className="w-full items-center flex flex-col">
            <BackButton className="absolute top-4" />
            <div className="max-w-[500px] w-full flex flex-col">
              <h1 className="text-xl font-extralight text-[#1a1a2e] text-center mb-1">Sign up</h1>
              <p className="text-sm font-light text-text-secondary text-center mb-4">
                Get started with an account on{' '}
                <span className="text-brand-pink font-medium">Trendupp</span>
              </p>

              <div className="flex items-center justify-center gap-3 mb-4">
                <GoogleSignInButton
                  ref={googleRef}
                  role={roles?.find((r) => r.name === 'brand')?.id ?? ''}
                  acceptedTerms={!!termsAccepted}
                  acceptedPromotions={!!acceptPromotions}
                  onRequireTerms={() => requestTerms('google')}
                  onStart={() => setActiveProvider('google')}
                  onPendingChange={setGooglePending}
                  onResumeTermsAccepted={() => setValue('terms', true, { shouldValidate: true })}
                  onAuthError={() => setActiveProvider(null)}
                  disabled={activeProvider !== null && activeProvider !== 'google'}
                />
                <TiktokSignInButton
                  ref={tiktokRef}
                  role={roles?.find((r) => r.name === 'brand')?.id ?? ''}
                  acceptedTerms={!!termsAccepted}
                  acceptedPromotions={!!acceptPromotions}
                  onStart={() => setActiveProvider('tiktok')}
                  onRequireTerms={() => requestTerms('tiktok')}
                  disabled={activeProvider !== null && activeProvider !== 'tiktok'}
                />

                <InstagramSignInButton
                  ref={instagramRef}
                  role={roles?.find((r) => r.name === 'brand')?.id ?? ''}
                  acceptedTerms={!!termsAccepted}
                  acceptedPromotions={!!acceptPromotions}
                  onRequireTerms={() => requestTerms('instagram')}
                  onStart={() => setActiveProvider('instagram')}
                  disabled={activeProvider !== null && activeProvider !== 'instagram'}
                />
                <FacebookSignInButton
                  ref={facebookRef}
                  role={roles?.find((r) => r.name === 'brand')?.id ?? ''}
                  acceptedTerms={!!termsAccepted}
                  acceptedPromotions={!!acceptPromotions}
                  onRequireTerms={() => requestTerms('facebook')}
                  onStart={() => setActiveProvider('facebook')}
                  disabled={activeProvider !== null && activeProvider !== 'facebook'}
                />
                <AppleSignInButton
                  ref={appleRef}
                  role={roles?.find((r) => r.name === 'brand')?.id ?? ''}
                  acceptedTerms={!!termsAccepted}
                  acceptedPromotions={!!acceptPromotions}
                  onRequireTerms={() => requestTerms('apple')}
                  onStart={() => setActiveProvider('apple')}
                  disabled={activeProvider !== null && activeProvider !== 'apple'}
                />
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-[#e8e6f0]" />
                <span className="text-xs text-text-secondary">Or</span>
                <div className="flex-1 h-px bg-[#e8e6f0]" />
              </div>

              <form onSubmit={handleFormEvent} className="flex flex-col gap-3">
                {/* Brand Name */}
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex flex-col gap-1">
                    <Label className="text-sm font-light text-[#1a1a2e]">Brand name</Label>
                    <div className="relative">
                      <User size={15} className={iconCls} />
                      <Input
                        {...register('brandName')}
                        placeholder="Enter Brand Name"
                        className={`pl-9 ${inputCls}`}
                      />
                    </div>
                    {errors.brandName ? (
                      <p className="text-[11px] text-red-400">{errors.brandName.message}</p>
                    ) : (
                      <UsernameAvailabilityHint
                        value={brandNameValue}
                        isChecking={brandNameCheck.isChecking}
                        isTaken={brandNameCheck.isTaken}
                        isAvailable={brandNameCheck.isAvailable}
                      />
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
                  {errors.email && (
                    <p className="text-[11px] text-red-400">{errors.email.message}</p>
                  )}
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
                  {errors.password ? (
                    <p className="text-[11px] text-red-400">{errors.password.message}</p>
                  ) : (
                    <PasswordRequirementsChecklist password={passwordValue} />
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
                  {errors.confirmPassword && (
                    <p className="text-[11px] text-red-400">{errors.confirmPassword.message}</p>
                  )}
                </div>

                {/* Checkboxes */}
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
                            onCheckedChange={(checked) => {
                              if (checked === true) {
                                requestTerms(null);
                                return;
                              }
                              field.onChange(false);
                            }}
                            className="mt-0.5 cursor-pointer border-[#e8e6f0] data-[state=checked]:bg-brand-pink data-[state=checked]:border-brand-pink"
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
                          onClick={() => requestTerms(null)}
                          className="text-brand-pink cursor-pointer hover:underline"
                        >
                          Terms & Conditions
                        </button>{' '}
                        <span className="text-red-500">*</span>
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
                          className="mt-0.5 cursor-pointer border-[#e8e6f0] data-[state=checked]:bg-brand-pink data-[state=checked]:border-brand-pink"
                        />
                      )}
                    />
                    <label
                      htmlFor="promo"
                      className="text-[11px] text-[#7a7a9a] leading-relaxed cursor-pointer"
                    >
                      I agree to receive promotional emails, updates, product announcements, and
                      campaign opportunities from Trendupp
                    </label>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={
                    signup.isPending || googlePending || !termsAccepted || brandNameCheck.isTaken
                  }
                  className="w-full shadow-xl shadow-brand-pink-light bg-brand-pink rounded-md h-12 text-[15px] font-extralight text-white mt-2 disabled:bg-brand-pink/40"
                >
                  {signup.isPending ? loadingText : 'Sign up'}
                </Button>
              </form>
              <p className="text-sm text-text-secondary text-center mt-5">
                Already have an account?{' '}
                <Link href="/signin" className="text-brand-pink font-extralight hover:underline">
                  Login
                </Link>
              </p>
            </div>
          </div>
        )}
      </AuthLayout>
      {showTermsModal && (
        <TermsModal onAgree={handleAgreeToTerms} onClose={handleCloseTermsModal} />
      )}
    </>
  );
}
