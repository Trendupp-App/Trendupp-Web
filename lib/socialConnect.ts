import { generateCodeVerifier, generateCodeChallenge } from '@/lib/pkce';
import { useAuthStore } from '@/store/authStore';
import {
  socialsApi,
  type SocialPlatformId,
  type SocialsMutationResult,
} from '@/services/socialsApi';

/**
 * OAuth "connect socials" flow (distinct from social LOGIN):
 *
 * 1. beginSocialConnect(platform, returnTo) — stores pending state and sends
 *    the browser to the platform's authorize page.
 * 2. The platform redirects back to /auth/callback/<platform>?code=...
 *    The callback page sees the pending state and calls
 *    completeSocialConnect(code) → POST /api/v1/socials/:platform/connect.
 * 3. The user is returned to `returnTo` (onboarding step, settings, ...).
 */

const PENDING_KEY = 'social_connect_pending';

export interface SocialConnectPending {
  platform: SocialPlatformId;
  redirectUri: string;
  returnTo: string;
  codeVerifier?: string;
}

interface PlatformOAuthConfig {
  clientId: string | undefined;
  authorizeUrl: string;
  scope: string;
  /** Name of the client-id query param (TikTok calls it client_key). */
  clientIdParam: string;
  usesPkce: boolean;
  extraParams?: Record<string, string>;
}

const OAUTH_CONFIG: Record<SocialPlatformId, PlatformOAuthConfig> = {
  tiktok: {
    clientId: process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY,
    authorizeUrl: 'https://www.tiktok.com/v2/auth/authorize/',
    // user.info.stats is required for follower_count
    scope: 'user.info.basic,user.info.profile,user.info.stats',
    clientIdParam: 'client_key',
    usesPkce: true,
  },
  instagram: {
    clientId: process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID,
    authorizeUrl: 'https://www.instagram.com/oauth/authorize',
    scope: 'instagram_business_basic',
    clientIdParam: 'client_id',
    usesPkce: false,
  },
  youtube: {
    clientId: process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_ID,
    authorizeUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    scope: 'https://www.googleapis.com/auth/youtube.readonly',
    clientIdParam: 'client_id',
    usesPkce: true,
    extraParams: { access_type: 'offline', prompt: 'consent' },
  },
  twitter: {
    clientId: process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID,
    authorizeUrl: 'https://x.com/i/oauth2/authorize',
    scope: 'users.read tweet.read',
    clientIdParam: 'client_id',
    usesPkce: true, // PKCE is mandatory for X OAuth 2.0
  },
};

/** Whether real OAuth can start for this platform (client id configured). */
export function isOAuthConfigured(platform: SocialPlatformId): boolean {
  return Boolean(OAUTH_CONFIG[platform].clientId);
}

export function readSocialConnectPending(): SocialConnectPending | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(PENDING_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SocialConnectPending;
  } catch {
    localStorage.removeItem(PENDING_KEY);
    return null;
  }
}

export function clearSocialConnectPending(): void {
  if (typeof window !== 'undefined') localStorage.removeItem(PENDING_KEY);
}

/** Store pending state and redirect the browser to the platform's consent page. */
export async function beginSocialConnect(
  platform: SocialPlatformId,
  returnTo: string,
): Promise<void> {
  const config = OAUTH_CONFIG[platform];
  if (!config.clientId) {
    throw new Error(`${platform} OAuth is not configured on this environment`);
  }

  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback/${platform}`;
  const pending: SocialConnectPending = { platform, redirectUri, returnTo };

  const params = new URLSearchParams({
    [config.clientIdParam]: config.clientId,
    scope: config.scope,
    response_type: 'code',
    redirect_uri: redirectUri,
    state: `connect_${platform}`,
    ...config.extraParams,
  });

  if (config.usesPkce) {
    const codeVerifier = generateCodeVerifier();
    pending.codeVerifier = codeVerifier;
    params.set('code_challenge', await generateCodeChallenge(codeVerifier));
    params.set('code_challenge_method', 'S256');
  }

  localStorage.setItem(PENDING_KEY, JSON.stringify(pending));
  window.location.href = `${config.authorizeUrl}?${params.toString()}`;
}

/**
 * Exchange the OAuth code via the backend and sync the auth store with the
 * verified result (tier + connected flags). Used by the callback pages.
 */
export async function completeSocialConnect(
  code: string,
  pending: SocialConnectPending,
): Promise<SocialsMutationResult> {
  const { data } = await socialsApi.connect(pending.platform, {
    code,
    redirectUri: pending.redirectUri,
    codeVerifier: pending.codeVerifier,
  });
  syncAuthStoreFromSocials(data);
  return data;
}

/** Keep the persisted user in step with a socials mutation result. */
export function syncAuthStoreFromSocials(result: SocialsMutationResult): void {
  const connected = Object.fromEntries(
    result.connections.map((c) => [c.platform, c.connected]),
  ) as Record<SocialPlatformId, boolean>;

  useAuthStore.getState().updateUser({
    assignedTier: result.tier,
    socialsConnected: {
      instagram: connected.instagram ?? false,
      tiktok: connected.tiktok ?? false,
      youtube: connected.youtube ?? false,
      twitter: connected.twitter ?? false,
    },
  });
}
