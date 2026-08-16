'use client';

import Image from 'next/image';
import { Pencil, Globe, MapPin } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { UpdatePersonalInfoPayload } from '@/types/profile';
interface ProfileHeroBannerProps {
  onEditProfile: () => void;
}

export default function ProfileHeroBanner({ onEditProfile }: ProfileHeroBannerProps) {
  const user = useAuthStore((s) => s.user);

  const displayName = user?.username ?? `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim();

  const location = [user?.state?.name, user?.country?.name].filter(Boolean).join(', ');

  return (
    <div className="relative bg-[#0d0d2b] rounded-2xl px-6 py-8 flex items-center gap-5">
      {/* Avatar */}
      <div className="w-20 h-20 rounded-full overflow-hidden bg-[#f0eef8] shrink-0 border-2 border-white/20">
        {user?.avatarUrl ? (
          <Image
            src={user.avatarUrl}
            alt={displayName}
            width={80}
            height={80}
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-[#7c6fe0]">
            {displayName?.[0]?.toUpperCase() ?? 'B'}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-lg font-bold text-white truncate">{displayName}</p>
        {(user as UpdatePersonalInfoPayload)?.websiteUrl && (
          <p className="flex items-center gap-1 text-xs text-white/60 mt-0.5">
            <Globe size={11} />
            {(user as UpdatePersonalInfoPayload).websiteUrl}
          </p>
        )}
        {location && (
          <p className="flex items-center gap-1 text-xs text-white/60 mt-0.5">
            <MapPin size={11} />
            {location}
          </p>
        )}
      </div>

      {/* Edit profile */}
      <button
        onClick={onEditProfile}
        className="absolute bottom-4 cursor-pointer right-4 flex items-center gap-1.5 text-xs font-medium text-[#1a1a2e] bg-white px-3 py-1.5 rounded-lg hover:bg-white/90 transition-colors shrink-0"
      >
        <Pencil size={12} />
        Edit profile
      </button>
    </div>
  );
}
