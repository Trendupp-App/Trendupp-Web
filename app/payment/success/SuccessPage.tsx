'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, ArrowRight, PartyPopper } from 'lucide-react';

const REDIRECT_SECONDS = 5;

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const campaignTitle = searchParams.get('title');

  const [secondsLeft, setSecondsLeft] = useState(REDIRECT_SECONDS);
  const [showCheck, setShowCheck] = useState(false);

  // Trigger the checkmark draw-in animation just after mount, so it doesn't
  // flash instantly on load.
  useEffect(() => {
    const t = setTimeout(() => setShowCheck(true), 150);
    return () => clearTimeout(t);
  }, []);

  // Countdown → auto-redirect to the brand dashboard.
  useEffect(() => {
    if (secondsLeft <= 0) {
      router.replace('/brand/dashboard');
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff5f9] via-white to-[#f5f3ff] flex items-center justify-center px-6 relative overflow-hidden">
      {/* Ambient glow blobs */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 rounded-full bg-brand-pink/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 rounded-full bg-indigo-300/20 blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-xl border border-white shadow-[0_8px_40px_-8px_rgba(215,23,111,0.15)] rounded-3xl px-8 py-10 flex flex-col items-center text-center gap-6">
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
              {campaignTitle ? (
                <>
                  <span className="font-semibold text-[#1a1a2e]">{campaignTitle}</span> is now
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
            Redirecting to your dashboard in {secondsLeft}s…
          </div>

          {/* Manual action */}
          <button
            onClick={() => router.replace('/brand/dashboard')}
            className="flex items-center justify-center gap-2 w-full py-3.5 bg-brand-pink text-white text-sm font-semibold rounded-xl hover:bg-brand-pink/90 active:scale-[0.98] transition-all shadow-sm shadow-brand-pink/20 cursor-pointer"
          >
            Go to dashboard now
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-[#9a99b0] mt-6">
          Funds are held securely in escrow until content is delivered and approved.
        </p>
      </div>
    </div>
  );
}
