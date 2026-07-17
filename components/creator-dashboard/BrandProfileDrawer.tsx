'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Globe, MapPin } from 'lucide-react';
import { Portal } from '@/components/ui/portal';

interface CompletedCampaign {
  id: number;
  image: string;
  brandName: string;
  creatorAvatar?: string;
}

interface Platform {
  name: string;
  handle: string;
  followers: string;
  icon: 'instagram' | 'tiktok' | 'youtube' | 'twitter';
  engRate?: string;
  totalLikes?: string;
  avgReach?: string;
}

interface BrandProfile {
  name: string;
  category: string;
  campaignCount: number;
  followerCount: string;
  image: string;
  website?: string;
  location?: string;
  bio?: string;
  industries?: string[];
  platforms?: Platform[];
  completedCampaigns?: CompletedCampaign[];
}

interface BrandProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  brand: BrandProfile | null;
}

// ── Colored Brand Icon Renderers ────────────────
function InstagramIcon() {
  return (
    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 overflow-hidden relative shadow-sm">
      <div className="absolute inset-0 bg-gradient-to-tr from-[#f9ce3f] via-[#e1306c] to-[#833ab4]" />
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5 relative z-10"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    </div>
  );
}

function TikTokIcon() {
  return (
    <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center shrink-0 shadow-sm">
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <path
          fill="white"
          d="M12.53.02C13.84 0 15 1.01 15 2.32V8c1.33-1 3-1.5 4.78-1.12C21.84 7.29 23.36 9.3 23.5 11.4c.18 2.6-1.57 4.95-4.13 5.43-1.89.35-3.8-.32-4.87-1.78v4.25c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4c.48 0 .93.09 1.35.25V9.45c-1.37.58-2.91.56-4.25-.13-1.8-1-2.73-3.07-2.22-5.07.51-2 2.38-3.4 4.54-3.23 2.16.17 3.86 1.96 3.9 4.12V.02h2.24z"
        />
      </svg>
    </div>
  );
}

function YouTubeIcon() {
  return (
    <div className="w-9 h-9 rounded-xl bg-[#ff0000] flex items-center justify-center shrink-0 shadow-sm">
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" className="w-5 h-5">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
        <polygon fill="white" points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
      </svg>
    </div>
  );
}

function TwitterIcon() {
  return (
    <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center shrink-0 shadow-sm text-white">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="w-4.5 h-4.5"
      >
        <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
        <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
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

export default function BrandProfileDrawer({ isOpen, onClose, brand }: BrandProfileDrawerProps) {
  const [showFullBio, setShowFullBio] = useState(false);
  const [visibleCampaigns, setVisibleCampaigns] = useState(4);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowFullBio(false);
      setVisibleCampaigns(4);
    }
  }, [isOpen]);

  if (!brand) return null;

  const bio =
    brand.bio ??
    `${brand.name} stands at the intersection of heritage and high fashion. We are dedicated to curating and showcasing the finest African fashion and beauty narratives.`;

  const BIO_LIMIT = 130;
  const isTruncated = bio.length > BIO_LIMIT && !showFullBio;
  const displayBio = isTruncated ? bio.slice(0, BIO_LIMIT) : bio;

  const completedCampaigns = brand.completedCampaigns ?? [];
  const visibleItems = completedCampaigns.slice(0, visibleCampaigns);

  return (
    <Portal>
      <div
        className={cn(
          'fixed inset-0 z-50 transition-all duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-[3px] transition-all duration-300 ease-out"
          onClick={onClose}
        />

        {/* Drawer panel */}
        <div
          className={cn(
            'absolute bottom-0 left-0 right-0',
            'md:bottom-auto md:top-0 md:left-auto md:right-0 md:h-full md:w-[560px]',
            'bg-white rounded-none',
            'overflow-y-auto auth-scrollbar max-h-[96vh] md:max-h-full',
            'transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]',
            'flex flex-col gap-0 border-0 border-none',
            isOpen
              ? 'translate-y-0 md:translate-x-0 md:translate-y-0'
              : 'translate-y-full md:translate-x-full md:translate-y-0',
          )}
          style={{ border: 'none' }}
        >
          {/* ── FULL-BLEED NAVY HERO HEADER ── */}
          <div className="relative w-full bg-gradient-to-b from-[#09052f] to-[#120d3d] px-6 pt-12 pb-10 flex flex-col items-center text-center select-none shrink-0">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-6 text-white/75 hover:text-white transition-colors focus:outline-none z-20 cursor-pointer p-1.5"
              aria-label="Close brand drawer"
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

            {/* Centered Avatar with gradient ring */}
            <div className="mt-4 p-[3.5px] bg-gradient-to-tr from-[#d7176f] to-[#9d17d7] rounded-full shadow-lg relative w-24 h-24 shrink-0">
              <div className="w-full h-full rounded-full overflow-hidden bg-white relative">
                <Image
                  src={brand.image}
                  alt={brand.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
            </div>

            {/* Brand Name */}
            <h2 className="text-white text-[20px] font-bold mt-4 tracking-tight leading-tight">
              {brand.name}
            </h2>

            {/* Website with globe icon */}
            {brand.website && (
              <div className="flex items-center gap-1.5 mt-2.5 text-white/70 text-xs font-light">
                <Globe className="w-3.5 h-3.5" />
                <span>{brand.website}</span>
              </div>
            )}

            {/* Location with map pin icon */}
            {brand.location && (
              <div className="flex items-center gap-1.5 mt-2 text-white/70 text-xs font-light">
                <MapPin className="w-3.5 h-3.5" />
                <span>{brand.location}</span>
              </div>
            )}
          </div>

          {/* ── Drawer Body Content ── */}
          <div className="px-6 py-6 flex flex-col gap-6">
            {/* ── BIO ── */}
            <div className="w-full">
              <h3 className="text-[14px] font-bold text-[#1a1a2e] mb-2.5">Bio</h3>
              <div className="flex flex-col gap-3">
                {/* Bio description card */}
                <div className="bg-white border border-[#e8e6f0]/60 rounded-2xl p-4 shadow-sm w-full">
                  <p className="text-[12px] text-[#5a5a7a] font-light leading-relaxed">
                    {displayBio}
                    {isTruncated && (
                      <>
                        <span className="text-[#5a5a7a]">.....</span>
                        <button
                          onClick={() => setShowFullBio(true)}
                          className="text-brand-pink font-semibold focus:outline-none ml-1 cursor-pointer"
                        >
                          See More
                        </button>
                      </>
                    )}
                  </p>
                </div>

                {/* Industry card */}
                {brand.industries && brand.industries.length > 0 && (
                  <div className="bg-white border border-[#e8e6f0]/60 rounded-2xl p-4 flex items-center gap-3.5 shadow-sm w-full">
                    {/* Pink award ribbon icon */}
                    <div className="w-10 h-10 rounded-xl bg-[#fff0f5] flex items-center justify-center shrink-0">
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

                    {/* Industry Label & Pills */}
                    <div className="flex flex-col gap-2 min-w-0">
                      <span className="text-[11px] font-medium text-[#7a7a9a] leading-none">
                        Industry
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {brand.industries.map((tag) => (
                          <span
                            key={tag}
                            className="text-[11px] font-semibold text-[#7c3aed] bg-[#f5f3ff] px-3.5 py-1.5 rounded-full leading-none"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── PLATFORMS ── */}
            {brand.platforms && brand.platforms.length > 0 && (
              <div className="w-full flex flex-col gap-2.5">
                <h3 className="text-[14px] font-bold text-[#1a1a2e] mb-0.5">Platforms</h3>
                {brand.platforms.map((platform) => (
                  <div
                    key={platform.name}
                    className="bg-white rounded-[20px] p-5 flex flex-col border border-[#e8e6f0]/60 shadow-sm w-full"
                  >
                    {/* Header Row */}
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <PlatformIcon icon={platform.icon} />
                        <div className="flex flex-col">
                          <span className="text-[13px] font-bold text-[#1a1a2e] leading-tight">
                            {platform.name}
                          </span>
                          <span className="text-[11px] text-[#9a99b0] font-light leading-tight mt-0.5">
                            @{platform.handle}
                          </span>
                        </div>
                      </div>
                      {/* Follower count in pink */}
                      <span className="text-[13px] font-bold text-brand-pink">
                        {platform.followers}
                      </span>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-2 mt-3.5">
                      <div className="bg-[#f8f8fa] rounded-2xl p-3.5 flex flex-col gap-1.5">
                        <span className="text-[10px] text-[#9a99b0] font-medium leading-none">
                          Eng. Rate
                        </span>
                        <span className="text-[13px] font-bold text-[#1a1a2e] leading-none">
                          {platform.engRate ?? '7.2%'}
                        </span>
                      </div>
                      <div className="bg-[#f8f8fa] rounded-2xl p-3.5 flex flex-col gap-1.5">
                        <span className="text-[10px] text-[#9a99b0] font-medium leading-none">
                          Total like
                        </span>
                        <span className="text-[13px] font-bold text-[#1a1a2e] leading-none">
                          {platform.totalLikes ?? '140K'}
                        </span>
                      </div>
                      <div className="bg-[#f8f8fa] rounded-2xl p-3.5 flex flex-col gap-1.5">
                        <span className="text-[10px] text-[#9a99b0] font-medium leading-none">
                          Avg. Reach
                        </span>
                        <span className="text-[13px] font-bold text-[#1a1a2e] leading-none">
                          {platform.avgReach ?? '140K'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── COMPLETED CAMPAIGNS ── */}
            {completedCampaigns.length > 0 && (
              <div className="pb-8 w-full flex flex-col gap-3">
                <h3 className="text-[14px] font-bold text-[#1a1a2e]">
                  Completed Campaign ({completedCampaigns.length})
                </h3>

                {/* 3-column grid */}
                <div className="grid grid-cols-3 gap-2 w-full">
                  {visibleItems.map((item) => (
                    <div
                      key={item.id}
                      className="relative aspect-square rounded-[20px] overflow-hidden bg-zinc-200 cursor-pointer group w-full"
                    >
                      {/* Campaign image */}
                      <Image
                        src={item.image}
                        alt={item.brandName}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="33vw"
                      />

                      {/* Simple overlay text on bottom left */}
                      <div className="absolute bottom-3 left-3 text-[11px] text-white font-bold leading-none z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                        {item.brandName}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Load More button */}
                {visibleCampaigns < completedCampaigns.length && (
                  <button
                    onClick={() => setVisibleCampaigns((p) => p + 6)}
                    className="w-full mt-2 py-4 text-[13px] font-semibold text-[#1a1a2e] bg-[#f4f2fa] rounded-[18px] hover:bg-[#eae8f2] transition-colors focus:outline-none cursor-pointer border-none"
                  >
                    Load More
                  </button>
                )}

                {/* Show Load More even when all campaigns are shown if there are >= 4 */}
                {visibleCampaigns >= completedCampaigns.length &&
                  completedCampaigns.length >= 1 && (
                    <button className="w-full mt-2 py-4 text-[13px] font-semibold text-[#7a7a9a] bg-[#f4f2fa]/70 rounded-[18px] focus:outline-none cursor-default border-none">
                      Load More
                    </button>
                  )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Portal>
  );
}
