import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '404 — Page Not Found',
};

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <p className="text-6xl font-bold text-brand-pink">404</p>
      <h1 className="text-2xl font-semibold text-primary">Page not found</h1>
      <p className="max-w-sm text-sm font-light text-[#7a7a9a]">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-xl bg-brand-pink px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        Back to home
      </Link>
    </div>
  );
}
