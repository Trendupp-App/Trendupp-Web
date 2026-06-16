'use client';

import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Platform = {
  id: string;
  name: string;
  icon: React.ReactNode;
  requirements: string[];
};

const PLATFORMS: Platform[] = [
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
  },
];

type ConnectedAccount = {
  platformId: string;
  username: string;
  followers: string;
};

interface Props {
  onNext: (data: { connected: ConnectedAccount[] }) => void;
  onSkip: () => void;
  defaultValues?: { connected?: ConnectedAccount[] };
}

export default function StepSocials({ onNext, onSkip, defaultValues }: Props) {
  const [connected, setConnected] = useState<ConnectedAccount[]>(defaultValues?.connected ?? []);
  const [activePlatform, setActivePlatform] = useState<Platform | null>(null);

  function isConnected(id: string) {
    return connected.some((c) => c.platformId === id);
  }

  function getAccount(id: string) {
    return connected.find((c) => c.platformId === id);
  }

  function handleConnect() {
    if (!activePlatform) return;
    // Simulate OAuth connection returning mock data
    setConnected((prev) => [
      ...prev.filter((c) => c.platformId !== activePlatform.id),
      { platformId: activePlatform.id, username: '@username', followers: '12.4k followers' },
    ]);
    setActivePlatform(null);
  }

  function handleDisconnect(platformId: string) {
    setConnected((prev) => prev.filter((c) => c.platformId !== platformId));
  }

  // Sub-view: platform connection detail
  if (activePlatform) {
    return (
      <div className="flex flex-col gap-4 w-full">
        {/* Platform card */}
        <div className="border border-[#e8e6f0] rounded-xl p-4 flex items-center gap-3 bg-white">
          <div className="w-10 h-10 rounded-full bg-[#f5f3fb] flex items-center justify-center text-[#1a1a2e]">
            {activePlatform.icon}
          </div>
          <div>
            <p className="text-sm font-medium text-[#1a1a2e]">{activePlatform.name}</p>
            <p className="text-xs text-[#9a99b0]">
              Connect your {activePlatform.name.toLowerCase()} accounts
            </p>
          </div>
        </div>

        {/* Requirements */}
        <div>
          <p className="text-sm text-[#1a1a2e] mb-3">
            Before you proceed, please confirm your account meet {activePlatform.name}&apos;s
            connection requirements
          </p>
          <ul className="flex flex-col gap-2">
            {activePlatform.requirements.map((req) => (
              <li key={req} className="flex items-start gap-2 text-sm text-[#1a1a2e]">
                <span className="mt-0.5 text-[#1a1a2e]">•</span>
                {req}
              </li>
            ))}
          </ul>
        </div>

        <Button
          type="button"
          onClick={handleConnect}
          className="w-full bg-brand-pink rounded-md h-12 text-[15px] font-light text-white mt-2 flex items-center justify-center gap-2"
        >
          <ExternalLink size={16} />
          Continue
        </Button>

        <button
          type="button"
          onClick={() => setActivePlatform(null)}
          className="text-sm text-[#7a7a9a] underline underline-offset-2 hover:text-[#1a1a2e] text-center transition-colors"
        >
          I&apos;ll do that later
        </button>
      </div>
    );
  }

  // Main socials list view
  return (
    <div className="flex flex-col gap-3 w-full">
      {PLATFORMS.map((platform) => {
        const account = getAccount(platform.id);
        const connected_ = isConnected(platform.id);

        return (
          <div
            key={platform.id}
            className="border shadow-md border-[#e8e6f0] rounded-xl p-4 bg-white flex items-center justify-between"
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
              <div className="flex flex-col items-end gap-0.5">
                <span className="text-xs font-medium text-green-500 bg-green-50 px-2.5 py-0.5 rounded-full">
                  Connected
                </span>
                <button
                  type="button"
                  onClick={() => handleDisconnect(platform.id)}
                  className="text-xs text-brand-pink hover:underline"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setActivePlatform(platform)}
                className="flex items-center gap-1"
              >
                <span className="text-sm font-light text-brand-pink border border-brand-pink/30 rounded-full px-4 py-1 hover:bg-brand-pink/5 transition-colors">
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
        onClick={() => onNext({ connected })}
        className="w-full shadow-xl shadow-brand-pink-light bg-brand-pink rounded-md h-12 text-[15px] font-light text-white mt-2 disabled:bg-brand-pink-light"
      >
        Continue
      </Button>

      <button
        type="button"
        onClick={onSkip}
        className="text-sm text-[#7a7a9a] underline underline-offset-2 hover:text-[#1a1a2e] text-center transition-colors"
      >
        I&apos;ll do that later
      </button>
    </div>
  );
}
