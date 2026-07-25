'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAppleAuth } from '@/hooks/useAuthMutations';
import { toast } from 'sonner';
import AuthLayout from '@/components/auth/AuthLayout';
import VerifyLoader from '@/components/skeletons/verifyLoader';

const APPLE_PENDING_KEY = 'apple_auth_pending';

interface ApplePending {
  role: string;
  redirectUri: string;
  acceptedTerms: boolean;
  acceptedPromotions: boolean;
}

/** Apple sends a `user` JSON param (name/email) only on the first authorization. */
interface AppleUserParam {
  name?: { firstName?: string; lastName?: string };
  email?: string;
}

export default function AppleCallbackPage() {
  const router = useRouter();
  const { exchangeAppleToken } = useAppleAuth();
  const hasExchanged = useRef(false);

  useEffect(() => {
    // Apple returns the response in the URL fragment (response_mode=fragment).
    const fragment = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const idToken = fragment.get('id_token');
    const error = fragment.get('error');

    if (error) {
      toast.error('Apple sign-in was cancelled');
      router.replace('/signin');
      return;
    }

    if (!idToken || hasExchanged.current) return;

    const raw = sessionStorage.getItem(APPLE_PENDING_KEY);
    if (!raw) {
      toast.error('Session expired, please try again');
      router.replace('/signin');
      return;
    }

    let pending: ApplePending;
    try {
      pending = JSON.parse(raw);
    } catch {
      sessionStorage.removeItem(APPLE_PENDING_KEY);
      router.replace('/signin');
      return;
    }

    let firstName: string | undefined;
    let lastName: string | undefined;
    const rawUser = fragment.get('user');
    if (rawUser) {
      try {
        const appleUser = JSON.parse(rawUser) as AppleUserParam;
        firstName = appleUser?.name?.firstName || undefined;
        lastName = appleUser?.name?.lastName || undefined;
      } catch {
        // ignore a malformed user param — the identity token is what matters
      }
    }

    hasExchanged.current = true;
    sessionStorage.removeItem(APPLE_PENDING_KEY);

    exchangeAppleToken.mutate(
      {
        identityToken: idToken,
        firstName,
        lastName,
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
  }, [exchangeAppleToken, router]);

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
