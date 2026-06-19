'use client';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { SLIDE_DATA } from '@/constants/slide';
import Stars from './Stars';

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
  const [activeSlide, setActiveSlide] = useState(slideIndex);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDE_DATA.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="flex overflow-hidden h-screen bg-background">
      {/* ── Left panel ── */}
      <aside className="hidden md:flex w-[500px] shrink-0 flex-col overflow-hidden relative px-7 py-6">
        {/* Logo */}
        <Link href="/" className="z-10 ml-8">
          <Image src="/logo.svg" alt="Trendupp logo" width={100} height={32} />
        </Link>

        {/* Hero image — crossfades between slides */}
        <div className="relative -ml-6 h-[60vh] mt-4 w-full">
          {SLIDE_DATA.map((slide, i) => (
            <Image
              key={slide.src}
              src={slide.src}
              alt={slide.alt}
              fill
              className={cn(
                'object-contain object-bottom transition-opacity duration-700',
                i === activeSlide ? 'opacity-100' : 'opacity-0',
                slide.imageClassName,
              )}
              priority={i === 0}
            />
          ))}
        </div>

        {/* Bottom copy — fades between slides */}
        <div className="z-10 mt-8 ml-8">
          <div className="relative h-24 overflow-hidden">
            {SLIDE_DATA.map((slide, i) => (
              <div
                key={i}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  i === activeSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <h2 className="text-[26px] font-extralight leading-tight text-[#1a1a2e] mb-2">
                  {slide.headlineTop}
                  <br />
                  <span className="text-[#d91a6b]">{slide.headlineBottom}</span>
                </h2>
                <p className="text-[13px] text-[#5a5a7a] leading-relaxed max-w-72">
                  {slide.tagline}
                </p>
              </div>
            ))}
          </div>

          {/* Slide dots */}
          <div className="flex items-center gap-1.5 mt-5" aria-hidden="true">
            {SLIDE_DATA.map((_, i) => (
              <span
                key={i}
                className={cn(
                  'h-2 rounded-full transition-all duration-300',
                  i === activeSlide ? 'w-5 bg-[#d91a6b]' : 'w-2 bg-[#c8c6d9]',
                )}
              />
            ))}
          </div>
        </div>
      </aside>

      <main className="flex-1 relative auth-scrollbar overflow-y-auto bg-white m-4 rounded-xl px-6 py-5">
        <Stars />
        <div className="min-h-full items-center justify-center flex flex-col">{children}</div>
      </main>
    </div>
  );
}
