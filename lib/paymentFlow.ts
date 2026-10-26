const PENDING_KEY = 'campaign_payment_pending';

/**
 * 🧪 Switch for the in-app Startbutton transfer simulator on the campaign payment step.
 * Set to false to hide it everywhere. Even when true it only appears for sandbox checkouts
 * (see isSandboxCheckout), so a live Startbutton checkout never shows it.
 */
export const ENABLE_PAYMENT_SANDBOX_TOOLS = true;

/** True when the checkout link is Startbutton's sandbox rather than a live checkout */
export function isSandboxCheckout(paymentUrl: string | null | undefined): boolean {
  if (!paymentUrl) return false;
  try {
    return new URL(paymentUrl).hostname.includes('sandbox');
  } catch {
    return false;
  }
}

export function showPaymentSandboxTools(paymentUrl: string | null | undefined): boolean {
  return ENABLE_PAYMENT_SANDBOX_TOOLS && isSandboxCheckout(paymentUrl);
}

export interface PendingCampaignPayment {
  campaignId: string;
  escrowId: string;
}

export function writePendingCampaignPayment(campaignId: string, escrowId: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PENDING_KEY, JSON.stringify({ campaignId, escrowId }));
  } catch {
    // Storage may be unavailable (private mode/quota/etc). Ignore and let the success page handle it.
  }
}

export function readPendingCampaignPayment(): PendingCampaignPayment | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(PENDING_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PendingCampaignPayment;
  } catch {
    localStorage.removeItem(PENDING_KEY);
    return null;
  }
}

export function clearPendingCampaignPayment(): void {
  if (typeof window !== 'undefined') localStorage.removeItem(PENDING_KEY);
}
