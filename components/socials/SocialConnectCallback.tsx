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

export default function SocialConnectCallback({ platform, fallbackPath = '/' }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const hasExchanged = useRef(false);

  useEffect(() => {
    if (hasExchanged.current) return;

    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const state = searchParams.get('state');
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
        toast.success(`${result.message}`);
        router.replace(returnTo);
      })
      .catch((err: { response?: { data?: { message?: string } } }) => {
        toast.error(err?.response?.data?.message ?? 'Could not connect this account');
        router.replace(returnTo);
      });
  }, [searchParams, router, platform, fallbackPath]);

  return <PageLoader />;
}
