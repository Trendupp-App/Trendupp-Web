'use client';

import Image from 'next/image';
import { UserRound } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  avatarUrl?: string | null;
  initials?: string;
  className?: string;
  size?: number;
}

export default function UserAvatar({ avatarUrl, initials, className, size = 36 }: UserAvatarProps) {
  const [imgError, setImgError] = useState(false);

  const showImage = avatarUrl && !imgError;

  return (
    <div
      className={cn(
        'relative rounded-full overflow-hidden bg-brand-pink-light border border-brand-pink/20 flex items-center justify-center text-brand-pink font-semibold shrink-0',
        className,
      )}
      style={{ width: size, height: size }}
    >
      {showImage ? (
        <Image
          src={avatarUrl}
          alt="User avatar"
          fill
          className="object-cover"
          onError={() => setImgError(true)}
        />
      ) : initials ? (
        <span style={{ fontSize: size * 0.35 }}>{initials}</span>
      ) : (
        <UserRound size={size * 0.5} className="text-brand-pink" />
      )}
    </div>
  );
}
