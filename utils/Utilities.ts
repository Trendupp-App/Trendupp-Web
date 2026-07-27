export function formatFollowerRange(min: number, max: number | null) {
  const fmt = (n: number) => n.toLocaleString();
  if (max === null) return `${fmt(min)}+ followers`;
  return `${fmt(min)} - ${fmt(max)} followers`;
}

export function formatTierLabel(name: string, min: number, max: number | null) {
  return `${name} (${formatFollowerRange(min, max)})`;
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

export function estimateReadTime(html: string): string {
  const words = html
    .replace(/<[^>]*>/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}
