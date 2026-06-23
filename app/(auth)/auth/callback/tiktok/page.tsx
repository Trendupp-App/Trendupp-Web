'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTiktokAuth } from '@/hooks/useAuthMutations';
import { toast } from 'sonner';
import PageLoader from '@/components/skeletons/PageLoader';
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
    console.log('Pending data:', pending);
    console.log('Code:', code);

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
          console.error('TikTok error status:', err?.response?.status);
          hasExchanged.current = false;
          router.replace('/signin');
        },
      },
    );
  }, [searchParams]);

  return <PageLoader />;
}
