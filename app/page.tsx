'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

/**
 * Public homepage.
 *
 * Deliberately visible WITHOUT login (Google OAuth app-verification homepage
 * requirements): it identifies the Trendupp brand, describes what the app
 * does, explains why we request Google user data, and links to the privacy
 * policy. Signed-in users are forwarded to their dashboard.
 */
export default function Home() {
  const router = useRouter();
  const { user, accessToken, hasHydrated } = useAuthStore();

  useEffect(() => {
    if (!hasHydrated) return;
    if (accessToken && user && user.isEmailVerified) {
      router.replace(user.role === 'creator' ? '/creator/dashboard' : '/brand/dashboard');
    }
  }, [accessToken, user, router, hasHydrated]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1a1a2e]">
      {/* Header */}
      <header className="w-full border-b border-[#f0f0f5]">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-extrabold tracking-tight">
            Trend<span className="text-brand-pink">upp</span>
          </span>
          <nav className="flex items-center gap-4 text-sm font-semibold">
            <Link href="/privacy" className="text-[#5a5a7a] hover:text-[#1a1a2e]">
              Privacy
            </Link>
            <Link href="/terms" className="text-[#5a5a7a] hover:text-[#1a1a2e]">
              Terms
            </Link>
            <Link
              href="/signin"
              className="px-4 py-2 rounded-xl bg-brand-pink text-white hover:bg-brand-pink/90 transition-colors"
            >
              Sign in
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-5xl mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
            Where African brands and creators
            <br className="hidden sm:block" /> run campaigns{' '}
            <span className="text-brand-pink">together</span>
          </h1>
          <p className="mt-5 max-w-2xl mx-auto text-base text-[#5a5a7a] leading-relaxed">
            Trendupp is an influencer-marketing platform. Brands publish paid content campaigns;
            creators apply, produce and post the content on their social channels; and Trendupp
            handles the workflow in between — applications, content review, escrow-protected
            payments and payouts.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              href="/user-type"
              className="px-6 py-3 rounded-xl bg-brand-pink text-white text-sm font-bold hover:bg-brand-pink/90 transition-colors"
            >
              Get started
            </Link>
            <Link
              href="/signin"
              className="px-6 py-3 rounded-xl border border-[#e6e6ec] text-sm font-bold text-[#1a1a2e] hover:bg-[#faf9fc] transition-colors"
            >
              Sign in
            </Link>
          </div>
        </section>

        {/* What the app does */}
        <section className="bg-[#faf9fc] border-y border-[#f0f0f5]">
          <div className="max-w-5xl mx-auto px-6 py-14 grid gap-8 sm:grid-cols-3">
            {[
              {
                title: 'For brands',
                body: 'Create a campaign brief, set a budget and fund it into escrow. Review creator applications, approve content drafts, and only release payment when the post is live.',
              },
              {
                title: 'For creators',
                body: 'Connect your Instagram, TikTok, YouTube, X or Facebook account to verify your audience, apply to campaigns that match your niche and tier, submit content and get paid on approval.',
              },
              {
                title: 'Protected payments',
                body: 'Campaign budgets are held in escrow. Creators are paid automatically when their live post is approved; unused budget is refunded to the brand.',
              },
            ].map((f) => (
              <div key={f.title}>
                <h2 className="text-sm font-extrabold uppercase tracking-wider text-brand-pink">
                  {f.title}
                </h2>
                <p className="mt-2.5 text-sm text-[#5a5a7a] leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Google user data transparency */}
        <section className="max-w-5xl mx-auto px-6 py-14">
          <h2 className="text-2xl font-extrabold">How Trendupp uses Google user data</h2>
          <div className="mt-4 flex flex-col gap-4 text-sm text-[#5a5a7a] leading-relaxed max-w-3xl">
            <p>
              <strong className="text-[#1a1a2e]">Sign in with Google</strong> — if you choose to
              sign in with Google, we receive your name, email address and profile picture to create
              and secure your Trendupp account. We use this information for authentication only.
            </p>
            <p>
              <strong className="text-[#1a1a2e]">YouTube channel verification</strong> — creators
              can optionally connect their YouTube account. We request read-only access
              (youtube.readonly) solely to read your channel name and subscriber count, which we use
              to verify your audience size and assign your creator tier. We do not read, modify or
              manage your videos, comments or any other channel data, and we never post on your
              behalf.
            </p>
            <p>
              We do not sell Google user data or share it with third parties for advertising.
              Trendupp&apos;s use and transfer of information received from Google APIs adheres to
              the{' '}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                target="_blank"
                rel="noreferrer"
                className="text-brand-pink font-semibold hover:underline"
              >
                Google API Services User Data Policy
              </a>
              , including the Limited Use requirements. You can disconnect Google or YouTube at any
              time from your Trendupp profile, or revoke access from your{' '}
              <a
                href="https://myaccount.google.com/permissions"
                target="_blank"
                rel="noreferrer"
                className="text-brand-pink font-semibold hover:underline"
              >
                Google security settings
              </a>
              . Full details are in our{' '}
              <Link href="/privacy" className="text-brand-pink font-semibold hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#f0f0f5]">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#9a99b0]">
          <span>© {new Date().getFullYear()} Trendupp. All rights reserved.</span>
          <nav className="flex items-center gap-4 font-semibold">
            <Link href="/privacy" className="hover:text-[#1a1a2e]">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#1a1a2e]">
              Terms of Service
            </Link>
            <a href="mailto:support@trendupp.com" className="hover:text-[#1a1a2e]">
              support@trendupp.com
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
