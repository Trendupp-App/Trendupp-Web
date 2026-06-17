'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';

export default function Home() {
  const router = useRouter();
  const { user, accessToken } = useAuthStore();

  useEffect(() => {
    if (accessToken && user) {
      router.replace(
        user.role === 'creator' ? '/features/creator/dashboard' : '/features/brand/dashboard',
      );
    }
  }, [accessToken, user, router]);

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-background font-sans dark:bg-black">
      <h1>Home Page or Landing page</h1>
      <Button onClick={() => router.push('/features/user-type')}>register</Button>
    </div>
  );
}
