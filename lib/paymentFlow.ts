const PENDING_KEY = 'campaign_payment_pending';

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
