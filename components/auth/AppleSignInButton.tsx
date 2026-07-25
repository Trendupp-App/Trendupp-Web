'use client';

import { forwardRef, useImperativeHandle, useState } from 'react';
import type { SocialSignInHandle } from './GoogleSignInButton';
import { FaSpinner } from 'react-icons/fa6';

const APPLE_PENDING_KEY = 'apple_auth_pending';

interface Props {
  role: string;
  acceptedTerms: boolean;
  acceptedPromotions: boolean;
  onRequireTerms?: () => void;
  onStart?: () => void;
  disabled?: boolean;
}

export const AppleSignInButton = forwardRef<SocialSignInHandle, Props>(function AppleSignInButton(
  { role, acceptedTerms, acceptedPromotions, onRequireTerms, onStart, disabled },
  ref,
) {
  const [loading, setLoading] = useState(false);
  function handleClick(options?: { skipTermsCheck?: boolean }) {
    if (disabled) return;

    if (!acceptedTerms && !options?.skipTermsCheck) {
      onRequireTerms?.();
      return;
    }
    setLoading(true);
    onStart?.();

    // Apple's form_post must target the API route handler, not the client page.
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/apple/callback`;

    sessionStorage.setItem(
      APPLE_PENDING_KEY,
      JSON.stringify({ role, redirectUri, acceptedTerms: true, acceptedPromotions }),
    );

    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_APPLE_SERVICES_ID!,
      redirect_uri: redirectUri,
      response_type: 'code id_token',
      // Apple mandates form_post when the name/email scope is requested. The
      // POST lands on /api/auth/apple/callback, which forwards the values to
      // the client callback page as a URL fragment.
      response_mode: 'form_post',
      scope: 'name email',
      state: 'login_apple',
    });

    window.location.href = `https://appleid.apple.com/auth/authorize?${params.toString()}`;
  }

  useImperativeHandle(ref, () => ({ trigger: handleClick }));

  return (
    <button
      onClick={() => handleClick()}
      disabled={disabled}
      aria-label="Sign in with Apple"
      className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-[#e8e6f0] bg-white transition-colors hover:border-brand-pink/40"
    >
      {loading ? (
        <FaSpinner className="animate-spin text-brand-pink" />
      ) : (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z" />
        </svg>
      )}
    </button>
  );
});
