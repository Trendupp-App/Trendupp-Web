/**
 * Campaign payment flow (Pandascrow escrow):
 *
 * 1. submitCampaign() returns a paymentUrl + escrowId. Before opening the
 *    paymentUrl (in a new tab), we stash { campaignId, escrowId } here.
 * 2. Pandascrow redirects the browser to /payment/success?escrowId=...
 *    That redirect only carries escrowId — not campaignId — so the success
 *    page reads this pending record (localStorage is shared across tabs on
 *    the same origin) to know which campaign to verify.
 * 3. The pending record is cleared once verification succeeds. It's kept on
 *    failure so a retry on the success page still has campaignId to work with.
 */

const PENDING_KEY = 'campaign_payment_pending';

export interface PendingCampaignPayment {
  campaignId: string;
  escrowId: string;
}

export function writePendingCampaignPayment(campaignId: string, escrowId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PENDING_KEY, JSON.stringify({ campaignId, escrowId }));
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
