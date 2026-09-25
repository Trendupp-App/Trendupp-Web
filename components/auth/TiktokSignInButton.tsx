'use client';

import { forwardRef, useImperativeHandle, useState } from 'react';
import { generateCodeVerifier, generateCodeChallenge } from '@/lib/pkce';
import type { SocialSignInHandle } from './GoogleSignInButton';
import { FaSpinner } from 'react-icons/fa6';
import { useAuthProviderEnabled } from '@/hooks/useAuthProviders';

const TIKTOK_PENDING_KEY = 'tiktok_auth_pending';
const TIKTOK_CLIENT_KEY = process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY!;

interface Props {
  role: string;
  acceptedTerms: boolean;
  acceptedPromotions: boolean;
  onRequireTerms?: () => void;
  onStart?: () => void;
  disabled?: boolean;
}

export const TiktokSignInButton = forwardRef<SocialSignInHandle, Props>(function TiktokSignInButton(
  { role, acceptedTerms, acceptedPromotions, onRequireTerms, onStart, disabled },
  ref,
) {
  const [loading, setLoading] = useState(false);
  const providerEnabled = useAuthProviderEnabled('tiktok');
  async function handleClick(options?: { skipTermsCheck?: boolean }) {
    if (disabled) return;

    if (!acceptedTerms && !options?.skipTermsCheck) {
      onRequireTerms?.();
      return;
    }
    setLoading(true);
    onStart?.();

    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback/tiktok`;

    localStorage.setItem(
      TIKTOK_PENDING_KEY,
      JSON.stringify({ role, codeVerifier, redirectUri, acceptedTerms: true, acceptedPromotions }),
    );

    const params = new URLSearchParams({
      client_key: TIKTOK_CLIENT_KEY,
      scope: 'user.info.basic',
      response_type: 'code',
      redirect_uri: redirectUri,
      state: role,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    });

    window.location.href = `https://www.tiktok.com/v2/auth/authorize/?${params.toString()}`;
  }

  useImperativeHandle(ref, () => ({ trigger: handleClick }));

  // Backend kill-switch: hidden entirely when the provider is disabled
  // for this page's mode (signin vs signup). Enforced server-side too.
  if (!providerEnabled) return null;

  return (
    <button
      onClick={() => handleClick()}
      disabled={disabled}
      aria-label="Sign in with TikTok"
      className="flex h-11 cursor-pointer w-11 items-center justify-center rounded-xl border border-[#e8e6f0] bg-white transition-colors hover:border-brand-pink/40"
    >
      {' '}
      {loading ? (
        <FaSpinner className="animate-spin text-brand-pink" />
      ) : (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z" />
        </svg>
      )}
    </button>
  );
});
