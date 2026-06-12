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
    <div className="flex overflow-hidden h-screen bg-background">
      {/* ── Left panel ── */}
      <aside className="hidden md:flex w-100 shrink-0 flex-col overflow-hidden relative px-7 py-6">
        {/* Logo */}
        <Link href="/" className="z-10 ml-8">
          <Image src="/logo.svg" alt="Trendupp logo" width={100} height={32} />
        </Link>

        {/* Hero image — fills the middle */}
        <div className="relative -ml-6 h-[60vh] w-full">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-contain object-bottom transition-transform duration-300"
            priority
          />
        </div>

        {/* Bottom copy */}
        <div className="z-10 ml-8">
          <h2 className="text-[26px] font-extralight leading-tight text-[#1a1a2e] mb-2">
            {headlineTop}
            <br />
            <span className="text-[#d91a6b]">{headlineBottom}</span>
          </h2>
          <p className="text-[13px] text-[#5a5a7a] leading-relaxed mb-5 max-w-72">{tagline}</p>

          {/* Slide dots */}
          <div className="flex items-center gap-1.5" aria-hidden="true">
            {Array.from({ length: SLIDES }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  'h-2 rounded-full transition-all duration-200',
                  i === slideIndex ? 'w-5 bg-[#d91a6b]' : 'w-2 bg-[#c8c6d9]',
                )}
              />
            ))}
          </div>
        </div>
      </aside>

      <main className="flex-1 auth-scrollbar overflow-y-auto bg-white m-4 rounded-xl px-6 py-5">
        <div className="min-h-full items-center justify-center flex flex-col">{children}</div>
      </main>
    </div>
  );
}
