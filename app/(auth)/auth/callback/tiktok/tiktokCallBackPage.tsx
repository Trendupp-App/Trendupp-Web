'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTiktokAuth } from '@/hooks/useAuthMutations';
import { toast } from 'sonner';
import AuthLayout from '@/components/auth/AuthLayout';
import VerifyLoader from '@/components/skeletons/verifyLoader';
import {
  readSocialConnectPending,
  clearSocialConnectPending,
  completeSocialConnect,
} from '@/lib/socialConnect';
const TIKTOK_PENDING_KEY = 'tiktok_auth_pending';

interface TiktokPending {
  role: string;
  codeVerifier: string;
  redirectUri: string;
  acceptedTerms: boolean;
  acceptedPromotions: boolean;
}

export default function TiktokCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { exchangeTiktokToken } = useTiktokAuth();
  const hasExchanged = useRef(false);

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const state = searchParams.get('state');

    // This redirect URI is shared with the "connect socials" flow — a pending
    // connect state means this callback links an account, not a sign-in.
    const pendingConnect = readSocialConnectPending();
    if (pendingConnect?.platform === 'tiktok') {
      if (hasExchanged.current) return;
      clearSocialConnectPending();
      const returnTo = pendingConnect.returnTo || '/';

      if (error || !code) {
        toast.error('TikTok connection was cancelled');
        router.replace(returnTo);
        return;
      }

      hasExchanged.current = true;
      completeSocialConnect(code, pendingConnect)
        .then((result) => {
          toast.success(`${result.message}`);
          router.replace(returnTo);
        })
        .catch((err: { response?: { data?: { message?: string } } }) => {
          toast.error(err?.response?.data?.message ?? 'Could not connect your TikTok account');
          router.replace(returnTo);
        });
      return;
    }

    const isMobileApp = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobileApp && code && state) {
      // Hand off to the native deep link — the OS will open the app
      window.location.href = `trendupp://auth/tiktok/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`;
      return;
    }

    if (error) {
      toast.error('TikTok sign-in was cancelled');
      router.replace('/signin');
      return;
    }

    if (!code || hasExchanged.current) return;

    const raw = localStorage.getItem(TIKTOK_PENDING_KEY);
    if (!raw) {
      toast.error('Session expired, please try again');
      router.replace('/signin');
      return;
    }

    let pending: TiktokPending;
    try {
      pending = JSON.parse(raw);
    } catch {
      localStorage.removeItem(TIKTOK_PENDING_KEY);
      router.replace('/signin');
      return;
    }

    hasExchanged.current = true;
    localStorage.removeItem(TIKTOK_PENDING_KEY);

    exchangeTiktokToken.mutate(
      {
        code,
        redirectUri: pending.redirectUri,
        role: pending.role,
        codeVerifier: pending.codeVerifier,
        acceptedTerms: pending.acceptedTerms,
        acceptedPromotions: pending.acceptedPromotions,
      },
      {
        onSuccess: ({ data }) => {
          const user = data.user;

          if (user.onboardingPercentage < 100) {
            const name = encodeURIComponent(user.firstName ?? '');
            router.push(`/onboard?type=${user.role}&name=${name}`);
          } else {
            router.push(user.role === 'creator' ? '/creator/dashboard' : '/brand/dashboard');
          }
        },
        onError: (err) => {
          toast.error(err?.response?.data?.message ?? 'TikTok sign-in failed');
          hasExchanged.current = false;
          router.replace('/signin');
        },
      },
    );
  }, [searchParams, exchangeTiktokToken, router]);

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
        <VerifyLoader header="Launching...." subheader="please be patient" />
      </div>
    </AuthLayout>
  );
}
