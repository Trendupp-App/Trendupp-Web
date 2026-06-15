'use client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
export default function Home() {
  const router = useRouter();
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-background font-sans dark:bg-black">
      <h1>Home Page or Landing page</h1>
      <Button onClick={() => router.push('/features/user-type')}>register</Button>
    </div>
  );
}
