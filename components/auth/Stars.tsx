'use client';
import StarIcon from '@/shared/SingleStar';
import React from 'react';

export default function Stars() {
  return (
    <>
      <StarIcon size={14} className="absolute top-[18px] right-[88px] text-[#f0b8d0] opacity-80" />
      <StarIcon size={10} className="absolute top-[52px] right-[148px] text-[#f0b8d0] opacity-60" />
      <StarIcon size={18} className="absolute top-[44px] right-[56px] text-[#e8789c] opacity-90" />
      <StarIcon size={22} className="absolute top-[76px] right-[20px] text-[#e8789c]" />
      <StarIcon
        size={12}
        className="absolute top-[108px] right-[120px] text-[#f0b8d0] opacity-70"
      />
      <StarIcon size={10} className="absolute top-[136px] right-[60px] text-[#f0b8d0] opacity-50" />
      {/* Bottom-center single star */}
      <StarIcon
        size={12}
        className="absolute bottom-[16px] left-1/2 -translate-x-1/2 text-[#f0b8d0] opacity-60"
      />
    </>
  );
}
