'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

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

// ── Platform icon renderers in Outline style ────────────────
function InstagramIconOutline() {
  return (
    <div className="w-9 h-9 rounded-full border border-[#e8e6f0]/80 bg-[#f8f8fa] flex items-center justify-center shrink-0 text-[#1a1a2e]">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4.5 h-4.5"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    </div>
  );
}

function TikTokIconOutline() {
  return (
    <div className="w-9 h-9 rounded-full border border-[#e8e6f0]/80 bg-[#f8f8fa] flex items-center justify-center shrink-0 text-[#1a1a2e]">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4"
      >
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
      </svg>
    </div>
  );
}

function YouTubeIconOutline() {
  return (
    <div className="w-9 h-9 rounded-full border border-[#e8e6f0]/80 bg-[#f8f8fa] flex items-center justify-center shrink-0 text-[#1a1a2e]">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4.5 h-4.5"
      >
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
      </svg>
    </div>
  );
}

function TwitterIconOutline() {
  return (
    <div className="w-9 h-9 rounded-full border border-[#e8e6f0]/80 bg-[#f8f8fa] flex items-center justify-center shrink-0 text-[#1a1a2e]">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4"
      >
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
      </svg>
    </div>
  );
}

function PlatformIcon({ icon }: { icon: Platform['icon'] }) {
  if (icon === 'instagram') return <InstagramIconOutline />;
  if (icon === 'tiktok') return <TikTokIconOutline />;
  if (icon === 'youtube') return <YouTubeIconOutline />;
  return <TwitterIconOutline />;
}

// ── Award/Industry badge SVG icon ──────────────────────
function AwardIcon() {
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
          'md:bottom-auto md:top-0 md:left-auto md:right-0 md:h-full md:w-[560px]',
          'bg-white rounded-t-3xl md:rounded-none',
          'overflow-y-auto auth-scrollbar max-h-[96vh] md:max-h-full',
          'transition-transform duration-300 ease-out',
          'px-6 pt-12 pb-8 flex flex-col gap-6 border-0 border-none',
          isOpen ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-x-full',
        )}
        style={{ border: 'none' }}
      >
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-6 text-[#1a1a2e] hover:text-[#d7176f] transition-colors focus:outline-none z-20 cursor-pointer p-1.5"
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

        {/* ── DARK NAVY HERO HEADER (Card design) ── */}
        <div className="relative bg-[#02003c] rounded-[24px] p-6 flex items-center gap-5 text-left shadow-md select-none w-full shrink-0">
          {/* Brand logo with white border */}
          <div className="w-20 h-20 rounded-full border-2 border-white overflow-hidden bg-white shrink-0 shadow-sm relative">
            <Image src={brand.image} alt={brand.name} fill className="object-cover" sizes="80px" />
          </div>

          {/* Brand Info */}
          <div className="flex flex-col min-w-0">
            <h2 className="text-white text-[20px] font-bold leading-tight truncate">
              {brand.name}
            </h2>
            {brand.website && (
              <p className="text-white/60 text-[12px] font-light mt-1.5 leading-none">
                {brand.website}
              </p>
            )}
            {brand.location && (
              <p className="text-white/60 text-[12px] font-light mt-1.5 leading-none">
                {brand.location}
              </p>
            )}
          </div>
        </div>

        {/* ── BIO ── */}
        <div className="w-full">
          <h3 className="text-[14px] font-bold text-[#1a1a2e] mb-2.5">Bio</h3>
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
                    See more
                  </button>
                </>
              )}
            </p>
          </div>
        </div>

        {/* ── CREATOR NICHE (Niches section) ── */}
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

            {/* Creator Niche Text & Pills */}
            <div className="flex flex-col gap-2 min-w-0">
              <span className="text-[10px] font-bold text-[#9a99b0] leading-none tracking-wide uppercase">
                Creator Niche
              </span>
              <div className="flex flex-wrap gap-1.5">
                {brand.industries.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-semibold text-[#7c3aed] bg-[#f5f3ff] px-3 py-1.5 rounded-full leading-none"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── PLATFORMS ── */}
        {brand.platforms && brand.platforms.length > 0 && (
          <div className="w-full flex flex-col gap-2.5">
            <h3 className="text-[14px] font-bold text-[#1a1a2e] mb-0.5">Platforms</h3>
            {brand.platforms.map((platform) => (
              <div
                key={platform.name}
                className="bg-white rounded-2xl px-4 py-3.5 flex items-center justify-between border border-[#e8e6f0]/60 shadow-sm w-full"
              >
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
                <span className="text-[13px] font-bold text-brand-pink">{platform.followers}</span>
              </div>
            ))}
          </div>
        )}

        {/* ── COMPLETED CAMPAIGNS ── */}
        {completedCampaigns.length > 0 && (
          <div className="pb-8 w-full flex flex-col gap-3">
            <h3 className="text-[14px] font-bold text-[#1a1a2e]">
              Completed campaign ({completedCampaigns.length})
            </h3>

            {/* 3-column grid */}
            <div className="grid grid-cols-3 gap-2 w-full">
              {visibleItems.map((item) => (
                <div
                  key={item.id}
                  className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-200 cursor-pointer group w-full"
                >
                  {/* Campaign image */}
                  <Image
                    src={item.image}
                    alt={item.brandName}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="33vw"
                  />

                  {/* Dark gradient overlay with name and arrow link at bottom */}
                  <div className="absolute inset-x-0 bottom-0 bg-black/45 backdrop-blur-[1px] py-1.5 px-2 flex items-center justify-between z-10">
                    <span className="text-[9px] text-white font-bold leading-none truncate max-w-[70%]">
                      {item.brandName}
                    </span>
                    {/* White circular arrow link icon */}
                    <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#02003c"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-2 h-2"
                      >
                        <line x1="7" y1="17" x2="17" y2="7" />
                        <polyline points="7 7 17 7 17 17" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More button */}
            {visibleCampaigns < completedCampaigns.length && (
              <button
                onClick={() => setVisibleCampaigns((p) => p + 4)}
                className="w-full mt-2 py-3.5 text-[13px] font-semibold text-[#7a7a9a] bg-[#eceaf4] rounded-2xl hover:bg-[#e0ddf0] transition-colors focus:outline-none cursor-pointer"
              >
                Load More
              </button>
            )}

            {/* Show Load More even when all campaigns are shown if there are >= 4 (matches screenshot) */}
            {visibleCampaigns >= completedCampaigns.length && completedCampaigns.length >= 1 && (
              <button className="w-full mt-2 py-3.5 text-[13px] font-semibold text-[#7a7a9a] bg-[#eceaf4] rounded-2xl focus:outline-none cursor-default">
                Load More
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
