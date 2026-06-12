import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Geist, Geist_Mono } from 'next/font/google';
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

// const geistSans = Geist({
//   variable: '--font-geist-sans',
//   subsets: ['latin'],
// });

// const geistMono = Geist_Mono({
//   variable: '--font-geist-mono',
//   subsets: ['latin'],
// });

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
    <html
      lang="en"
      className={cn(
        'h-full',
        'antialiased',
        slussen.variable,
        // geistSans.variable,
        // geistMono.variable,
        'font-sans',
      )}
    >
      <body className="min-h-full overflow-hidden flex flex-col">{children}</body>
    </html>
  );
}
