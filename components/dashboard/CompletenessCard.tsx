'use client';

import { Button } from '@/components/ui/button';

interface CompletenessCardProps {
  percentage?: number;
  onCompleteClick?: () => void;
}

export default function CompletenessCard({
  percentage = 20,
  onCompleteClick,
}: CompletenessCardProps) {
  return (
    <div className="bg-[#030030] rounded-[24px] p-6 text-white flex flex-col justify-between h-[200px] hover:shadow-[0_8px_30px_rgba(4,0,57,0.12)] transition-all duration-300">
      <div className="flex flex-col gap-3.5">
        {/* Title */}
        <h3 className="text-[17px] font-light text-[#fbfaff] tracking-wide">
          You profile is {percentage}% complete
        </h3>

        {/* Custom Progress Bar */}
        <div className="w-full h-3 bg-[#13104c] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#00c37b] rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Subtext */}
        <p className="text-[13px] font-extralight text-[#c2c0eb] leading-relaxed mt-0.5">
          Add your username, bio and niche to get noticed by brands
        </p>
      </div>

      {/* Action button */}
      <Button
        onClick={onCompleteClick}
        className="w-fit bg-[#f4f3ff] hover:bg-[#eae9ff] text-[#4c49d8] font-medium text-sm py-2.5 px-6 rounded-xl h-11 self-start shadow-none border-none active:scale-[0.98] transition-transform"
      >
        Complete profile
      </Button>
    </div>
  );
}
