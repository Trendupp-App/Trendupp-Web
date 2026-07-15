'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { PLATFORMS } from '@/shared/SocialsConnectUI';
import {
  useSocialConnections,
  useMockConnectSocial,
  useDisconnectSocial,
} from '@/hooks/useSocials';
import { beginSocialConnect, isOAuthConfigured, isMockConnectAvailable } from '@/lib/socialConnect';
import type { SocialPlatformId, SocialConnectionView } from '@/services/socialsApi';

/** The web PLATFORMS list uses id 'x' for Twitter; the backend uses 'twitter'. */
const ICON_ID_BY_PLATFORM: Record<SocialPlatformId, string> = {
  instagram: 'instagram',
  tiktok: 'tiktok',
  youtube: 'youtube',
  twitter: 'x',
};

function platformIcon(platform: SocialPlatformId) {
  return PLATFORMS.find((p) => p.id === ICON_ID_BY_PLATFORM[platform])?.icon ?? null;
}

interface SocialsOAuthConnectProps {
  /** Called with the number of connected platforms whenever it changes. */
  onConnectedCountChange?: (count: number) => void;
  ctaLabel?: string;
  onDone?: () => void;
  onSkip?: () => void;
  backLabel?: string;
}

/**
 * OAuth-verified "Connect Socials" cards, driven by GET /api/v1/socials.
 * Unlike the legacy manual flow, usernames and follower counts come from the
 * platform APIs — users cannot claim accounts or audiences they don't own.
 */
export default function SocialsOAuthConnect({
  onConnectedCountChange,
  ctaLabel = 'Continue',
  onDone,
  onSkip,
  backLabel = "I'll do that later",
}: SocialsOAuthConnectProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: connections, isLoading } = useSocialConnections();
  const mockConnect = useMockConnectSocial();
  const disconnect = useDisconnectSocial();
  const [redirectingTo, setRedirectingTo] = useState<SocialPlatformId | null>(null);

  const connectedCount = connections?.filter((c) => c.connected).length ?? 0;

  useEffect(() => {
    onConnectedCountChange?.(connectedCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectedCount]);

  async function handleConnect(card: SocialConnectionView) {
    // The OAuth redirect leaves the page — remember where to come back to.
    const query = searchParams.toString();
    const returnTo = query ? `${pathname}?${query}` : pathname;

    if (isOAuthConfigured(card.platform)) {
      setRedirectingTo(card.platform);
      try {
        await beginSocialConnect(card.platform, returnTo);
      } catch {
        setRedirectingTo(null);
        toast.error(`Could not start the ${card.label} connection`);
      }
      return;
    }

    if (isMockConnectAvailable()) {
      mockConnect.mutate(card.platform);
      return;
    }

    toast.error(`${card.label} connection is not available yet`);
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 w-full">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="border border-[#e8e6f0] rounded-xl p-4 bg-white h-[74px] animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      {(connections ?? []).map((card) => (
        <div
          key={card.platform}
          className="border shadow-md border-[#e8e6f0] rounded-xl p-4 bg-white flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#f5f3fb] flex items-center justify-center text-[#1a1a2e]">
              {platformIcon(card.platform)}
            </div>
            <div>
              <p className="text-sm font-medium text-[#1a1a2e]">
                {card.label}
                {card.connected && (
                  <span className="text-xs font-light text-[#9a99b0] ml-2">
                    • {card.followerCount.toLocaleString()} followers
                  </span>
                )}
              </p>
              {card.connected ? (
                <p className="text-xs text-[#9a99b0]">@{card.username}</p>
              ) : (
                <p className="text-xs text-[#9a99b0]">
                  Requires {card.minFollowers.toLocaleString()}+ followers
                </p>
              )}
            </div>
          </div>

          {card.connected ? (
            <div className="flex items-center gap-2">
              <span className="text-xs shadow font-medium text-green-500 bg-green-50 px-2.5 py-0.5 rounded-full">
                {card.verified ? 'Verified' : 'Connected'}
              </span>
              <button
                type="button"
                disabled={disconnect.isPending}
                onClick={() => disconnect.mutate(card.platform)}
                className="text-xs shadow text-brand-pink hover:border-brand-pink border cursor-pointer px-2.5 py-0.5 rounded-full disabled:opacity-50"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={redirectingTo === card.platform || mockConnect.isPending}
                onClick={() => void handleConnect(card)}
                className="flex items-center gap-1"
              >
                <span className="text-sm font-light cursor-pointer text-brand-pink border border-brand-pink/30 rounded-full px-4 py-1 hover:bg-brand-pink/5 transition-colors flex items-center gap-1.5">
                  {(redirectingTo === card.platform ||
                    (mockConnect.isPending && mockConnect.variables === card.platform)) && (
                    <RefreshCw size={12} className="animate-spin" />
                  )}
                  Connect
                </span>
              </button>
              {isMockConnectAvailable() && isOAuthConfigured(card.platform) && (
                // Dev-only: exercise the full backend round-trip without the
                // platform consent screen (backend honors mock codes outside prod).
                <button
                  type="button"
                  disabled={mockConnect.isPending}
                  onClick={() => mockConnect.mutate(card.platform)}
                  className="text-[10px] cursor-pointer text-[#9a99b0] underline underline-offset-2 hover:text-[#1a1a2e]"
                >
                  test
                </button>
              )}
            </div>
          )}
        </div>
      ))}

      {onDone && (
        <Button
          type="button"
          disabled={connectedCount === 0}
          onClick={onDone}
          className="w-full shadow-xl shadow-brand-pink-light bg-brand-pink rounded-md h-12 text-[15px] font-light text-white mt-2 disabled:bg-brand-pink/40"
        >
          {ctaLabel}
        </Button>
      )}

      {onSkip && (
        <button
          type="button"
          onClick={onSkip}
          className="text-sm text-[#7a7a9a] underline underline-offset-2 hover:text-[#1a1a2e] text-center transition-colors"
        >
          {backLabel}
        </button>
      )}
    </div>
  );
}
