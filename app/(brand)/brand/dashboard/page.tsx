'use client';
import { useAuthStore } from '@/store/authStore';
import Image from 'next/image';

const BrandDashboardPage = () => {
  const user = useAuthStore((s) => s.user);
  console.log(user);
  return (
    <div>
      <div className="h-screen">
        <h1>Brand Dashboard</h1>
        <div className="flex flex-col gap-2">
          <div className="h-20 w-20">{/* <Image /> */}</div>
        </div>
      </div>
    </div>
  );
};

export default BrandDashboardPage;
