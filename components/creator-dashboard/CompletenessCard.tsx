'use client';

interface CompletenessCardProps {
  percentage?: number;
  onCompleteClick?: () => void;
}

export default function CompletenessCard({
  percentage = 20,
  onCompleteClick,
}: CompletenessCardProps) {
  return (
    <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 text-[#1a1a2e] flex flex-col justify-between h-[256px] hover:shadow-[0_8px_30px_rgba(4,0,57,0.05)] transition-all duration-300">
      <div className="flex flex-col gap-3.5">
        {/* Title */}
        <h3 className="text-base sm:text-lg lg:text-xl font-bold text-[#1a1a2e] leading-snug">
          You profile is {percentage}% complete
        </h3>

        {/* Custom Progress Bar */}
        <div className="w-full h-2 bg-[#f0eff5] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#00c37b] rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Subtext */}
        <p className="text-xs sm:text-sm lg:text-base text-[#7a7a9a] font-light leading-relaxed mt-0.5">
          Complete your profile to start applying for campaigns
        </p>
      </div>

      {/* Action button */}
      <button
        onClick={onCompleteClick}
        className="w-fit bg-[#f4f3ff] hover:bg-[#eae9ff] text-[#4c49d8] font-bold text-xs sm:text-sm py-2.5 px-6 rounded-xl transition-all duration-200 active:scale-[0.98]"
      >
        Complete profile
      </button>
    </div>
  );
}
