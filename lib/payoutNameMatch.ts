import type { AuthUser } from '@/store/authStore';

// Company-registration noise that banks append to business account names
const BUSINESS_SUFFIXES = new Set([
  'ltd',
  'limited',
  'plc',
  'inc',
  'llc',
  'co',
  'company',
  'nig',
  'nigeria',
  'enterprise',
  'enterprises',
  'ventures',
  'global',
  'services',
  'the',
  'and',
]);

function tokens(name: string): string[] {
  return name
    .toLowerCase()
    .replace(/&/g, ' ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

// "tech" should match "technologies" (and vice versa) — banks abbreviate business names
function tokenMatches(expected: string, accountTokens: string[]): boolean {
  return accountTokens.some(
    (t) =>
      t === expected ||
      (expected.length >= 3 && t.startsWith(expected)) ||
      (t.length >= 3 && expected.startsWith(t)),
  );
}

export interface PayoutNameTarget {
  /** What the account name must match, for display in error messages */
  label: string;
  /** Words that must all appear in the account name */
  requiredTokens: string[];
  kind: 'person' | 'brand';
}

/**
 * Creators must use an account in their own name (first + last); brands an account in
 * their brand name. Returns null when the profile has no name to compare against.
 */
export function getPayoutNameTarget(user: AuthUser | null | undefined): PayoutNameTarget | null {
  if (!user) return null;

  if (user.role === 'brand') {
    const brandName = user.username?.trim() ?? '';
    const required = tokens(brandName).filter((t) => !BUSINESS_SUFFIXES.has(t));
    return required.length ? { label: brandName, requiredTokens: required, kind: 'brand' } : null;
  }

  const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();
  const required = tokens(fullName);
  return required.length ? { label: fullName, requiredTokens: required, kind: 'person' } : null;
}

/**
 * Case-insensitive, order-independent, tolerant of extra (middle) names and company
 * suffixes. Note this checks the name the user typed — it stops honest mistakes, but only
 * a backend bank name-enquiry can prove who actually owns the account.
 */
export function accountNameMatches(accountName: string, target: PayoutNameTarget): boolean {
  const accountTokens = tokens(accountName);
  return target.requiredTokens.every((t) => tokenMatches(t, accountTokens));
}

export function payoutNameMismatchMessage(accountName: string, target: PayoutNameTarget): string {
  return target.kind === 'brand'
    ? `"${accountName.trim()}" doesn't match your brand name "${target.label}". Use a bank account registered to your brand.`
    : `"${accountName.trim()}" doesn't match your profile name "${target.label}". Use a bank account registered in your name.`;
}
