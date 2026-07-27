import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy — Trendupp',
  description:
    'How Trendupp collects, uses and protects your data, including data received from Google, Facebook, Instagram, TikTok and X.',
};

const SECTIONS: { title: string; body: React.ReactNode }[] = [
  {
    title: '1. Who we are',
    body: (
      <p>
        Trendupp (&ldquo;we&rdquo;, &ldquo;us&rdquo;) operates an influencer-marketing platform at
        app.trendupp.com and through the Trendupp mobile apps, connecting brands
        (&ldquo;advertisers&rdquo;) with content creators for paid social-media campaigns. This
        policy explains what data we collect, why, and the choices you have. Questions:{' '}
        <a href="mailto:support@trendupp.com" className="text-brand-pink hover:underline">
          support@trendupp.com
        </a>
        .
      </p>
    ),
  },
  {
    title: '2. Data we collect',
    body: (
      <ul className="list-disc pl-5 flex flex-col gap-1.5">
        <li>
          <strong>Account data</strong> — name, email address, username, password (stored hashed),
          phone number, country, profile photo, and for creators: niche, gender and date of birth
          where provided.
        </li>
        <li>
          <strong>Social account data</strong> — when you connect a social account (Instagram,
          TikTok, YouTube, X/Twitter, Facebook) we store your public username/handle and
          follower/subscriber count to verify your audience and assign your creator tier.
        </li>
        <li>
          <strong>Payment data</strong> — bank account details for creator payouts, and campaign
          payment records. Card payments are processed by our escrow/payment provider; we do not
          store card numbers.
        </li>
        <li>
          <strong>Campaign content</strong> — briefs, applications, submitted drafts and live post
          links exchanged between brands and creators on the platform.
        </li>
        <li>
          <strong>Usage & device data</strong> — log data, device identifiers and push tokens (for
          notifications), and crash/analytics data used to keep the service reliable.
        </li>
      </ul>
    ),
  },
  {
    title: '3. Google user data',
    body: (
      <div className="flex flex-col gap-3">
        <p>
          <strong>Sign in with Google:</strong> we receive your name, email address and profile
          picture from Google solely to create and authenticate your Trendupp account.
        </p>
        <p>
          <strong>YouTube:</strong> creators may optionally connect a YouTube account. We request
          the read-only scope (<code>youtube.readonly</code>) and use it solely to read your channel
          name and subscriber count for audience verification and creator-tier assignment. We do not
          access, modify or delete videos, comments, playlists or any other channel data, and we
          never act on your behalf. Trendupp uses YouTube API Services; by connecting YouTube you
          also agree to the{' '}
          <a
            href="https://www.youtube.com/t/terms"
            target="_blank"
            rel="noreferrer"
            className="text-brand-pink hover:underline"
          >
            YouTube Terms of Service
          </a>
          , and the{' '}
          <a
            href="http://www.google.com/policies/privacy"
            target="_blank"
            rel="noreferrer"
            className="text-brand-pink hover:underline"
          >
            Google Privacy Policy
          </a>{' '}
          applies to Google&apos;s handling of your data.
        </p>
        <p>
          Trendupp&apos;s use and transfer to any other app of information received from Google APIs
          will adhere to the{' '}
          <a
            href="https://developers.google.com/terms/api-services-user-data-policy"
            target="_blank"
            rel="noreferrer"
            className="text-brand-pink hover:underline"
          >
            Google API Services User Data Policy
          </a>
          , including the Limited Use requirements. Google user data is never sold, never used for
          advertising, and never read by humans except with your consent, for security, or where
          required by law.
        </p>
        <p>
          You can disconnect YouTube in your Trendupp profile (Profile → Socials) — we then stop
          refreshing your channel data — and revoke Trendupp&apos;s access entirely from your{' '}
          <a
            href="https://security.google.com/settings/security/permissions"
            target="_blank"
            rel="noreferrer"
            className="text-brand-pink hover:underline"
          >
            Google security settings
          </a>
          . Stored YouTube data (channel name and subscriber count) is deleted when you disconnect
          the account or delete your Trendupp account.
        </p>
      </div>
    ),
  },
  {
    title: '4. Data from other social platforms',
    body: (
      <p>
        Connecting Instagram, Facebook, TikTok or X works the same way: we request the minimal
        read-only permissions needed to confirm the account is yours and read your public profile
        name and follower count. We never post, message or otherwise act on your behalf on any
        platform. You can disconnect any platform from your profile at any time.
      </p>
    ),
  },
  {
    title: '5. How we use data',
    body: (
      <ul className="list-disc pl-5 flex flex-col gap-1.5">
        <li>Operate the platform: matching, applications, content review, messaging.</li>
        <li>Verify creator audiences and assign tiers.</li>
        <li>Process escrow payments, payouts and refunds, and prevent fraud.</li>
        <li>Send service notifications (in-app, email, push) — configurable in settings.</li>
        <li>Improve reliability via aggregate analytics and crash reporting.</li>
        <li>Comply with legal obligations.</li>
      </ul>
    ),
  },
  {
    title: '6. Sharing',
    body: (
      <p>
        We share data only with: the counterparty of your campaigns (a brand sees applying
        creators&apos; profiles; creators see campaign briefs), service providers that run the
        platform (cloud hosting, email delivery, push notifications, payment/escrow processing,
        customer support tooling), and authorities where legally required. We do not sell personal
        data, and we do not share Google user data with third parties for advertising or data-broker
        purposes.
      </p>
    ),
  },
  {
    title: '7. Retention & deletion',
    body: (
      <p>
        Account data is kept while your account is active. You can delete your account in Settings →
        Deactivate; after a 30-day grace period your personal data is deleted, except records we
        must keep for legal, tax or fraud-prevention purposes. Connected-platform data (including
        Google/YouTube data) is deleted when you disconnect the platform or delete your account.
      </p>
    ),
  },
  {
    title: '8. Security',
    body: (
      <p>
        Data is encrypted in transit (TLS) and at rest, access is role-restricted and audit logged,
        and payment operations run through an escrow provider. No system is perfectly secure; report
        concerns to{' '}
        <a href="mailto:support@trendupp.com" className="text-brand-pink hover:underline">
          support@trendupp.com
        </a>
        .
      </p>
    ),
  },
  {
    title: '9. Your rights',
    body: (
      <p>
        Depending on your jurisdiction (including under the Nigeria Data Protection Act and GDPR),
        you may request access, correction, export or deletion of your personal data, or object to
        certain processing. Contact{' '}
        <a href="mailto:support@trendupp.com" className="text-brand-pink hover:underline">
          support@trendupp.com
        </a>{' '}
        and we will respond within 30 days.
      </p>
    ),
  },
  {
    title: '10. Changes',
    body: (
      <p>
        We will post any changes to this policy on this page and, for material changes, notify you
        in-app or by email. Continued use after changes take effect constitutes acceptance.
      </p>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white text-[#1a1a2e]">
      <header className="w-full border-b border-[#f0f0f5]">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-extrabold tracking-tight">
            Trend<span className="text-brand-pink">upp</span>
          </Link>
          <Link href="/terms" className="text-sm font-semibold text-[#5a5a7a] hover:text-[#1a1a2e]">
            Terms of Service
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-extrabold">Privacy Policy</h1>
        <p className="mt-2 text-xs text-[#9a99b0] font-semibold">Last updated: July 26, 2026</p>

        <div className="mt-8 flex flex-col gap-8 text-sm text-[#5a5a7a] leading-relaxed">
          {SECTIONS.map((s) => (
            <section key={s.title}>
              <h2 className="text-base font-bold text-[#1a1a2e] mb-2">{s.title}</h2>
              {s.body}
            </section>
          ))}
        </div>
      </main>

      <footer className="border-t border-[#f0f0f5]">
        <div className="max-w-3xl mx-auto px-6 py-8 text-xs text-[#9a99b0]">
          © {new Date().getFullYear()} Trendupp. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
