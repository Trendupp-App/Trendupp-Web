'use client';

const INSTAGRAM_PENDING_KEY = 'instagram_auth_pending';

interface Props {
  role: string;
  acceptedTerms: boolean;
  acceptedPromotions: boolean;
  onRequireTerms?: () => void;
}

export function InstagramSignInButton({
  role,
  acceptedTerms,
  acceptedPromotions,
  onRequireTerms,
}: Props) {
  function handleClick() {
    if (!acceptedTerms) {
      onRequireTerms?.();
      return;
    }

    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback/instagram`;

    sessionStorage.setItem(
      INSTAGRAM_PENDING_KEY,
      JSON.stringify({
        role,
        redirectUri,
        acceptedTerms,
        acceptedPromotions,
      }),
    );

    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID!,
      redirect_uri: redirectUri,
      scope: [
        'instagram_business_basic',
        'instagram_business_manage_messages',
        'instagram_business_manage_comments',
        'instagram_business_content_publish',
        'instagram_business_manage_insights',
      ].join(','),
      response_type: 'code',
      state: role,
    });

    window.location.href = `https://www.instagram.com/oauth/authorize?${params.toString()}`;
  }

  return (
    <button
      onClick={handleClick}
      aria-label="Sign in with Instagram"
      className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-[#e8e6f0] bg-white transition-colors hover:border-brand-pink/40"
    >
      {/* Instagram icon */}
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
        <path
          d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
          fill="url(#instagram-gradient)"
        />
        <defs>
          <linearGradient id="instagram-gradient" x1="0" y1="24" x2="24" y2="0">
            <stop offset="0%" stopColor="#f09433" />
            <stop offset="25%" stopColor="#e6683c" />
            <stop offset="50%" stopColor="#dc2743" />
            <stop offset="75%" stopColor="#cc2366" />
            <stop offset="100%" stopColor="#bc1888" />
          </linearGradient>
        </defs>
      </svg>
    </button>
  );
}
