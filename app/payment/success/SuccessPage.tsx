'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, ArrowRight, PartyPopper, Loader2, XCircle } from 'lucide-react';
import { useVerifyPayment, useCampaign } from '@/hooks/useCampaign';
import { readPendingCampaignPayment, clearPendingCampaignPayment } from '@/lib/paymentFlow';

const REDIRECT_SECONDS = 5;

type PageState = 'verifying' | 'success' | 'failed' | 'invalid' | 'handoff';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const gatewayStatus = searchParams.get('status');
  const paystackReference = searchParams.get('reference') ?? searchParams.get('trxref');
  const hasGatewayRef = Boolean(
    searchParams.get('ref') ??
    searchParams.get('escrowId') ??
    searchParams.get('escrow_id') ??
    paystackReference,
  );

  const verifyPayment = useVerifyPayment();
  const hasAttempted = useRef(false);
  const [state, setState] = useState<PageState>('verifying');
  const [campaignId, setCampaignId] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(REDIRECT_SECONDS);
  const [showCheck, setShowCheck] = useState(false);

  const { data: campaign } = useCampaign(state === 'success' ? campaignId : null);

  function attemptVerification() {
    if (gatewayStatus && gatewayStatus !== 'success') {
      setState('failed');
      return;
    }

    const pending = readPendingCampaignPayment();

    if (!hasGatewayRef || !pending) {
      setState('invalid');
      return;
    }

    setCampaignId(pending.campaignId);
    setState('verifying');
    verifyPayment.mutate(
      { campaignId: pending.campaignId, escrowId: paystackReference ?? pending.escrowId },
      {
        onSuccess: () => {
          clearPendingCampaignPayment();
          setState('success');
        },
        onError: () => {
          setState('failed');
        },
      },
    );
  }
  useEffect(() => {
    if (hasAttempted.current) return;
    hasAttempted.current = true;

    const isMobileApp = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobileApp && !readPendingCampaignPayment()) {
      /* eslint-disable-next-line react-hooks/set-state-in-effect */
      setState('handoff');
      window.location.href = `trendupp-payment://payment/success?${searchParams.toString()}`;
      return;
    }

    attemptVerification();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Trigger the checkmark draw-in animation just after entering the success
  // state, so it doesn't flash instantly.
  useEffect(() => {
    if (state !== 'success') return;
    const t = setTimeout(() => setShowCheck(true), 150);
    return () => clearTimeout(t);
  }, [state]);

  // Countdown → auto-redirect to the campaign, only once verified.
  useEffect(() => {
    if (state !== 'success') return;
    if (secondsLeft <= 0) {
      router.replace(campaignId ? `/brand/campaign/${campaignId}` : '/brand/campaign');
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [state, secondsLeft, router, campaignId]);

  function handleRetry() {
    hasAttempted.current = true;
    attemptVerification();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff5f9] via-white to-[#f5f3ff] flex items-center justify-center px-6 relative overflow-hidden">
      {/* Ambient glow blobs */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 rounded-full bg-brand-pink/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 rounded-full bg-indigo-300/20 blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-xl border border-white shadow-[0_8px_40px_-8px_rgba(215,23,111,0.15)] rounded-3xl px-8 py-10 flex flex-col items-center text-center gap-6">
          {state === 'handoff' && (
            <>
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-pink/20 to-indigo-300/20 flex items-center justify-center">
                <Loader2 size={36} className="text-brand-pink animate-spin" />
              </div>
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-[#1a1a2e]">Taking you back to the app</h1>
                <p className="text-sm text-[#7a7a9a] leading-relaxed">
                  Hang tight while we hand this off to the Trendupp app.
                </p>
              </div>
            </>
          )}

          {state === 'verifying' && (
            <>
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-pink/20 to-indigo-300/20 flex items-center justify-center">
                <Loader2 size={36} className="text-brand-pink animate-spin" />
              </div>
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-[#1a1a2e]">Confirming your payment</h1>
                <p className="text-sm text-[#7a7a9a] leading-relaxed">
                  Hang tight while we confirm this with your payment provider. This usually only
                  takes a few seconds.
                </p>
              </div>
            </>
          )}

          {state === 'success' && (
            <>
              {/* Animated success icon */}
              <div className="relative">
                <div
                  className={`absolute inset-0 rounded-full bg-emerald-400/30 transition-all duration-700 ${
                    showCheck ? 'scale-150 opacity-0' : 'scale-100 opacity-100'
                  }`}
                />
                <div
                  className={`relative w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 transition-all duration-500 ${
                    showCheck ? 'scale-100 rotate-0' : 'scale-50 rotate-45'
                  }`}
                >
                  <CheckCircle2
                    size={40}
                    strokeWidth={2.2}
                    className={`text-white transition-opacity duration-500 delay-150 ${
                      showCheck ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                </div>
              </div>

              {/* Copy */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-center gap-2">
                  <h1 className="text-2xl font-bold text-[#1a1a2e]">Payment successful</h1>
                  <PartyPopper size={22} className="text-amber-400" />
                </div>
                <p className="text-sm text-[#7a7a9a] leading-relaxed">
                  {campaign?.title ? (
                    <>
                      <span className="font-semibold text-[#1a1a2e]">{campaign.title}</span> is now
                      submitted for review.
                    </>
                  ) : (
                    'Your campaign payment has been confirmed.'
                  )}{' '}
                  You&apos;ll be notified once it&apos;s approved and goes live.
                </p>
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-gradient-to-r from-transparent via-[#e8e6f0] to-transparent" />

              {/* Redirect status */}
              <div className="flex items-center gap-2 text-xs text-[#9a99b0]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-pink opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-pink" />
                </span>
                Redirecting to your campaign in {secondsLeft}s…
              </div>

              {/* Manual action */}
              <button
                onClick={() =>
                  router.replace(campaignId ? `/brand/campaign/${campaignId}` : '/brand/campaign')
                }
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-brand-pink text-white text-sm font-semibold rounded-xl hover:bg-brand-pink/90 active:scale-[0.98] transition-all shadow-sm shadow-brand-pink/20 cursor-pointer"
              >
                Go to campaign now
                <ArrowRight size={16} />
              </button>
            </>
          )}

          {state === 'failed' && (
            <>
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/30">
                <XCircle size={40} strokeWidth={2.2} className="text-white" />
              </div>
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-[#1a1a2e]">
                  We couldn&apos;t confirm this payment
                </h1>
                <p className="text-sm text-[#7a7a9a] leading-relaxed">
                  Your payment may still have gone through — this can happen if the confirmation
                  took too long. Try again, or check your campaign&apos;s status in a moment.
                </p>
              </div>
              <div className="w-full h-px bg-gradient-to-r from-transparent via-[#e8e6f0] to-transparent" />
              <div className="flex flex-col gap-3 w-full">
                <button
                  onClick={handleRetry}
                  disabled={verifyPayment.isPending}
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-brand-pink text-white text-sm font-semibold rounded-xl hover:bg-brand-pink/90 active:scale-[0.98] transition-all shadow-sm shadow-brand-pink/20 cursor-pointer disabled:opacity-60"
                >
                  {verifyPayment.isPending ? 'Retrying…' : 'Try again'}
                </button>
                <button
                  onClick={() => router.replace('/brand/campaign')}
                  className="text-sm text-[#7a7a9a] hover:text-[#1a1a2e] transition-colors cursor-pointer"
                >
                  Go to my campaigns
                </button>
              </div>
            </>
          )}

          {state === 'invalid' && (
            <>
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <XCircle size={40} strokeWidth={2.2} className="text-white" />
              </div>
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-[#1a1a2e]">
                  We can&apos;t confirm this payment here
                </h1>
                <p className="text-sm text-[#7a7a9a] leading-relaxed">
                  We couldn&apos;t match this payment link back to a campaign in this browser. If
                  you completed a payment, check your campaign&apos;s status on your dashboard — it
                  will update automatically once confirmed.
                </p>
              </div>
              <div className="w-full h-px bg-gradient-to-r from-transparent via-[#e8e6f0] to-transparent" />
              <button
                onClick={() => router.replace('/brand/campaign')}
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-brand-pink text-white text-sm font-semibold rounded-xl hover:bg-brand-pink/90 active:scale-[0.98] transition-all shadow-sm shadow-brand-pink/20 cursor-pointer"
              >
                Go to my campaigns
                <ArrowRight size={16} />
              </button>
            </>
          )}
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-[#9a99b0] mt-6">
          Funds are held securely in escrow until content is delivered and approved.
        </p>
      </div>
    </div>
  );
}
