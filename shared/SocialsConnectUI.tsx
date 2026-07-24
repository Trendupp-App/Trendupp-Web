'use client';

import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export type ConnectedAccount = {
  platformId: string;
  username: string;
  followers: string;
};

type Platform = {
  id: string;
  name: string;
  icon: React.ReactNode;
  requirements: string[];
  usernameKey: string;
  followersKey: string;
};

export const PLATFORMS: Platform[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
      </svg>
    ),
    requirements: [
      'My Instagram account is linked to a Facebook page',
      'I have a business or creator Instagram account',
    ],
    usernameKey: 'instagramUsername',
    followersKey: 'instagramFollowers',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
        <rect x="2" y="5" width="20" height="14" rx="4" fill="#FF0000" />
        <polygon points="10,8 10,16 17,12" fill="white" />
      </svg>
    ),
    requirements: ['My YouTube channel is public', 'My channel has at least 100 subscribers'],
    usernameKey: 'youtubeUsername',
    followersKey: 'youtubeFollowers',
  },
  {
    id: 'x',
    name: 'X/Twitter',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.261 5.636 5.903-5.636Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    requirements: [
      'My X/Twitter account is public',
      'I have an active account with at least 500 followers',
    ],
    usernameKey: 'twitterUsername',
    followersKey: 'twitterFollowers',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.78 1.52V6.79a4.85 4.85 0 01-1.01-.1z" />
      </svg>
    ),
    requirements: ['My TikTok account is public', 'I have a creator or business TikTok account'],
    usernameKey: 'tiktokUsername',
    followersKey: 'tiktokFollowers',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    requirements: [
      'My Facebook account manages a public page',
      'I have an active Facebook account',
    ],
    usernameKey: 'facebookUsername',
    followersKey: 'facebookFollowers',
  },
];

interface SocialsConnectUIProps {
  defaultValues?: { connected?: ConnectedAccount[] };
  onConnect: (
    payload: Record<string, string | number>,
    callbacks: { onSuccess: () => void },
  ) => void;
  isPending: boolean;
  ctaLabel?: string;
  backLabel?: string;
  onDone: (connected: ConnectedAccount[]) => void;
  onSkip?: () => void;
}

export default function SocialsConnectUI({
  defaultValues,
  onConnect,
  isPending,
  ctaLabel = 'Continue',
  backLabel = "I'll do that later",
  onDone,
  onSkip,
}: SocialsConnectUIProps) {
  const [connected, setConnected] = useState<ConnectedAccount[]>(defaultValues?.connected ?? []);
  const [activePlatform, setActivePlatform] = useState<Platform | null>(null);
  const [usernameInput, setUsernameInput] = useState('');
  const [followersInput, setFollowersInput] = useState('');

  function isConn(id: string) {
    return connected.some((c) => c.platformId === id);
  }

  function getAccount(id: string) {
    return connected.find((c) => c.platformId === id);
  }

  function openPlatform(platform: Platform) {
    const existing = getAccount(platform.id);
    setUsernameInput(existing?.username.replace(/^@/, '') ?? '');
    setFollowersInput(existing ? existing.followers.replace(/[^\d]/g, '') : '');
    setActivePlatform(platform);
  }

  const followersValue = Number(followersInput);
  const canSubmit =
    usernameInput.trim().length > 0 &&
    followersInput.trim().length > 0 &&
    !Number.isNaN(followersValue) &&
    followersValue >= 0;

  function handleConnect() {
    if (!activePlatform || !canSubmit) return;
    const username = usernameInput.trim();

    onConnect(
      {
        [activePlatform.usernameKey]: username,
        [activePlatform.followersKey]: followersValue,
      },
      {
        onSuccess: () => {
          setConnected((prev) => [
            ...prev.filter((c) => c.platformId !== activePlatform.id),
            {
              platformId: activePlatform.id,
              username: `@${username}`,
              followers: `${followersValue.toLocaleString()} followers`,
            },
          ]);
          setActivePlatform(null);
          setUsernameInput('');
          setFollowersInput('');
        },
      },
    );
  }

  function handleDisconnect(platformId: string) {
    setConnected((prev) => prev.filter((c) => c.platformId !== platformId));
  }

  // ── Platform detail sub-view ──────────────────────────────────────────────
  if (activePlatform) {
    return (
      <div className="flex flex-col gap-4 w-full">
        <div className="border border-[#e8e6f0] rounded-xl p-4 flex items-center gap-3 bg-white">
          <div className="w-10 h-10 rounded-full bg-[#f5f3fb] flex items-center justify-center text-[#1a1a2e]">
            {activePlatform.icon}
          </div>
          <div>
            <p className="text-sm font-medium text-[#1a1a2e]">{activePlatform.name}</p>
            <p className="text-xs text-[#9a99b0]">
              Connect your {activePlatform.name.toLowerCase()} account
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm text-[#1a1a2e] mb-3">
            Before you proceed, please confirm your account meets {activePlatform.name}&apos;s
            connection requirements
          </p>
          <ul className="flex flex-col gap-2">
            {activePlatform.requirements.map((req) => (
              <li key={req} className="flex items-start gap-2 text-sm text-[#1a1a2e]">
                <span className="mt-0.5">•</span>
                {req}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs text-[#7a7a9a] mb-1 block">Username</label>
            <Input
              type="text"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              placeholder={`Your ${activePlatform.name} username`}
              className="border-[#e8e6f0] h-10 text-sm font-light focus-visible:ring-brand-pink/30 focus-visible:border-brand-pink"
            />
          </div>
          <div>
            <label className="text-xs text-[#7a7a9a] mb-1 block">Follower count</label>
            <Input
              type="number"
              min={0}
              value={followersInput}
              onChange={(e) => setFollowersInput(e.target.value)}
              placeholder="e.g. 12000"
              className="border-[#e8e6f0] h-10 text-sm font-light focus-visible:ring-brand-pink/30 focus-visible:border-brand-pink"
            />
          </div>
        </div>

        <Button
          type="button"
          disabled={!canSubmit || isPending}
          onClick={handleConnect}
          className="w-full bg-brand-pink rounded-md h-12 text-[15px] font-light text-white mt-2 flex items-center justify-center gap-2 disabled:bg-brand-pink/40"
        >
          <ExternalLink size={16} />
          {isPending ? 'Saving...' : 'Save'}
        </Button>

        <button
          type="button"
          onClick={() => setActivePlatform(null)}
          className="text-sm text-[#7a7a9a] underline underline-offset-2 hover:text-[#1a1a2e] text-center transition-colors"
        >
          Go back
        </button>
      </div>
    );
  }

  // ── Platform list ─────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-3 w-full">
      {PLATFORMS.map((platform) => {
        const account = getAccount(platform.id);
        const connected_ = isConn(platform.id);

        return (
          <div
            key={platform.id}
            className="border border-[#e8e6f0] rounded-xl p-4 bg-white flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#f5f3fb] flex items-center justify-center text-[#1a1a2e]">
                {platform.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-[#1a1a2e]">
                  {platform.name}
                  {account && (
                    <span className="text-xs font-light text-[#9a99b0] ml-2">
                      • {account.followers}
                    </span>
                  )}
                </p>
                {account && <p className="text-xs text-[#9a99b0]">{account.username}</p>}
              </div>
            </div>

            {connected_ ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-green-500 bg-green-50 px-2.5 py-0.5 rounded-full">
                  Connected
                </span>
                <button
                  type="button"
                  onClick={() => handleDisconnect(platform.id)}
                  className="text-xs cursor-pointer text-brand-pink border border-brand-pink/30 cursor-pointer px-2.5 py-0.5 rounded-full hover:bg-brand-pink/5 transition-colors"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => openPlatform(platform)}>
                <span className="text-sm cursor-pointer font-light text-brand-pink border border-brand-pink/30 rounded-full px-4 py-1 hover:bg-brand-pink/5 transition-colors">
                  Connect
                </span>
              </button>
            )}
          </div>
        );
      })}

      <Button
        type="button"
        disabled={connected.length === 0}
        onClick={() => onDone(connected)}
        className="w-full shadow-xl cursor-pointer shadow-brand-pink-light bg-brand-pink rounded-md h-12 text-[15px] font-light text-white mt-2 disabled:bg-brand-pink/40"
      >
        {ctaLabel}
      </Button>

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
