'use client';

import { useSession, signIn } from 'next-auth/react';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGoogleAuth } from '@/hooks/useAuthMutations';
import { FaSpinner } from 'react-icons/fa6';
import { toast } from 'sonner';

const PENDING_KEY = 'google_auth_pending';
const PENDING_MAX_AGE_MS = 5 * 60 * 1000;

/**
 * Google ID tokens expire after 1 hour. A NextAuth session can outlive that
 * by weeks — replaying its stored idToken makes the backend reject with
 * "Invalid Google ID Token". Only exchange tokens that are still fresh.
 */
function isIdTokenFresh(idToken: string): boolean {
  try {
    const [, payload] = idToken.split('.');
    const { exp } = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return typeof exp === 'number' && exp * 1000 > Date.now() + 30_000;
  } catch {
    return false;
  }
}

interface PendingAuth {
  role: string;
  acceptedTerms: boolean;
  acceptedPromotions: boolean;
  createdAt: number;
}

interface Props {
  role: string;
  acceptedTerms: boolean;
  acceptedPromotions: boolean;
  onRequireTerms?: () => void;
  onPendingChange?: (pending: boolean) => void;
  onResumeTermsAccepted?: () => void;
  onStart?: () => void;
  disabled?: boolean;
  onAuthError?: () => void;
}

export interface SocialSignInHandle {
  trigger: (options?: { skipTermsCheck?: boolean }) => void;
}

export const GoogleSignInButton = forwardRef<SocialSignInHandle, Props>(function GoogleSignInButton(
  {
    role,
    acceptedTerms,
    acceptedPromotions,
    onRequireTerms,
    onPendingChange,
    onResumeTermsAccepted,
    onStart,
    disabled,
    onAuthError,
  },
  ref,
) {
  const { data: session } = useSession();
  const { exchangeGoogleToken } = useGoogleAuth();
  const router = useRouter();
  const hasExchanged = useRef(false);
  const [isExchanging, setIsExchanging] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    onPendingChange?.(isExchanging || exchangeGoogleToken.isPending);
  }, [exchangeGoogleToken.isPending, onPendingChange, isExchanging]);

  useEffect(() => {
    if (!session?.idToken || hasExchanged.current) return;
    const raw = sessionStorage.getItem(PENDING_KEY);
    if (!raw) return;

    let pending: PendingAuth;
    try {
      pending = JSON.parse(raw);
    } catch {
      sessionStorage.removeItem(PENDING_KEY);
      return;
    }

    sessionStorage.removeItem(PENDING_KEY);

    if (Date.now() - pending.createdAt > PENDING_MAX_AGE_MS) {
      return;
    }

    if (!pending.acceptedTerms) {
      onRequireTerms?.();
      return;
    }

    // Stale session (e.g. an abandoned sign-in attempt resumed hours later):
    // the stored idToken has expired — drop the pending state and wait for a
    // fresh click instead of sending a doomed exchange to the backend.
    if (!isIdTokenFresh(session.idToken)) {
      sessionStorage.removeItem(PENDING_KEY);
      return;
    }

    onResumeTermsAccepted?.();

    hasExchanged.current = true;
    setIsExchanging(true);

    exchangeGoogleToken.mutate(
      {
        idToken: session.idToken,
        role: pending.role,
        acceptedTerms: pending.acceptedTerms,
        acceptedPromotions: pending.acceptedPromotions,
      },
      {
        onError: () => {
          hasExchanged.current = false;
          setIsExchanging(false);
          onAuthError?.();
          toast.error('Something went wrong signing in with Google. Please try again.');
        },
      },
    );
  }, [
    session?.idToken,
    exchangeGoogleToken,
    onRequireTerms,
    router,
    onResumeTermsAccepted,
    onAuthError,
  ]);

  function handleClick(options?: { skipTermsCheck?: boolean }) {
    if (disabled || isExchanging || loading) return;

    if (!acceptedTerms && !options?.skipTermsCheck) {
      onRequireTerms?.();
      return;
    }
    setLoading(true);
    onStart?.();

    sessionStorage.setItem(
      PENDING_KEY,
      JSON.stringify({ role, acceptedTerms: true, acceptedPromotions, createdAt: Date.now() }),
    );

    signIn('google');
  }

  useImperativeHandle(ref, () => ({ trigger: handleClick }));

  return (
    <button
      onClick={() => handleClick()}
      disabled={disabled || exchangeGoogleToken.isPending}
      aria-label="Sign in with Google"
      className="flex cursor-pointer h-11 w-11 items-center justify-center rounded-xl border border-[#e8e6f0] bg-white transition-colors hover:border-brand-pink/40 disabled:opacity-50"
    >
      {loading ? (
        <FaSpinner className="animate-spin text-brand-pink" />
      ) : (
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
      )}
    </button>
  );
});
