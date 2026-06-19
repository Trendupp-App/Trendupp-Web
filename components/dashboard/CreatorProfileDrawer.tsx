'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PortfolioItem {
  id: number;
  image: string;
  brandName: string;
}

interface Platform {
  name: string;
  handle: string;
  followers: string;
  icon: 'instagram' | 'tiktok' | 'youtube' | 'twitter';
}

interface CreatorReview {
  id: number;
  brandName: string;
  logoText: string;
  logoBg: string;
  date: string;
  rating: number;
  text: string;
}

interface CreatorProfile {
  name: string;
  handle: string;
  category: string;
  tier: 'Micro' | 'Nano' | 'Macro' | 'Mega';
  rating: number;
  campaignCount: number;
  image: string;
  location?: string;
  bio?: string;
  badge?: string; // e.g. "Impact Advocate"
  reach?: string; // e.g. "128K"
  earned?: string; // e.g. "₦1.2M"
  niches?: string[];
  platforms?: Platform[];
  portfolio?: PortfolioItem[];
  reviews?: CreatorReview[];
}

interface CreatorProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  creator: CreatorProfile | null;
}

// ── Platform Icon Components ─────────────────────────────
function InstagramIcon() {
  return (
    <div
      className="w-10 h-10 rounded-xl overflow-hidden shrink-0 flex items-center justify-center"
      style={{
        background:
          'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
      }}
    >
      <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    </div>
  );
}

function TikTokIcon() {
  return (
    <div className="w-10 h-10 rounded-xl bg-[#010101] shrink-0 flex items-center justify-center">
      <svg viewBox="0 0 24 24" fill="white" className="w-4.5 h-4.5">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.73a4.85 4.85 0 01-1.01-.04z" />
      </svg>
    </div>
  );
}

function YouTubeIcon() {
  return (
    <div className="w-10 h-10 rounded-xl bg-[#FF0000] shrink-0 flex items-center justify-center">
      <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    </div>
  );
}

function TwitterIcon() {
  return (
    <div className="w-10 h-10 rounded-xl bg-black shrink-0 flex items-center justify-center">
      <svg viewBox="0 0 24 24" fill="white" className="w-4.5 h-4.5">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    </div>
  );
}

function PlatformIcon({ icon }: { icon: Platform['icon'] }) {
  if (icon === 'instagram') return <InstagramIcon />;
  if (icon === 'tiktok') return <TikTokIcon />;
  if (icon === 'youtube') return <YouTubeIcon />;
  return <TwitterIcon />;
}

// ── Award / Niche icon ───────────────────────────────────
function NicheIcon() {
  return (
    <div className="w-10 h-10 rounded-full bg-[#fff0f5] flex items-center justify-center shrink-0">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#d7176f"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <circle cx="12" cy="8" r="6" />
        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
      </svg>
    </div>
  );
}

const DEFAULT_REVIEWS: CreatorReview[] = [
  {
    id: 1,
    brandName: 'Zara Africa',
    logoText: 'ZA',
    logoBg: 'bg-[#00c288]',
    date: 'May 2025',
    rating: 5,
    text: 'Alex delivered outstanding content that exceeded expectations. Professional, creative, and on time. Would work with again.',
  },
  {
    id: 2,
    brandName: 'Tecno Mobile',
    logoText: 'TM',
    logoBg: 'bg-[#7c3aed]',
    date: 'Apr 2025',
    rating: 5,
    text: 'Excellent content quality with great audience engagement. Would definitely collaborate again.',
  },
  {
    id: 3,
    brandName: 'Nestlé Nigeria',
    logoText: 'NN',
    logoBg: 'bg-[#f59e0b]',
    date: 'Mar 2025',
    rating: 4,
    text: 'Good content creation. Minor revisions needed but the final result was great quality.',
  },
];

export default function CreatorProfileDrawer({
  isOpen,
  onClose,
  creator,
}: CreatorProfileDrawerProps) {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'reviews'>('portfolio');
  const [showFullBio, setShowFullBio] = useState(false);
  const [visiblePortfolio, setVisiblePortfolio] = useState(6);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveTab('portfolio');
      setShowFullBio(false);
      setVisiblePortfolio(6);
    }
  }, [isOpen]);

  if (!creator) return null;

  const bio =
    creator.bio ??
    `Fashion & lifestyle creator based in Lagos 🌟\nHelping brands tell authentic stories through content.`;

  const BIO_LIMIT = 100;
  const isTruncated = bio.length > BIO_LIMIT && !showFullBio;
  const displayBio = isTruncated ? bio.slice(0, BIO_LIMIT) : bio;

  const portfolio = creator.portfolio ?? [];
  const visibleItems = portfolio.slice(0, visiblePortfolio);

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 transition-all duration-300',
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
      )}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />

      {/* Drawer panel */}
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0',
          'md:bottom-auto md:top-0 md:left-auto md:right-0 md:h-full md:w-[500px]',
          'bg-[#f4f4f8] rounded-t-3xl md:rounded-none',
          'overflow-y-auto auth-scrollbar max-h-[96vh] md:max-h-full',
          'transition-transform duration-300 ease-out',
          'border-0 border-none',
          isOpen ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-x-full',
        )}
        style={{ border: 'none' }}
      >
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-6 text-white/75 hover:text-white transition-colors focus:outline-none z-20 cursor-pointer p-1.5"
          aria-label="Close creator drawer"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* ── DARK NAVY HERO HEADER ── */}
        <div className="relative bg-[#040039] pt-12 pb-8 px-5 flex flex-col items-center text-center">
          {/* Circular profile image with pink ring */}
          <div className="w-[100px] h-[100px] rounded-full border-[3.5px] border-brand-pink overflow-hidden bg-zinc-300 shadow-xl mb-4 mt-2">
            <Image
              src={creator.image}
              alt={creator.name}
              width={100}
              height={100}
              className="object-cover w-full h-full"
            />
          </div>

          {/* Name + Rating pill inline */}
          <div className="flex items-center gap-2.5 mb-1">
            <h2 className="text-white text-[22px] font-bold leading-tight">{creator.name}</h2>
            <div className="flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1">
              <span className="text-amber-400 text-sm">★</span>
              <span className="text-white text-[13px] font-semibold">{creator.rating}</span>
            </div>
          </div>

          {/* Handle */}
          <p className="text-white/50 text-[13px] mb-3">@{creator.handle}</p>

          {/* Badge pill — "Impact Advocate" style */}
          {creator.badge && (
            <div className="flex items-center gap-0 mb-3">
              <div className="flex items-center bg-white rounded-full pl-5 pr-2 py-2.5 shadow-sm">
                <span className="text-brand-pink text-[14px] font-bold tracking-tight">
                  {creator.badge}
                </span>
                {/* Small medal icon on right edge */}
                <div className="ml-2 w-7 h-7 rounded-full bg-brand-pink flex items-center justify-center shadow-md">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-3.5 h-3.5"
                  >
                    <circle cx="12" cy="8" r="6" />
                    <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* Location */}
          {creator.location && (
            <div className="flex items-center gap-1 mb-5">
              <MapPin size={12} className="text-white/40" />
              <span className="text-white/50 text-[12px]">{creator.location}</span>
            </div>
          )}

          {/* Stats row — dark rounded card */}
          <div className="w-full bg-white/10 rounded-2xl flex items-stretch divide-x divide-white/15 overflow-hidden">
            {/* Reach */}
            <div className="flex-1 flex flex-col items-center justify-center py-4 gap-0.5">
              <span className="text-white text-[20px] font-bold leading-tight">
                {creator.reach ?? '—'}
              </span>
              <span className="text-white/45 text-[11px] font-light">Reach</span>
            </div>
            {/* Campaigns */}
            <div className="flex-1 flex flex-col items-center justify-center py-4 gap-0.5">
              <span className="text-white text-[20px] font-bold leading-tight">
                {creator.campaignCount}
              </span>
              <span className="text-white/45 text-[11px] font-light">Campaigns</span>
            </div>
            {/* Earned */}
            <div className="flex-1 flex flex-col items-center justify-center py-4 gap-0.5">
              <span className="text-white text-[20px] font-bold leading-tight">
                {creator.earned ?? '—'}
              </span>
              <span className="text-white/45 text-[11px] font-light">Earned</span>
            </div>
          </div>
        </div>

        {/* ── TABS: Portfolio | Reviews ── */}
        <div className="bg-white border-b border-[#e8e6f0]/50 flex w-full text-[13px] font-medium text-[#9a99b0]">
          {(['portfolio', 'reviews'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'flex-1 text-center py-3.5 capitalize transition-all focus:outline-none',
                activeTab === tab
                  ? 'text-brand-pink font-semibold border-b-2 border-brand-pink'
                  : 'hover:text-[#5a5a7a]',
              )}
            >
              {tab === 'portfolio' ? 'Portfolio' : 'Reviews'}
            </button>
          ))}
        </div>

        {/* ── CONTENT BODY ── */}
        <div className="px-4 py-5 flex flex-col gap-5">
          {activeTab === 'portfolio' && (
            <>
              {/* ── BIO ── */}
              <div>
                <h3 className="text-[15px] font-bold text-[#1a1a2e] mb-2">Bio</h3>
                <div className="bg-white rounded-2xl px-4 py-3.5 shadow-sm border border-[#f0eef8]">
                  <p className="text-[13px] text-[#5a5a7a] font-light leading-relaxed whitespace-pre-line">
                    {displayBio}
                    {isTruncated && (
                      <>
                        <span className="text-[#5a5a7a]">...</span>
                        <button
                          onClick={() => setShowFullBio(true)}
                          className="text-brand-pink font-semibold ml-1 focus:outline-none"
                        >
                          See More
                        </button>
                      </>
                    )}
                  </p>
                </div>

                {/* Creator Niche card */}
                {creator.niches && creator.niches.length > 0 && (
                  <div className="mt-2.5 bg-white rounded-2xl p-3.5 flex items-center gap-3 shadow-sm border border-[#f0eef8]">
                    <NicheIcon />
                    <div className="flex flex-col gap-1.5 min-w-0">
                      <span className="text-[10px] font-semibold text-[#9a99b0] leading-none tracking-wide">
                        Creator Niche
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {creator.niches.map((niche) => (
                          <span
                            key={niche}
                            className="text-[11px] font-semibold text-[#7c3aed] bg-[#f5f3ff] px-3 py-1 rounded-full leading-none"
                          >
                            {niche}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ── PLATFORMS ── */}
              {creator.platforms && creator.platforms.length > 0 && (
                <div>
                  <h3 className="text-[15px] font-bold text-[#1a1a2e] mb-3">Platforms</h3>
                  <div className="flex flex-col gap-2.5">
                    {creator.platforms.map((platform) => (
                      <div
                        key={platform.name}
                        className="bg-white rounded-2xl px-4 py-3.5 flex items-center justify-between shadow-sm border border-[#f0eef8]"
                      >
                        <div className="flex items-center gap-3">
                          <PlatformIcon icon={platform.icon} />
                          <div className="flex flex-col">
                            <span className="text-[14px] font-semibold text-[#1a1a2e] leading-tight">
                              {platform.name}
                            </span>
                            <span className="text-[11px] text-[#9a99b0] font-light leading-tight">
                              @{platform.handle}
                            </span>
                          </div>
                        </div>
                        <span className="text-[14px] font-bold text-brand-pink">
                          {platform.followers}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── PORTFOLIO GRID ── */}
              {portfolio.length > 0 && (
                <div>
                  <h3 className="text-[15px] font-bold text-[#1a1a2e] mb-3">Portfolio</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {visibleItems.map((item) => (
                      <div
                        key={item.id}
                        className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-200 cursor-pointer group"
                      >
                        <Image
                          src={item.image}
                          alt={item.brandName}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="33vw"
                        />
                        {/* Dark gradient overlay at bottom */}
                        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/65 to-transparent" />
                        {/* Brand name */}
                        <span className="absolute bottom-1.5 left-2 text-[10px] text-white font-semibold leading-none drop-shadow-sm">
                          {item.brandName}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Load More */}
                  <button
                    onClick={() =>
                      visiblePortfolio < portfolio.length
                        ? setVisiblePortfolio((p) => p + 6)
                        : undefined
                    }
                    className="w-full mt-3 py-3.5 text-[13px] font-semibold text-[#7a7a9a] bg-[#eceaf4] rounded-2xl hover:bg-[#e0ddf0] transition-colors focus:outline-none"
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          )}

          {/* ── REVIEWS TAB ── */}
          {activeTab === 'reviews' && (
            <div className="bg-white -mx-4 -my-5 px-5 py-6 flex flex-col gap-6 min-h-[600px]">
              {/* Rating Summary Section (No card, directly on white bg) */}
              <div className="flex items-center justify-start gap-8">
                {/* Left side: big score & stars */}
                <div className="flex flex-col items-start leading-none shrink-0">
                  <span className="text-[42px] font-bold text-[#1a1a2e] leading-none tracking-tight mb-1.5">
                    {creator.rating.toFixed(1)}
                  </span>
                  {/* Rating Stars row */}
                  <div className="flex items-center gap-0.5 mb-2 text-[#f59e0b] text-[13px] leading-none">
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                  </div>
                  <span className="text-[12px] text-[#9a99b0] font-light leading-none">
                    17 reviews
                  </span>
                </div>

                {/* Right side: Star progress bars */}
                <div className="flex flex-col gap-[3.5px] flex-1 max-w-[210px]">
                  {[
                    { star: 5, pct: 78 },
                    { star: 4, pct: 15 },
                    { star: 3, pct: 7 },
                    { star: 2, pct: 0 },
                    { star: 1, pct: 0 },
                  ].map((row) => (
                    <div
                      key={row.star}
                      className="flex items-center gap-2.5 text-[11px] text-[#9a99b0] font-light w-full"
                    >
                      <span className="w-2 text-right leading-none shrink-0">{row.star}</span>
                      <div className="flex-1 h-[5px] rounded-full bg-[#eceaf4] overflow-hidden relative">
                        {row.pct > 0 && (
                          <div
                            className="absolute top-0 bottom-0 left-0 bg-[#f59e0b] rounded-full"
                            style={{ width: `${row.pct}%` }}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Individual reviews feed */}
              <div className="flex flex-col gap-7 mt-2">
                {(() => {
                  const reviewsToRender =
                    creator.reviews && creator.reviews.length > 0
                      ? creator.reviews
                      : DEFAULT_REVIEWS;
                  return reviewsToRender.map((review) => {
                    const isCard = review.brandName === 'Nestlé Nigeria';

                    if (isCard) {
                      return (
                        <div
                          key={review.id}
                          className="bg-white rounded-2xl p-4 border border-[#e8e6f0]/45 shadow-sm flex flex-col gap-3"
                        >
                          {/* Review Header */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {/* Circle Avatar Initials */}
                              <div
                                className={cn(
                                  'w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-base shrink-0',
                                  review.logoBg,
                                )}
                              >
                                {review.logoText}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[14px] font-bold text-[#1a1a2e] leading-tight">
                                  {review.brandName}
                                </span>
                                <span className="text-[11px] text-[#9a99b0] font-light leading-none mt-0.5">
                                  {review.date}
                                </span>
                              </div>
                            </div>

                            {/* Stars row */}
                            <div className="flex items-center gap-0.5 text-[14px]">
                              {Array.from({ length: review.rating }).map((_, i) => (
                                <span key={i} className="text-amber-500">
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Review Text */}
                          <p className="text-[13px] text-[#5a5a7a] font-light leading-relaxed">
                            {review.text}
                          </p>
                        </div>
                      );
                    }

                    // Default non-card view (direct on white bg)
                    return (
                      <div key={review.id} className="flex flex-col gap-3">
                        {/* Review Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {/* Circle Avatar Initials */}
                            <div
                              className={cn(
                                'w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-base shrink-0',
                                review.logoBg,
                              )}
                            >
                              {review.logoText}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[14px] font-bold text-[#1a1a2e] leading-tight">
                                {review.brandName}
                              </span>
                              <span className="text-[11px] text-[#9a99b0] font-light leading-none mt-0.5">
                                {review.date}
                              </span>
                            </div>
                          </div>

                          {/* Stars row */}
                          <div className="flex items-center gap-0.5 text-[14px]">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <span key={i} className="text-amber-500">
                                ★
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Review Text */}
                        <p className="text-[13px] text-[#5a5a7a] font-light leading-relaxed">
                          {review.text}
                        </p>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
