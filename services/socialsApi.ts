import apiClient from '@/lib/apiClient';

/** Platform ids as the backend knows them (server: src/domains/socials). */
export type SocialPlatformId = 'instagram' | 'tiktok' | 'youtube' | 'twitter';

export const SOCIAL_PLATFORM_IDS: SocialPlatformId[] = [
  'instagram',
  'tiktok',
  'youtube',
  'twitter',
];

/** One platform card from GET /socials — connected or not. */
export interface SocialConnectionView {
  platform: SocialPlatformId;
  label: string;
  connected: boolean;
  verified: boolean;
  username: string | null;
  followerCount: number;
  avatarUrl: string | null;
  minFollowers: number;
  connectedAt: string | null;
}

export interface SocialsMutationResult {
  message: string;
  tier: string;
  connections: SocialConnectionView[];
  connection?: SocialConnectionView;
}

export interface ConnectSocialPayload {
  /** OAuth authorization code from the platform redirect */
  code: string;
  /** Must exactly match the redirect_uri used in the authorize request */
  redirectUri: string;
  /** PKCE verifier (TikTok / YouTube / X) */
  codeVerifier?: string;
}

export const socialsApi = {
  /** All four platform cards with the caller's current connection status. */
  list: () => apiClient.get<SocialConnectionView[]>('/socials'),

  /** Exchange an OAuth code, verify follower count, connect. */
  connect: (platform: SocialPlatformId, payload: ConnectSocialPayload) =>
    apiClient.post<SocialsMutationResult>(`/socials/${platform}/connect`, payload),

  /** Re-pull follower stats for an already-connected platform. */
  refresh: (platform: SocialPlatformId) =>
    apiClient.post<SocialsMutationResult>(`/socials/${platform}/refresh`, {}),

  /** Disconnect a platform. */
  disconnect: (platform: SocialPlatformId) =>
    apiClient.delete<SocialsMutationResult>(`/socials/${platform}`),
};
