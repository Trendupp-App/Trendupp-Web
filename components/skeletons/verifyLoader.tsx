'use client';

interface LoaderProps {
  header: string;
  subheader: string;
}

export default function VerifyLoader({ header, subheader }: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="relative w-20 h-20">
        <svg
          className="absolute inset-0 animate-spin"
          style={{ animationDuration: '1.4s' }}
          viewBox="0 0 80 80"
          fill="none"
        >
          <circle
            cx="40"
            cy="40"
            r="34"
            stroke="#e8734a"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="60 155"
          />
        </svg>
        <svg className="absolute inset-0" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="34" stroke="#fce9df" strokeWidth="3" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-brand-pink animate-pulse" />
        </div>
      </div>
      <div className="flex flex-col items-center gap-1">
        <p className="text-[15px] font-extralight text-[#1a1a2e]">{header}</p>
        <p className="text-xs font-light text-text-secondary">{subheader}</p>
      </div>
    </div>
  );
}
