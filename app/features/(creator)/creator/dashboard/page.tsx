'use client';
import React from 'react';
import { useAuthStore } from '@/store/authStore';

const CreatorDashboard = () => {
  const user = useAuthStore((s) => s?.user);
  console.log('User Data', user);
  return <div>Creator Dashboard</div>;
};

export default CreatorDashboard;
