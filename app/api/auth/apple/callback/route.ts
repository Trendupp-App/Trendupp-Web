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

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const params = new URLSearchParams();
  for (const key of FORWARDED_KEYS) {
    const value = form.get(key);
    if (typeof value === 'string' && value) params.set(key, value);
  }
  return NextResponse.redirect(
    new URL(`/auth/callback/apple#${params.toString()}`, request.url),
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
    new URL(`/auth/callback/apple#${params.toString()}`, request.url),
    303,
  );
}
