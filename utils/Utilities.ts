function abbreviateFollowerCount(n: number): string {
  if (n >= 1_000_000) return `${Math.round(n / 1_000_000)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return `${n}`;
}

// Tier bands are contiguous (a tier's maxFollowers + 1 is the next tier's
// minFollowers), so the upper bound is shown as that round next-tier value
// (e.g. 9,999 -> "10K") rather than the raw inclusive max.
export function formatTierFollowerRange(min: number, max: number | null) {
  if (max === null) return `${abbreviateFollowerCount(min)}+`;
  return `${abbreviateFollowerCount(min)}-${abbreviateFollowerCount(max + 1)}`;
}

export function formatMinCostLabel(minCostNaira: number) {
  return `Minimum ${minCostNaira.toLocaleString('en-US')} naira`;
}

export function formatMinCostUsdLabel(minCostUsd: number) {
  return `Minimum $${minCostUsd.toLocaleString('en-US')}`;
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} hour${diffHour === 1 ? '' : 's'} ago`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `${diffDay} day${diffDay === 1 ? '' : 's'} ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  NGN: '₦',
  GBP: '£',
  EUR: '€',
};

export function formatCurrency(amount: number, currency = 'USD'): string {
  const symbol = CURRENCY_SYMBOLS[currency.toUpperCase()] ?? `${currency.toUpperCase()} `;
  return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Compact form for tight spaces (e.g. "₦847K" instead of "₦847,000.00").
export function formatCompactCurrency(amount: number, currency = 'USD'): string {
  const symbol = CURRENCY_SYMBOLS[currency.toUpperCase()] ?? `${currency.toUpperCase()} `;
  const compact = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amount);
  return `${symbol}${compact}`;
}

// Converts a USD amount to NGN using a live rate (see hooks/useExchangeRate.ts).
// Kept as a pure function so the conversion math is testable independent of
// the fetch that supplies the rate.
export function convertUsdToNgn(amountUsd: number, usdToNgnRate: number): number {
  return Math.round(amountUsd * usdToNgnRate);
}

// General-purpose wrapper around convertUsdToNgn for money coming from an API
// in an arbitrary source currency (payout balances, transactions, escrow —
// anywhere the amount isn't already routed through campaignMappers). Mirrors
// the same displayInNgn/usdToNgnRate shape used across the app so call sites
// built on useDisplayCurrency() can pass its result straight through.
export function convertForDisplay(
  amount: number,
  sourceCurrency: string,
  opts: { displayInNgn?: boolean; usdToNgnRate?: number },
): { amount: number; currency: string } {
  const normalized = (sourceCurrency || 'NGN').toUpperCase();
  if (opts.displayInNgn && normalized === 'USD' && opts.usdToNgnRate) {
    return { amount: convertUsdToNgn(amount, opts.usdToNgnRate), currency: 'NGN' };
  }
  return { amount, currency: opts.displayInNgn ? 'NGN' : normalized };
}

// Strips everything but digits — use on the raw input value before storing
// in form state, so the stored value stays a plain numeric string.
export function stripNonDigits(value: string): string {
  return value.replace(/[^\d]/g, '');
}

// Comma-formats a plain digit string for display (e.g. "1000000" -> "1,000,000").
export function formatNumberWithCommas(value: string): string {
  if (!value) return '';
  const num = Number(value);
  return Number.isNaN(num) ? '' : num.toLocaleString('en-US');
}

// Backend-submitted links (draft/live content URLs) aren't guaranteed to include
// a protocol. Without one, an <a href> treats the value as relative to the
// current page instead of navigating out — this normalizes it so clicks work.
export function ensureHttpUrl(url: string): string {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

export function estimateReadTime(html: string): string {
  const words = html
    .replace(/<[^>]*>/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}
