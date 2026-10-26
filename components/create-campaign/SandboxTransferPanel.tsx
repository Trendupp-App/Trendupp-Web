'use client';

import { useEffect, useRef, useState } from 'react';
import { AxiosError } from 'axios';
import { CheckCircle2, ExternalLink, FlaskConical, Loader2 } from 'lucide-react';
import { campaignApi } from '@/services/campaignApi';
import { useVerifyPayment } from '@/hooks/useCampaign';
import { formatCurrency } from '@/utils/Utilities';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';

const POLL_INTERVAL_MS = 4000;
const MAX_POLLS = 30; // ~2 minutes

type Phase = 'idle' | 'simulating' | 'verifying' | 'paid' | 'error';

interface SandboxTransferPanelProps {
  campaignId: string;
  /** The submit response's paymentReference (TRX-…), which Startbutton keys the checkout by */
  reference: string;
  /** Total to pay, in major units (naira) */
  amount: number;
  currency?: string;
  checkoutUrl: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPaid: () => void;
}

function errorMessage(err: unknown, fallback: string) {
  return (
    (err as AxiosError<{ message?: string | string[] }>)?.response?.data?.message?.toString() ??
    fallback
  );
}

/**
 * 🧪 Sandbox-only stand-in for the brand's bank transfer. The tester copies the virtual
 * account number from Startbutton's checkout page, we call mock-va-collection, then poll
 * verify-payment until the campaign is confirmed paid.
 */
export default function SandboxTransferPanel({
  campaignId,
  reference,
  amount,
  currency,
  checkoutUrl,
  open,
  onOpenChange,
  onPaid,
}: SandboxTransferPanelProps) {
  const [accountNumber, setAccountNumber] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const cancelledRef = useRef(false);
  const { mutateAsync: verifyPayment } = useVerifyPayment();

  useEffect(() => {
    // Reset on every mount: React dev (Strict Mode) mounts, unmounts and remounts, and the
    // first cleanup would otherwise leave this stuck at true and silently stop polling.
    cancelledRef.current = false;
    return () => {
      cancelledRef.current = true;
    };
  }, []);

  const isValidAccount = /^\d{10}$/.test(accountNumber);
  const isBusy = phase === 'simulating' || phase === 'verifying';

  // Verify can fail while Startbutton is still processing, or once the webhook has already
  // marked the campaign paid — so on error, fall back to the campaign's own paymentStatus.
  async function isPaid() {
    try {
      await verifyPayment({ campaignId, escrowId: reference });
      return true;
    } catch {
      const { data: campaign } = await campaignApi.getCampaign(campaignId);
      return campaign.paymentStatus === 'paid';
    }
  }

  async function pollUntilPaid() {
    setPhase('verifying');
    setError(null);
    for (let i = 1; i <= MAX_POLLS; i++) {
      if (cancelledRef.current) return;
      setAttempt(i);
      try {
        if (await isPaid()) {
          if (cancelledRef.current) return;
          setPhase('paid');
          setTimeout(() => !cancelledRef.current && onPaid(), 1200);
          return;
        }
      } catch {
        // Network blip — keep polling
      }
      await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
    }
    if (cancelledRef.current) return;
    setPhase('error');
    setError(
      "Transfer sent, but the payment isn't confirmed yet. It may still be processing — check again, or open your campaign later.",
    );
  }

  async function handleSimulate() {
    if (!isValidAccount || isBusy) return;
    setPhase('simulating');
    setError(null);
    try {
      await campaignApi.mockVaCollection({
        amount: Math.round(amount * 100),
        isKobo: true,
        accountNumber,
        reference,
      });
    } catch (err) {
      setPhase('error');
      setError(errorMessage(err, 'The simulated transfer failed. Check the account number.'));
      return;
    }
    await pollUntilPaid();
  }

  const fmt = (n: number) => formatCurrency(n, currency ?? 'NGN');

  // Closing mid-transfer would abandon the confirmation check, so lock the modal while busy
  const canClose = !isBusy && phase !== 'paid';

  return (
    <Dialog open={open} onOpenChange={(next) => (next || canClose) && onOpenChange(next)}>
      <DialogContent
        showCloseButton={canClose}
        className="sm:max-w-[460px] rounded-2xl p-6 flex flex-col gap-4"
        onInteractOutside={(e) => !canClose && e.preventDefault()}
        onEscapeKeyDown={(e) => !canClose && e.preventDefault()}
      >
        <div className="flex items-start gap-3 pr-6">
          <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
            <FlaskConical size={17} className="text-amber-600" />
          </div>
          <div className="flex flex-col gap-0.5">
            <DialogTitle className="text-base font-semibold text-[#1a1a2e]">
              Simulate bank transfer
            </DialogTitle>
            <DialogDescription className="text-xs text-[#7a7a9a] leading-relaxed">
              Sandbox only. Copy the account number from the Startbutton checkout tab and paste it
              below.
            </DialogDescription>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="flex flex-col gap-0.5 bg-white border border-[#e8e6f0] rounded-lg px-3 py-2.5">
            <span className="text-[#9a99b0]">Amount</span>
            <span className="font-semibold text-[#1a1a2e]">{fmt(amount)}</span>
          </div>
          <div className="flex flex-col gap-0.5 bg-white border border-[#e8e6f0] rounded-lg px-3 py-2.5 min-w-0">
            <span className="text-[#9a99b0]">Reference</span>
            <span className="font-mono text-[11px] text-[#1a1a2e] truncate" title={reference}>
              {reference}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="sandbox-account" className="text-xs font-medium text-[#1a1a2e]">
            Virtual account number
          </label>
          <input
            id="sandbox-account"
            inputMode="numeric"
            maxLength={10}
            placeholder="10-digit account number"
            value={accountNumber}
            disabled={isBusy || phase === 'paid'}
            onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
            className="h-10 px-3 text-sm font-mono rounded-lg border border-[#e8e6f0] bg-white outline-none focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/10 disabled:opacity-60"
          />
          <a
            href={checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-brand-pink hover:underline w-fit"
          >
            Open Startbutton checkout <ExternalLink size={12} />
          </a>
        </div>

        {phase === 'verifying' && (
          <div className="flex items-center gap-2 text-xs text-[#4a4a6a] bg-white border border-[#e8e6f0] rounded-lg px-3 py-2.5">
            <Loader2 size={14} className="animate-spin text-brand-pink shrink-0" />
            Transfer sent — waiting for payment confirmation… ({attempt}/{MAX_POLLS})
          </div>
        )}

        {phase === 'paid' && (
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2.5">
            <CheckCircle2 size={14} className="shrink-0" />
            Payment confirmed — taking you to your campaign…
          </div>
        )}

        {error && (
          <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5">
            {error}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={handleSimulate}
            disabled={!isValidAccount || isBusy || phase === 'paid'}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 h-11 rounded-lg text-sm font-medium transition-colors',
              isValidAccount && !isBusy && phase !== 'paid'
                ? 'bg-amber-500 text-white hover:bg-amber-600 cursor-pointer'
                : 'bg-zinc-100 text-zinc-400 cursor-not-allowed',
            )}
          >
            {phase === 'simulating' && <Loader2 size={16} className="animate-spin" />}
            {phase === 'simulating' ? 'Sending transfer…' : 'Simulate transfer'}
          </button>
          {phase === 'error' && (
            <button
              type="button"
              onClick={pollUntilPaid}
              className="h-11 px-4 rounded-lg text-sm font-medium border border-[#e8e6f0] bg-white text-[#1a1a2e] hover:bg-[#faf9fc] cursor-pointer"
            >
              Check payment again
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
