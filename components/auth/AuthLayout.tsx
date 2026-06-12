import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface AuthLayoutProps {
  imageSrc: string;
  imageAlt: string;
  headlineTop: string;
  headlineBottom: string;
  tagline: string;
  slideIndex?: number;
  children: React.ReactNode;
}

const SLIDES = 3;

/* Reusable 4-pointed sparkle star — the ONLY decorative shape used */
function Star({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 0C12 6.6 6.6 12 0 12C6.6 12 12 17.4 12 24C12 17.4 17.4 12 24 12C17.4 12 12 6.6 12 0Z"
        fill="#e8a0bf"
      />
    </svg>
  );
}

export default function AuthLayout({
  imageSrc,
  imageAlt,
  headlineTop,
  headlineBottom,
  tagline,
  slideIndex = 0,
  children,
}: AuthLayoutProps) {
  return (
    /* Outer wrapper — lavender background; all stars are positioned here */
    <div className="relative flex overflow-hidden h-screen bg-background">
      {/* ── Star cluster — top-right of the lavender background ── */}
      <div className="absolute inset-0 pointer-events-none select-none hidden lg:block">
        {/* 1. Large star — most prominent, upper-right */}
        <Star className="absolute top-10 right-16 w-8 h-8" />
        {/* 2. Medium star — upper area, left of large */}
        <Star className="absolute top-5 right-28 w-6 h-6" />
        {/* 3. Small star — right of large, slightly lower */}
        <Star className="absolute top-16 right-8 w-4 h-4" />
        {/* 4. Tiny star — far upper right */}
        <Star className="absolute top-3 right-10 w-3 h-3" />
        {/* 5. Small star — below medium, left side of cluster */}
        <Star className="absolute top-24 right-32 w-4 h-4" />
        {/* 6. Tiny star — lower right of cluster */}
        <Star className="absolute top-32 right-10 w-3 h-3" />
        {/* 7. Tiny star — bottom centre of full viewport */}
        <Star className="absolute bottom-5 left-1/2 -translate-x-1/2 w-3 h-3" />
      </div>

      {/* ── Left panel (~35% width) ── */}
      <aside className="hidden md:flex w-[35%] shrink-0 flex-col justify-between overflow-hidden relative py-10 px-8 bg-background">
        {/* Logo */}
        <Link href="/" className="z-10">
          <Image src="/images/logo.svg" alt="Trendupp logo" width={120} height={38} />
        </Link>

        {/* Hero image — centered within the sidebar padding */}
        <div className="relative w-full flex-1 my-6" style={{ minHeight: 0 }}>
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-contain object-center"
            priority
          />
        </div>

        {/* Bottom copy */}
        <div className="z-10 shrink-0">
          <h2 className="text-[30px] font-bold leading-tight text-primary mb-2">
            {headlineTop}
            <br />
            <span className="text-brand-pink">{headlineBottom}</span>
          </h2>
          <p className="text-[13px] text-[#5a5a7a] leading-relaxed mb-5 font-light max-w-[300px]">
            {tagline}
          </p>

          {/* Slide dots */}
          <div className="flex items-center gap-1.5" aria-hidden="true">
            {Array.from({ length: SLIDES }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  'h-[6px] rounded-full transition-all duration-200',
                  i === slideIndex ? 'w-7 bg-brand-pink' : 'w-[6px] bg-[#c8c6d9]',
                )}
              />
            ))}
          </div>
        </div>
      </aside>

      {/* ── Right panel — white rounded card ── */}
      <main className="flex-1 auth-scrollbar overflow-y-auto bg-white m-4 rounded-[28px]">
        <div className="min-h-full flex items-center justify-center px-10 py-10">{children}</div>
      </main>
    </div>
  );
}
