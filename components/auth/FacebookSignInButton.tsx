'use client';

import { forwardRef, useImperativeHandle, useState } from 'react';
import type { SocialSignInHandle } from './GoogleSignInButton';
import { FaSpinner } from 'react-icons/fa6';
import { useAuthProviderEnabled } from '@/hooks/useAuthProviders';

const FACEBOOK_PENDING_KEY = 'facebook_auth_pending';

interface Props {
  role: string;
  acceptedTerms: boolean;
  acceptedPromotions: boolean;
  onRequireTerms?: () => void;
  onStart?: () => void;
  disabled?: boolean;
}

export const FacebookSignInButton = forwardRef<SocialSignInHandle, Props>(
  function FacebookSignInButton(
    { role, acceptedTerms, acceptedPromotions, onRequireTerms, onStart, disabled },
    ref,
  ) {
    const [loading, setLoading] = useState(false);
    const providerEnabled = useAuthProviderEnabled('facebook');
    function handleClick(options?: { skipTermsCheck?: boolean }) {
      if (disabled) return;

      if (!acceptedTerms && !options?.skipTermsCheck) {
        onRequireTerms?.();
        return;
      }
      setLoading(true);
      onStart?.();

      const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback/facebook`;

      sessionStorage.setItem(
        FACEBOOK_PENDING_KEY,
        JSON.stringify({ role, redirectUri, acceptedTerms: true, acceptedPromotions }),
      );

      const params = new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID!,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'public_profile,email',
        state: 'login_facebook',
      });

      window.location.href = `https://www.facebook.com/v23.0/dialog/oauth?${params.toString()}`;
    }

    useImperativeHandle(ref, () => ({ trigger: handleClick }));

    // Backend kill-switch: hidden entirely when the provider is disabled
    // for this page's mode (signin vs signup). Enforced server-side too.
    if (!providerEnabled) return null;

    return (
      <button
        onClick={() => handleClick()}
        disabled={disabled}
        aria-label="Sign in with Facebook"
        className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-[#e8e6f0] bg-white transition-colors hover:border-brand-pink/40"
      >
        {loading ? (
          <FaSpinner className="animate-spin text-brand-pink" />
        ) : (
          <svg viewBox="0 0 24 24" width="20" height="20" fill="#1877F2">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        )}
      </button>
    );
  },
);
