'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import PageLoader from '@/components/skeletons/PageLoader';
import {
  readSocialConnectPending,
  clearSocialConnectPending,
  completeSocialConnect,
} from '@/lib/socialConnect';
import type { SocialPlatformId } from '@/services/socialsApi';

interface Props {
  platform: SocialPlatformId;
  /** Where to send the user when there is no pending state to return to. */
  fallbackPath?: string;
}

/**
 * OAuth callback handler for the "connect socials" flow. The platform
 * redirects here with ?code=...; we exchange it via
 * POST /api/v1/socials/:platform/connect and bounce back to wherever the
 * connect was started (onboarding step, settings page, ...).
 */
export default function SocialConnectCallback({ platform, fallbackPath = '/' }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const hasExchanged = useRef(false);

  useEffect(() => {
    if (hasExchanged.current) return;

    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const state = searchParams.get('state');

    // The mobile app shares this redirect URI (Google only allows HTTPS
    // redirect URIs on a Web OAuth client). There's no pending state in this
    // browser's localStorage for a mobile-originated request — the app never
    // wrote it — so hand the code/state off to the native app via deep link
    // before touching any of the web "connect" bookkeeping below. Mirrors the
    // same pattern already used in the TikTok/Instagram callback pages.
    const isMobileApp = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobileApp && code && state) {
      window.location.href = `trendupp://auth/${platform}/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`;
      return;
    }

    const pending = readSocialConnectPending();
    const returnTo = pending?.returnTo ?? fallbackPath;

    if (error) {
      clearSocialConnectPending();
      toast.error('Connection was cancelled');
      router.replace(returnTo);
      return;
    }

    if (!code || !pending || pending.platform !== platform) {
      clearSocialConnectPending();
      toast.error('Session expired, please try connecting again');
      router.replace(returnTo);
      return;
    }

    hasExchanged.current = true;
    clearSocialConnectPending();

    completeSocialConnect(code, pending)
      .then((result) => {
        console.log('[social-connect] success response:', result);
        toast.success(`${result.message} — you are now a ${result.tier}`);
        router.replace(returnTo);
      })
      .catch((err: { response?: { data?: { message?: string } } }) => {
        console.log('[social-connect] error response:', err?.response?.data ?? err);
        toast.error(err?.response?.data?.message ?? 'Could not connect this account');
        router.replace(returnTo);
      });
  }, [searchParams, router, platform, fallbackPath]);

  return <PageLoader />;
}
