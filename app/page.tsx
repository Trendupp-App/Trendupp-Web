'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function Home() {
  const router = useRouter();
  const { user, accessToken } = useAuthStore();

  useEffect(() => {
    if (accessToken && user && user.isEmailVerified) {
      router.replace(
        user.role === 'creator' ? '/features/creator/dashboard' : '/features/brand/dashboard',
      );
    } else {
      router.replace('/features/user-type');
    }
  }, [accessToken, user, router]);

  return null;
}
