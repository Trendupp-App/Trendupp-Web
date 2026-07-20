import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import QueryProvider from '@/lib/providers/QueryProvider';

const slussen = localFont({
  src: [
    {
      path: './fonts/Slussen-Regular-TRIAL.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/Slussen-Bold-TRIAL.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fonts/Slussen-Regular-Italic-TRIAL.otf',
      weight: '400',
      style: 'italic',
    },
  ],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Trendupp',
    template: '%s | Trendupp',
  },
  description:
    'Trendupp connects creators with brands for paid campaigns. Discover opportunities, apply, and earn — all in one place.',
  icons: {
    icon: '/Option.png',
  },
  openGraph: {
    title: 'Trendupp — The Creator Marketing Platform',
    description:
      'Trendupp connects creators with brands for paid campaigns. Discover opportunities, apply, and earn — all in one place.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Trendupp',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn('h-full', 'antialiased', slussen.variable, 'font-sans')}>
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <TooltipProvider delayDuration={200}>
            {children}
            <Toaster richColors />
          </TooltipProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
