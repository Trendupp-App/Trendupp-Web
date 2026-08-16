'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useInstagramAuth } from '@/hooks/useAuthMutations';
import { toast } from 'sonner';
import AuthLayout from '@/components/auth/AuthLayout';
import VerifyLoader from '@/components/skeletons/verifyLoader';
import {
  isConnectCallback,
  readSocialConnectPending,
  clearSocialConnectPending,
  completeSocialConnect,
} from '@/lib/socialConnect';

const INSTAGRAM_PENDING_KEY = 'instagram_auth_pending';

interface InstagramPending {
  role: string;
  redirectUri: string;
  acceptedTerms: boolean;
  acceptedPromotions: boolean;
}

export default function InstagramCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { exchangeInstagramToken } = useInstagramAuth();
  const hasExchanged = useRef(false);

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const state = searchParams.get('state');

    const pendingConnect = readSocialConnectPending();
    // Authoritative: only the state echoed back by the platform decides this
    // is a connect callback. A stale pending entry from an abandoned connect
    // must never hijack a sign-in — clear it and continue as login.
    const isConnectFlow =
      isConnectCallback(state, 'instagram') && pendingConnect?.platform === 'instagram';
    if (!isConnectFlow && pendingConnect?.platform === 'instagram') {
      clearSocialConnectPending();
    }

    if (isConnectFlow && pendingConnect) {
      if (hasExchanged.current) return;
      clearSocialConnectPending();
      const returnTo = pendingConnect.returnTo || '/';

      if (error || !code) {
        toast.error('Instagram connection was cancelled');
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
          toast.error(err?.response?.data?.message ?? 'Could not connect your Instagram account');
          router.replace(returnTo);
        });
      return;
    }

    const isMobileApp = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobileApp && code && state) {
      // Hand off to the native deep link — the OS will open the app
      window.location.href = `trendupp://auth/instagram/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`;
      return;
    }

    if (error) {
      toast.error('Instagram sign-in was cancelled');
      router.replace('/signin');
      return;
    }

    if (!code || hasExchanged.current) return;

    const raw = sessionStorage.getItem(INSTAGRAM_PENDING_KEY);
    if (!raw) {
      toast.error('Session expired, please try again');
      router.replace('/signin');
      return;
    }

    let pending: InstagramPending;
    try {
      pending = JSON.parse(raw);
    } catch {
      sessionStorage.removeItem(INSTAGRAM_PENDING_KEY);
      router.replace('/signin');
      return;
    }

    hasExchanged.current = true;
    sessionStorage.removeItem(INSTAGRAM_PENDING_KEY);

    exchangeInstagramToken.mutate(
      {
        code,
        redirectUri: pending.redirectUri,
        role: pending.role,
        acceptedTerms: pending.acceptedTerms,
        acceptedPromotions: pending.acceptedPromotions,
      },
      {
        onSuccess: ({ data }) => {
          const { user } = data;
          if (user.onboardingPercentage < 100) {
            const name = encodeURIComponent(user.firstName ?? '');
            router.push(`/onboard?type=${user.role}&name=${name}`);
          } else {
            router.push(user.role === 'creator' ? '/creator/dashboard' : '/brand/dashboard');
          }
        },
        onError: () => {
          hasExchanged.current = false;
          router.replace('/signin');
        },
      },
    );
  }, [searchParams, exchangeInstagramToken, router]);

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
