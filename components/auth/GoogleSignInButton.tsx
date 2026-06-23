'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useGoogleAuth } from '@/hooks/useAuthMutations';
import { signIn } from 'next-auth/react';

const PENDING_KEY = 'google_auth_pending';

interface PendingAuth {
  role: string;
  acceptedTerms: boolean;
  acceptedPromotions: boolean;
}

interface Props {
  role: string;
  acceptedTerms: boolean;
  acceptedPromotions: boolean;
  onRequireTerms?: () => void;
}

export function GoogleSignInButton({
  role,
  acceptedTerms,
  acceptedPromotions,
  onRequireTerms,
}: Props) {
  const { data: session } = useSession();
  const { exchangeGoogleToken } = useGoogleAuth();
  const router = useRouter();
  const hasExchanged = useRef(false);

  useEffect(() => {
    if (!session?.idToken || hasExchanged.current) return;

    // Read pending state that survived the page redirect
    const raw = sessionStorage.getItem(PENDING_KEY);
    if (!raw) return;

    let pending: PendingAuth;
    try {
      pending = JSON.parse(raw);
    } catch {
      sessionStorage.removeItem(PENDING_KEY);
      return;
    }

    if (!pending.acceptedTerms) {
      sessionStorage.removeItem(PENDING_KEY);
      onRequireTerms?.();
      return;
    }

    hasExchanged.current = true;
    sessionStorage.removeItem(PENDING_KEY); // clean up

    exchangeGoogleToken.mutate(
      {
        idToken: session.idToken,
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
        },
      },
    );
  }, [session?.idToken]);

  function handleClick() {
    if (!acceptedTerms) {
      onRequireTerms?.();
      return;
    }

    // Persist state before page redirect — refs won't survive
    sessionStorage.setItem(
      PENDING_KEY,
      JSON.stringify({ role, acceptedTerms, acceptedPromotions }),
    );

    signIn('google'); // let NextAuth handle the redirect naturally
  }

  return (
    <button
      onClick={handleClick}
      disabled={exchangeGoogleToken.isPending}
      aria-label="Sign in with Google"
      className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#e8e6f0] bg-white transition-colors hover:border-brand-pink/40 disabled:opacity-50"
    >
      <svg viewBox="0 0 24 24" width="20" height="20">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
    </button>
  );
}
