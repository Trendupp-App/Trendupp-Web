import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Data Deletion — Trendupp',
  description:
    'How to request deletion of your Trendupp data, and check the status of a deletion request.',
};

interface DeletionStatus {
  confirmationCode?: string;
  platform?: string;
  status?: string;
  details?: string | null;
  requestedAt?: string;
}

const STATUS_COPY: Record<string, string> = {
  completed: 'Completed — the data we received from this platform has been deleted.',
  no_data: 'No matching Trendupp account was found, so there was no data to delete.',
  failed: 'This request could not be completed automatically. Please contact support.',
  not_found: 'We could not find a deletion request with that confirmation code.',
};

async function fetchStatus(code: string): Promise<DeletionStatus | null> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) return null;
  try {
    const res = await fetch(`${base}/webhooks/meta/data-deletion/${encodeURIComponent(code)}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return (await res.json()) as DeletionStatus;
  } catch {
    return null;
  }
}

export default async function DataDeletionPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;
  const status = code ? await fetchStatus(code) : null;

  return (
    <div className="min-h-screen bg-white text-[#1a1a2e]">
      <header className="w-full border-b border-[#f0f0f5]">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-extrabold tracking-tight">
            Trend<span className="text-brand-pink">upp</span>
          </Link>
          <Link
            href="/privacy"
            className="text-sm font-semibold text-[#5a5a7a] hover:text-[#1a1a2e]"
          >
            Privacy Policy
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12 flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-extrabold">Data Deletion</h1>
          <p className="mt-2 text-sm text-[#5a5a7a] leading-relaxed">
            You can delete your Trendupp data at any time. This page also reports the status of
            deletion requests started from Facebook or Instagram.
          </p>
        </div>

        {code && (
          <section className="border border-[#e8e6f0] rounded-2xl p-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-brand-pink">
              Request status
            </h2>
            <dl className="mt-3 flex flex-col gap-2 text-sm">
              <div className="flex gap-2">
                <dt className="text-[#9a99b0] w-36 shrink-0">Confirmation code</dt>
                <dd className="font-mono text-xs break-all">{code}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-[#9a99b0] w-36 shrink-0">Status</dt>
                <dd className="font-semibold">
                  {STATUS_COPY[status?.status ?? 'not_found'] ?? status?.status}
                </dd>
              </div>
              {status?.platform && (
                <div className="flex gap-2">
                  <dt className="text-[#9a99b0] w-36 shrink-0">Platform</dt>
                  <dd className="capitalize">{status.platform}</dd>
                </div>
              )}
              {status?.requestedAt && (
                <div className="flex gap-2">
                  <dt className="text-[#9a99b0] w-36 shrink-0">Requested</dt>
                  <dd>{new Date(status.requestedAt).toLocaleString()}</dd>
                </div>
              )}
            </dl>
          </section>
        )}

        <section className="flex flex-col gap-3 text-sm text-[#5a5a7a] leading-relaxed">
          <h2 className="text-base font-bold text-[#1a1a2e]">Delete a connected social account</h2>
          <p>
            In the Trendupp app, open <strong className="text-[#1a1a2e]">Profile → Socials</strong>{' '}
            and disconnect the platform. We immediately delete the data we received from it — the
            profile handle, follower/subscriber count and access tokens.
          </p>
          <p>
            You can also remove Trendupp from{' '}
            <a
              href="https://accounts.google.com/permissions"
              target="_blank"
              rel="noreferrer"
              className="text-brand-pink font-semibold hover:underline"
            >
              Google
            </a>
            , or from your Facebook/Instagram settings (Settings → Apps and websites) — we receive
            the removal automatically and delete the corresponding data.
          </p>
        </section>

        <section className="flex flex-col gap-3 text-sm text-[#5a5a7a] leading-relaxed">
          <h2 className="text-base font-bold text-[#1a1a2e]">Delete your whole account</h2>
          <p>
            Open <strong className="text-[#1a1a2e]">Settings → Deactivate account</strong> in the
            app. Your personal data is deleted after a 30-day grace period, except records we are
            legally required to retain (for example, payment records for tax purposes).
          </p>
          <p>
            Prefer email? Write to{' '}
            <a
              href="mailto:support@trendupp.com"
              className="text-brand-pink font-semibold hover:underline"
            >
              support@trendupp.com
            </a>{' '}
            from your registered address and we will action it within 30 days.
          </p>
        </section>
      </main>

      <footer className="border-t border-[#f0f0f5]">
        <div className="max-w-3xl mx-auto px-6 py-8 text-xs text-[#9a99b0]">
          © {new Date().getFullYear()} Trendupp. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
