'use client';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { SLIDE_DATA } from '@/constants/slide';
import Stars from './Stars';
import { AnimatePresence, motion } from 'motion/react';

interface AuthLayoutProps {
  imageSrc: string;
  imageAlt: string;
  headlineTop: string;
  headlineBottom: string;
  tagline: string;
  slideIndex?: number;
  children: React.ReactNode;
}

const slideVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 24 : -24,
    y: 12,
  }),
  center: {
    opacity: 1,
    x: 0,
    y: 0,
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -24 : 24,
    y: -12,
  }),
};

export default function AuthLayout({ slideIndex = 0, children }: AuthLayoutProps) {
  const [activeSlide, setActiveSlide] = useState(slideIndex);
  const direction = 1;
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDE_DATA.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  const slide = SLIDE_DATA[activeSlide];

  return (
    <div className="flex  h-screen bg-background">
      {/* ── Left panel ── */}
      <aside className="hidden md:flex w-[500px] shrink-0 flex-col overflow-hidden relative px-7 py-6">
        {/* Logo */}
        <Link href="/" className="z-10 ml-8">
          <Image src="/logo.svg" alt="Trendupp logo" width={100} height={32} />
        </Link>

        {/* Hero image — crossfades between slides */}
        <div className="relative -ml-6 h-[60vh] mt-4 w-full">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={slide.src}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className={cn('absolute inset-0', slide.imageClassName)}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                className="object-contain object-bottom"
                priority
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom copy — fades between slides */}
        <div className="z-10 mt-8 ml-8">
          <div className="relative h-24 overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={slide.src}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <h2 className="text-[26px] font-extralight leading-tight text-[#1a1a2e] mb-2">
                  {slide.headlineTop}
                  <br />
                  <span className="text-[#d91a6b]">{slide.headlineBottom}</span>
                </h2>
                <p className="text-[13px] text-[#5a5a7a] leading-relaxed max-w-72">
                  {slide.tagline}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Slide dots */}
          <div className="flex items-center gap-1.5 mt-5" aria-hidden="true">
            {SLIDE_DATA.map((_, i) => (
              <motion.span
                key={i}
                layout
                className={cn(
                  'h-2 rounded-full',
                  i === activeSlide ? 'bg-[#d91a6b]' : 'bg-[#c8c6d9]',
                )}
                animate={{ width: i === activeSlide ? 20 : 8 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
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
