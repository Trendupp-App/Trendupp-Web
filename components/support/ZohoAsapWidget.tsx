'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import apiClient from '@/lib/apiClient';
import { useAuthStore } from '@/store/authStore';

/**
 * Zoho Desk ASAP help widget (support tickets, knowledge base, GC bot).
 *
 * Dark until NEXT_PUBLIC_ZOHO_ASAP_WIDGET_URL is set — paste the script src
 * from Zoho Desk → Setup → Channels → ASAP (web add-on).
 *
 * Signed-in users are logged into ASAP via the enhanced JWT mechanism: the
 * widget asks for a token and we mint one at GET /support/asap-token, so
 * tickets attach to the Trendupp account.
 */

type AsapInvoke = (action: string, payload?: unknown) => void;

declare global {
  interface Window {
    ZohoDeskAsapReady?: (callback: () => void) => void;
    ZohoDeskAsap?: { invoke: AsapInvoke };
    ZohoDeskAsapReadyStatus?: boolean;
  }
}

const WIDGET_URL = process.env.NEXT_PUBLIC_ZOHO_ASAP_WIDGET_URL;

const onAsapReady = (callback: () => void) => {
  if (typeof window === 'undefined') return;
  if (window.ZohoDeskAsapReady) {
    window.ZohoDeskAsapReady(callback);
  }
};

const fetchAsapToken = (success: (token: string) => void, failure: (error: unknown) => void) => {
  apiClient
    .get<{ token: string }>('/support/asap-token')
    .then((res) => success(res.data.token))
    .catch((err) => failure(err));
};

export default function ZohoAsapWidget() {
  const accessToken = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (!WIDGET_URL) return;
    onAsapReady(() => {
      if (accessToken) {
        window.ZohoDeskAsap?.invoke('login', fetchAsapToken);
      } else {
        window.ZohoDeskAsap?.invoke('logout');
      }
    });
  }, [accessToken]);

  if (!WIDGET_URL) return null;

  return (
    <Script
      id="zohodesk-asap"
      src={WIDGET_URL}
      strategy="lazyOnload"
      onLoad={() => {
        onAsapReady(() => {
          if (useAuthStore.getState().accessToken) {
            window.ZohoDeskAsap?.invoke('login', fetchAsapToken);
          }
        });
      }}
    />
  );
}
