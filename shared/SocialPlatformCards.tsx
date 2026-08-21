'use client';

import { useAuthStore } from '@/store/authStore';
import { PLATFORMS } from '@/shared/Socials';

export default function SocialPlatformCards() {
  const user = useAuthStore((s) => s.user);
  const socials = user?.socialsConnected;

  const connectedPlatforms = PLATFORMS.filter((p) => socials?.[p.connectedKey]);

  if (connectedPlatforms.length === 0) {
    return <p className="text-xs text-[#9a99b0] px-1">No social accounts connected yet.</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {connectedPlatforms.map((p) => (
        <div
          key={p.id}
          className="bg-white border border-[#e8e6f0] rounded-xl px-4 py-3 flex items-center gap-3"
        >
          <div className="w-8 h-8 rounded-full bg-[#f5f3fb] flex items-center justify-center shrink-0 text-[#1a1a2e]">
            {p.icon}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-[#1a1a2e] truncate">{p.name}</p>
            <p className="text-[10px] text-emerald-500">Connected</p>
          </div>
          <div className="w-2 h-2 rounded-full shrink-0 bg-emerald-500" />
        </div>
      ))}
    </div>
  );
}
