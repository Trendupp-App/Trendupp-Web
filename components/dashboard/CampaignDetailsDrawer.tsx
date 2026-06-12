'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Clock, Shield, Calendar, Check, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Campaign {
  title: string;
  brand: string;
  budget: string;
  daysLeft: string;
  tier: string;
  appliedCount: number;
  image: string;
}

interface CampaignDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: Campaign | null;
}

type TabType = 'overview' | 'requirement' | 'timeline';

export default function CampaignDetailsDrawer({
  isOpen,
  onClose,
  campaign,
}: CampaignDetailsDrawerProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Lock scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!campaign) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex justify-end transition-opacity duration-300',
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
      )}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/35 backdrop-blur-[2px] transition-all"
        onClick={onClose}
      />

      {/* Slide-out Drawer Panel */}
      <div
        className={cn(
          'w-full max-w-[560px] h-full bg-white relative z-10 flex flex-col shadow-2xl transition-transform duration-300 ease-out overflow-y-auto auth-scrollbar pb-6',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* Close Button on Banner */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-black/40 text-white p-1.5 rounded-full hover:bg-black/60 transition-colors focus:outline-none"
          aria-label="Close details"
        >
          <X size={18} />
        </button>

        {/* Hero image header banner */}
        <div className="relative h-[240px] w-full shrink-0 bg-zinc-100">
          <Image src={campaign.image} alt={campaign.title} fill className="object-cover" />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-5">
            <div className="flex flex-col gap-0.5 text-white pr-16">
              <h3 className="text-xl font-bold leading-tight">{campaign.title}</h3>
              <p className="text-xs text-white/80 font-light mt-1 flex items-center gap-1.5">
                <span>{campaign.brand}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock size={12} className="text-white/85" />
                  1d 14h left
                </span>
              </p>
            </div>

            {/* Campaign Tier Badge (bottom-right of image) */}
            <span className="absolute bottom-5 right-5 text-xs font-semibold text-[#7c3aed] bg-[#f5f3ff] px-3 py-1.5 rounded-md">
              {campaign.tier}
            </span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-5 flex flex-col gap-6">
          {/* Metadata Statistics Grid */}
          <div className="grid grid-cols-4 border border-[#e8e6f0]/60 rounded-2xl p-4 bg-white text-center text-xs font-light text-[#7a7a9a] gap-2 divide-x divide-[#e8e6f0]/60 shrink-0">
            <div className="flex flex-col gap-1">
              <span>Budget range</span>
              <span className="font-bold text-brand-pink break-all leading-normal">
                {campaign.budget}
              </span>
            </div>
            <div className="flex flex-col gap-1 pl-2">
              <span>Platform</span>
              <span className="font-bold text-[#1a1a2e] leading-normal">Instagram</span>
            </div>
            <div className="flex flex-col gap-1 pl-2">
              <span>Niche</span>
              <span className="font-bold text-[#1a1a2e] leading-normal">Sport</span>
            </div>
            <div className="flex flex-col gap-1 pl-2">
              <span>Applied</span>
              <span className="font-bold text-[#1a1a2e] leading-normal">42</span>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="bg-[#f4f3f6] rounded-full p-1 flex gap-1 justify-between text-xs font-medium text-[#7a7a9a] shrink-0">
            {(['overview', 'requirement', 'timeline'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'py-2 flex-1 text-center rounded-full transition-all capitalize',
                  activeTab === tab
                    ? 'bg-white text-brand-pink font-semibold shadow-sm'
                    : 'hover:text-brand-pink',
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Specific Content Area */}
          <div className="flex-1 min-h-[220px]">
            {activeTab === 'overview' && (
              <div className="flex flex-col gap-5">
                {/* Create content tag */}
                <span className="w-fit bg-[#4f46e5] text-white text-[11px] font-semibold px-4.5 py-1.5 rounded-full select-none cursor-default">
                  Create content
                </span>

                {/* Info Text */}
                <p className="text-xs font-extralight text-[#7a7a9a] leading-relaxed">
                  This is a content creation campaign. You will produce original content following
                  the brief guidelines and submit it for brand approval before posting.
                </p>

                {/* 48-Hour Application Window Card */}
                <div className="border border-pink-200 bg-pink-50/15 rounded-2xl p-4 flex gap-3.5 items-start">
                  <div className="w-8 h-8 rounded-full bg-[#fdf2f6] flex items-center justify-center shrink-0">
                    <Clock size={16} className="text-brand-pink" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <h4 className="text-xs font-bold text-brand-pink">
                      48-Hour Application Window
                    </h4>
                    <p className="text-[11px] font-extralight text-[#7a7a9a] leading-relaxed mt-1">
                      This campaign accepts applications for 48 hours only. After the window closes,
                      the brand selects creators. Results are sent within 48 hours of closing.
                    </p>
                  </div>
                </div>

                {/* Escrow Protected Card */}
                <div className="border border-[#e8e6f0]/80 bg-white rounded-2xl p-4 flex gap-3.5 items-start">
                  <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center shrink-0">
                    <Shield size={16} className="text-[#5a5a7a]" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <h4 className="text-xs font-bold text-[#1a1a2e]">Escrow Protected</h4>
                    <p className="text-[11px] font-extralight text-[#7a7a9a] leading-relaxed mt-1">
                      Brand payment confirmed in escrow before you receive the campaign. No work
                      before payment is secured.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'requirement' && (
              <div className="flex flex-col gap-5">
                {/* 3 Metric Summary items */}
                <div className="grid grid-cols-3 gap-2.5 items-center shrink-0">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#f4f3f6] flex items-center justify-center text-[#5a5a7a] shrink-0">
                      <FileText size={18} />
                    </div>
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="text-[11px] text-[#9a99b0] font-light truncate">
                        Content Type
                      </span>
                      <span className="text-xs font-bold text-[#1a1a2e] truncate leading-normal">
                        Feed Post + 3 Stories
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#f4f3f6] flex items-center justify-center text-[#5a5a7a] shrink-0">
                      <Clock size={18} />
                    </div>
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="text-[11px] text-[#9a99b0] font-light truncate">
                        Duration
                      </span>
                      <span className="text-xs font-bold text-[#1a1a2e] truncate leading-normal">
                        30–60 seconds
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#f4f3f6] flex items-center justify-center text-[#5a5a7a] shrink-0">
                      <Calendar size={18} />
                    </div>
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="text-[11px] text-[#9a99b0] font-light truncate">
                        Creation Window
                      </span>
                      <span className="text-xs font-bold text-[#1a1a2e] truncate leading-normal font-sans">
                        3–5 days
                      </span>
                    </div>
                  </div>
                </div>

                {/* Side-by-side rules cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1">
                  {/* Card 1: Brand rules */}
                  <div className="border border-[#e8e6f0]/80 bg-white rounded-2xl p-5 flex flex-col gap-3.5 h-full">
                    <h4 className="text-sm font-bold text-[#1a1a2e]">
                      Content Guidelines (Brand Rules)
                    </h4>
                    <ul className="text-xs font-light text-[#7a7a9a] leading-relaxed flex flex-col gap-2.5 pl-3 list-disc">
                      <li>Tag @zaraafrica and use #ZaraNG</li>
                      <li>Show clothing in natural, lifestyle settings</li>
                      <li>Include verbal CTA in video</li>
                      <li>No competitor brands visible</li>
                      <li>Caption in English or Pidgin</li>
                    </ul>
                  </div>

                  {/* Card 2: Platform rules */}
                  <div className="border border-[#e8e6f0]/80 bg-white rounded-2xl p-5 flex flex-col gap-3.5 h-full">
                    <h4 className="text-sm font-bold text-[#1a1a2e]">Platform Rules (Trendupp)</h4>
                    <ul className="text-xs font-light text-[#7a7a9a] leading-relaxed flex flex-col gap-2.5 pl-3 list-disc">
                      <li>Only one revision is allowed if the brand requests changes</li>
                      <li>If rejected after revision, Trendupp admin makes the final call</li>
                      <li>Post must stay live for minimum 24 hours before payment releases</li>
                      <li>Deleting the post before 24hrs voids your payment</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'timeline' && (
              <div className="flex flex-col gap-6 pl-8 ml-3 border-l-2 border-[#e8e6f0]/70 mt-2.5 relative pb-4">
                {/* Step 1 */}
                <div className="relative">
                  <div className="absolute -left-[44px] top-0 w-6 h-6 rounded-full bg-[#00c37b] border-2 border-white flex items-center justify-center text-white text-xs shrink-0 select-none">
                    <Check size={12} className="stroke-[3]" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <h4 className="text-sm font-bold text-[#1a1a2e]">Application Open (48hrs)</h4>
                    <span className="text-[10px] text-[#9a99b0] font-light">Now</span>
                    <p className="text-xs font-light italic text-[#7a7a9a] mt-0.5 leading-relaxed">
                      48-hour window — apply before it closes
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative">
                  <div className="absolute -left-[44px] top-0 w-6 h-6 rounded-full bg-[#e8e6f0] border-2 border-white flex items-center justify-center text-[#9a99b0] text-xs shrink-0 select-none">
                    <div className="w-1.5 h-1.5 bg-[#9a99b0] rounded-full" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <h4 className="text-sm font-bold text-[#1a1a2e]">Application Window Closes</h4>
                    <span className="text-[10px] text-[#9a99b0] font-light">In 1d 14h</span>
                    <p className="text-xs font-light italic text-[#7a7a9a] mt-0.5 leading-relaxed">
                      Brand selects creators from all applicants
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative">
                  <div className="absolute -left-[44px] top-0 w-6 h-6 rounded-full bg-[#e8e6f0] border-2 border-white flex items-center justify-center text-[#9a99b0] text-xs shrink-0 select-none">
                    <div className="w-1.5 h-1.5 bg-[#9a99b0] rounded-full" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <h4 className="text-sm font-bold text-[#1a1a2e]">Content Creation</h4>
                    <span className="text-[10px] text-[#9a99b0] font-light">Days 3–6</span>
                    <p className="text-xs font-light italic text-[#7a7a9a] mt-0.5 leading-relaxed">
                      3–5 days to create and submit content
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="relative">
                  <div className="absolute -left-[44px] top-0 w-6 h-6 rounded-full bg-[#e8e6f0] border-2 border-white flex items-center justify-center text-[#9a99b0] text-xs shrink-0 select-none">
                    <div className="w-1.5 h-1.5 bg-[#9a99b0] rounded-full" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <h4 className="text-sm font-bold text-[#1a1a2e]">Brand Review (48hrs)</h4>
                    <span className="text-[10px] text-[#9a99b0] font-light">Day 7</span>
                    <p className="text-xs font-light italic text-[#7a7a9a] mt-0.5 leading-relaxed">
                      Brand reviews. 1 revision allowed if needed
                    </p>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="relative">
                  <div className="absolute -left-[44px] top-0 w-6 h-6 rounded-full bg-[#e8e6f0] border-2 border-white flex items-center justify-center text-[#9a99b0] text-xs shrink-0 select-none">
                    <div className="w-1.5 h-1.5 bg-[#9a99b0] rounded-full" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <h4 className="text-sm font-bold text-[#1a1a2e]">Post Content Live</h4>
                    <span className="text-[10px] text-[#9a99b0] font-light">Day 8</span>
                    <p className="text-xs font-light italic text-[#7a7a9a] mt-0.5 leading-relaxed">
                      Submit proof of posting after publishing
                    </p>
                  </div>
                </div>

                {/* Step 6 */}
                <div className="relative">
                  <div className="absolute -left-[44px] top-0 w-6 h-6 rounded-full bg-[#e8e6f0] border-2 border-white flex items-center justify-center text-[#9a99b0] text-xs shrink-0 select-none">
                    <div className="w-1.5 h-1.5 bg-[#9a99b0] rounded-full" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <h4 className="text-sm font-bold text-[#1a1a2e]">24hr Live Verification</h4>
                    <span className="text-[10px] text-[#9a99b0] font-light">Day 9</span>
                    <p className="text-xs font-light italic text-[#7a7a9a] mt-0.5 leading-relaxed">
                      Post must stay live — payment triggers after
                    </p>
                  </div>
                </div>

                {/* Step 7 */}
                <div className="relative">
                  <div className="absolute -left-[44px] top-0 w-6 h-6 rounded-full bg-[#e8e6f0] border-2 border-white flex items-center justify-center text-[#9a99b0] text-xs shrink-0 select-none">
                    <div className="w-1.5 h-1.5 bg-[#9a99b0] rounded-full" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <h4 className="text-sm font-bold text-[#1a1a2e]">Payment Released</h4>
                    <span className="text-[10px] text-[#9a99b0] font-light">Day 9–10</span>
                    <p className="text-xs font-light italic text-[#7a7a9a] mt-0.5 leading-relaxed">
                      Funds hit your wallet. 30-day hold begins
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action apply button */}
          <Button className="w-full bg-brand-pink text-white font-semibold text-[15px] py-6.5 rounded-xl hover:bg-brand-pink/95 shadow-[0_6px_22px_rgba(215,23,111,0.22)] active:scale-[0.99] transition-all select-none border-none shrink-0 mt-2">
            Apply now • 38h left
          </Button>
        </div>
      </div>
    </div>
  );
}
