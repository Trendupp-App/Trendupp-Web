'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useFacebookAuth } from '@/hooks/useAuthMutations';
import { toast } from 'sonner';
import AuthLayout from '@/components/auth/AuthLayout';
import VerifyLoader from '@/components/skeletons/verifyLoader';
import {
  isConnectCallback,
  readSocialConnectPending,
  clearSocialConnectPending,
  completeSocialConnect,
} from '@/lib/socialConnect';

const FACEBOOK_PENDING_KEY = 'facebook_auth_pending';

interface FacebookPending {
  role: string;
  redirectUri: string;
  acceptedTerms: boolean;
  acceptedPromotions: boolean;
}

export default function FacebookCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { exchangeFacebookToken } = useFacebookAuth();
  const hasExchanged = useRef(false);

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const state = searchParams.get('state');

    // This redirect URI is shared with the "connect socials" flow — a pending
    // connect state means this callback links an account, not a sign-in.
    const pendingConnect = readSocialConnectPending();
    // Authoritative: only the state echoed back by the platform decides this
    // is a connect callback. A stale pending entry from an abandoned connect
    // must never hijack a sign-in — clear it and continue as login.
    const isConnectFlow =
      isConnectCallback(state, 'facebook') && pendingConnect?.platform === 'facebook';
    if (!isConnectFlow && pendingConnect?.platform === 'facebook') {
      clearSocialConnectPending();
    }

    if (isConnectFlow && pendingConnect) {
      if (hasExchanged.current) return;
      clearSocialConnectPending();
      const returnTo = pendingConnect.returnTo || '/';

      if (error || !code) {
        toast.error('Facebook connection was cancelled');
        router.replace(returnTo);
        return;
      }

      hasExchanged.current = true;
      completeSocialConnect(code, pendingConnect)
        .then((result) => {
          toast.success(`${result.message} — you are now a ${result.tier}`);
          router.replace(returnTo);
        })
        .catch((err: { response?: { data?: { message?: string } } }) => {
          toast.error(err?.response?.data?.message ?? 'Could not connect your Facebook account');
          router.replace(returnTo);
        });
      return;
    }

    const isMobileApp = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobileApp && code && state) {
      // Hand off to the native deep link — the OS will open the app
      window.location.href = `trendupp://auth/facebook/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`;
      return;
    }

    if (error) {
      toast.error('Facebook sign-in was cancelled');
      router.replace('/signin');
      return;
    }

    if (!code || hasExchanged.current) return;

    const raw = sessionStorage.getItem(FACEBOOK_PENDING_KEY);
    if (!raw) {
      toast.error('Session expired, please try again');
      router.replace('/signin');
      return;
    }

    let pending: FacebookPending;
    try {
      pending = JSON.parse(raw);
    } catch {
      sessionStorage.removeItem(FACEBOOK_PENDING_KEY);
      router.replace('/signin');
      return;
    }

    hasExchanged.current = true;
    sessionStorage.removeItem(FACEBOOK_PENDING_KEY);

    exchangeFacebookToken.mutate(
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
  }, [searchParams, exchangeFacebookToken, router]);

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
