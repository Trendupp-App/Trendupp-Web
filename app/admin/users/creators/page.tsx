'use client';

import CreatorStats from '@/components/admin/creators/CreatorStats';
import CreatorTiers from '@/components/admin/creators/CreatorTiers';
import CreatorTable from '@/components/admin/creators/CreatorTable';

export default function CreatorManagementPage() {
  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      <div>
        <h1 className="text-xl font-semibold text-[#1a1a2e]">Creator Management</h1>
        <p className="text-xs text-[#7a7a9a] mt-0.5">
          Manage and monitor all creators on the platform
        </p>
      </div>

      {/* 4 Stats Cards */}
      <CreatorStats />

      {/* Creator Tier Distribution Card */}
      <CreatorTiers />

      {/* Creators Table Card */}
      <CreatorTable />
    </div>
  );
}
