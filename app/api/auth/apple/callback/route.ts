import { NextRequest, NextResponse } from 'next/server';

/**
 * Sign in with Apple return URL.
 *
 * Apple requires `response_mode=form_post` whenever the `name` or `email`
 * scope is requested, so the authorize flow cannot land directly on a client
 * page. This handler receives Apple's cross-site POST and re-emits the values
 * as a URL *fragment* on the client callback page — fragments never reach
 * server logs, matching the security profile of the fragment flow.
 */

const FORWARDED_KEYS = ['id_token', 'code', 'state', 'user', 'error'] as const;

/**
 * Absolute origin to redirect back to.
 *
 * `request.url` is unreliable here: on AWS the Next server runs inside Lambda
 * behind CloudFront, so the incoming URL arrives as the internal address
 * (http://localhost:3000/...) and redirecting against it sends the browser to
 * localhost. Vercel rewrites it to the public URL, which is why this only
 * broke in production. Prefer the configured public origin, then the
 * proxy-forwarded host, and only fall back to request.url for local dev.
 */
function resolveOrigin(request: NextRequest): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL;
  if (configured) return configured.replace(/\/$/, '');

  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  if (host) {
    const proto = request.headers.get('x-forwarded-proto') ?? 'https';
    return `${proto}://${host}`;
  }

  return new URL(request.url).origin;
}

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const params = new URLSearchParams();
  for (const key of FORWARDED_KEYS) {
    const value = form.get(key);
    if (typeof value === 'string' && value) params.set(key, value);
  }
  return NextResponse.redirect(
    new URL(`/auth/callback/apple#${params.toString()}`, resolveOrigin(request)),
    303,
  );
}

/** Safety net: surface stray GET landings (e.g. manual reload) to the same page. */
export function GET(request: NextRequest) {
  const search = new URL(request.url).searchParams;
  const params = new URLSearchParams();
  for (const key of FORWARDED_KEYS) {
    const value = search.get(key);
    if (value) params.set(key, value);
  }
  return NextResponse.redirect(
    new URL(`/auth/callback/apple#${params.toString()}`, resolveOrigin(request)),
    303,
  );
}
