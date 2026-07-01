'use client';

import { useRouter } from 'next/navigation';

interface ProfileCompletenessCardProps {
  percentage: number;
  stepsCompleted: number;
  totalSteps?: number;
}

export default function ProfileCompletenessCard({
  percentage,
  stepsCompleted,
  totalSteps = 5,
}: ProfileCompletenessCardProps) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-2xl border border-[#f0eef8] p-6 flex flex-col gap-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-[#1a1a2e]">
          Your profile is {percentage}% complete
        </h3>
        <span className="text-xs text-[#7a7a9a] font-medium">
          {stepsCompleted}/{totalSteps} steps done
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-[#f0eef8] rounded-full overflow-hidden">
        <div
          className="h-full bg-green-500 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="text-sm text-[#7a7a9a]">
        Complete your profile to start creating for campaigns
      </p>

      <button
        onClick={() => router.push('/onboard')}
        className="w-fit px-5 py-2.5 cursor-pointer rounded-xl border border-[#e0ddef] text-sm font-medium text-[#1a1a2e] hover:bg-[#faf9fc] transition-colors"
      >
        Complete profile
      </button>
    </div>
  );
}
