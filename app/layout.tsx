import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { cn } from '@/lib/utils';

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
  title: 'Trendupp',
  description: 'Trendupp — The creator marketing platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn('h-full', 'antialiased', slussen.variable, 'font-sans')}>
      <body className="min-h-full overflow-hidden flex flex-col">{children}</body>
    </html>
  );
}
