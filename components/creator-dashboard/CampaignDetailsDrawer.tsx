'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Clock, Shield, Calendar, Check, FileText, ArrowLeft } from 'lucide-react';
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
  const [drawerMode, setDrawerMode] = useState<'details' | 'apply' | 'success'>('details');
  const [contentTitle, setContentTitle] = useState('');
  const [workLink, setWorkLink] = useState('');
  const [primaryPlatform, setPrimaryPlatform] = useState('Instagram');
  const [secondaryPlatform, setSecondaryPlatform] = useState('None');
  const [feeRequest, setFeeRequest] = useState('');
  const [comments, setComments] = useState('');

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

  // Reset form states and close
  const handleClose = () => {
    setDrawerMode('details');
    setContentTitle('');
    setWorkLink('');
    setPrimaryPlatform('Instagram');
    setSecondaryPlatform('None');
    setFeeRequest('');
    setComments('');
    onClose();
  };

  const isFormValid = contentTitle.length >= 20 && feeRequest.trim() !== '';

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
        onClick={handleClose}
      />

      {/* Slide-out Drawer Panel */}
      <div
        className={cn(
          'w-full max-w-[560px] h-full bg-white relative z-10 flex flex-col shadow-2xl transition-transform duration-300 ease-out overflow-y-auto auth-scrollbar pb-6 border-0 border-none',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
        style={{ border: 'none' }}
      >
        {drawerMode === 'details' && (
          <>
            {/* Close Button on Banner */}
            <button
              onClick={handleClose}
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
                      {campaign.daysLeft} left
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
                  <span className="font-bold text-[#1a1a2e] leading-normal">
                    {campaign.appliedCount}
                  </span>
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
                      This is a content creation campaign. You will produce original content
                      following the brief guidelines and submit it for brand approval before
                      posting.
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
                          This campaign accepts applications for 48 hours only. After the window
                          closes, the brand selects creators. Results are sent within 48 hours of
                          closing.
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
                          <span className="text-[11px] text-[#9a99b0] font-light">
                            Content Type
                          </span>
                          <span className="text-xs font-bold text-[#1a1a2e] leading-normal">
                            Feed Post + 3 Stories
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-[#f4f3f6] flex items-center justify-center text-[#5a5a7a] shrink-0">
                          <Clock size={18} />
                        </div>
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <span className="text-[11px] text-[#9a99b0] font-light">Duration</span>
                          <span className="text-xs font-bold text-[#1a1a2e] leading-normal">
                            30–60 seconds
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-[#f4f3f6] flex items-center justify-center text-[#5a5a7a] shrink-0">
                          <Calendar size={18} />
                        </div>
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <span className="text-[11px] text-[#9a99b0] font-light">
                            Creation Window
                          </span>
                          <span className="text-xs font-bold text-[#1a1a2e] leading-normal font-sans">
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
                        <h4 className="text-sm font-bold text-[#1a1a2e]">
                          Platform Rules (Trendupp)
                        </h4>
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
                        <h4 className="text-sm font-bold text-[#1a1a2e]">
                          Application Open (48hrs)
                        </h4>
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
                        <h4 className="text-sm font-bold text-[#1a1a2e]">
                          Application Window Closes
                        </h4>
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
              <Button
                onClick={() => setDrawerMode('apply')}
                className="w-full bg-brand-pink text-white font-semibold text-[15px] py-6.5 rounded-xl hover:bg-brand-pink/95 shadow-[0_6px_22px_rgba(215,23,111,0.22)] active:scale-[0.99] transition-all select-none border-none shrink-0 mt-2"
              >
                Apply now • 38h left
              </Button>
            </div>
          </>
        )}

        {drawerMode === 'apply' && (
          <>
            {/* Application Sticky Header */}
            <div className="sticky top-0 bg-white border-b border-[#e8e6f0]/60 py-4.5 px-5 flex items-center justify-between z-20 shrink-0">
              <button
                onClick={() => setDrawerMode('details')}
                className="flex items-center gap-1.5 text-xs text-[#7a7a9a] hover:text-[#1a1a2e] transition-colors font-medium focus:outline-none"
              >
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>
              <span className="text-sm font-bold text-[#1a1a2e] absolute left-1/2 -translate-x-1/2 select-none">
                Application
              </span>
              <button
                onClick={handleClose}
                className="text-[#7a7a9a] hover:text-[#1a1a2e] transition-colors focus:outline-none"
                aria-label="Close application"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="p-5 flex flex-col gap-5 overflow-y-auto">
              {/* Campaign Info Summary Card */}
              <div className="bg-[#f8f7fa] p-4.5 rounded-2xl border border-[#e8e6f0]/40 flex flex-col gap-2.5 relative shrink-0">
                <div className="flex flex-col gap-1 pr-24">
                  <h4 className="text-[15px] font-bold text-[#1a1a2e] leading-tight select-none">
                    {campaign.title}
                  </h4>
                  <p className="text-xs font-light text-[#7a7a9a] flex items-center gap-1.5 mt-0.5">
                    <span>{campaign.brand}</span>
                    <span>•</span>
                    <span>{campaign.budget}</span>
                  </p>
                </div>

                {/* Meta labels (Top right of card) */}
                <div className="absolute right-4.5 top-4.5 flex flex-col items-end gap-2 text-right">
                  <span className="flex items-center gap-1 text-[10px] text-[#7a7a9a] font-light">
                    <Clock size={11} className="text-[#9a99b0]" />
                    {campaign.daysLeft} left
                  </span>
                  <span className="text-[10px] font-semibold text-[#7c3aed] bg-[#f5f3ff] px-2.5 py-1 rounded-md">
                    {campaign.tier}
                  </span>
                </div>
              </div>

              {/* Form Input Elements */}
              <div className="flex flex-col gap-4">
                {/* Content Title */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contentTitle" className="text-xs font-bold text-[#1a1a2e]">
                    Content title *
                  </label>
                  <textarea
                    id="contentTitle"
                    rows={3}
                    value={contentTitle}
                    onChange={(e) => setContentTitle(e.target.value)}
                    placeholder="e.g. I'll create a morning routine reel showing how I style the summer collection for a Lagos workday..."
                    className="border border-[#e8e6f0] focus:border-brand-pink focus:ring-1 focus:ring-brand-pink/30 rounded-xl p-3 text-xs w-full outline-none transition-all placeholder:text-[#9a99b0] text-[#1a1a2e] resize-none leading-relaxed"
                  />
                  <div className="flex justify-between items-center text-[10px] px-0.5">
                    <span
                      className={cn(
                        'font-light',
                        contentTitle.length < 20 ? 'text-red-500 font-medium' : 'text-[#9a99b0]',
                      )}
                    >
                      {contentTitle.length} chars • min 20
                    </span>
                  </div>
                </div>

                {/* Pass Work Link */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="workLink" className="text-xs font-bold text-[#1a1a2e]">
                    Pass work link (optional)
                  </label>
                  <input
                    id="workLink"
                    type="text"
                    value={workLink}
                    onChange={(e) => setWorkLink(e.target.value)}
                    placeholder="https://instagram.com/p/example"
                    className="border border-[#e8e6f0] focus:border-brand-pink focus:ring-1 focus:ring-brand-pink/30 rounded-xl p-3 text-xs w-full outline-none transition-all placeholder:text-[#9a99b0] text-[#1a1a2e]"
                  />
                </div>

                {/* Platforms Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="primaryPlatform" className="text-xs font-bold text-[#1a1a2e]">
                      Primary platform
                    </label>
                    <div className="relative">
                      <select
                        id="primaryPlatform"
                        value={primaryPlatform}
                        onChange={(e) => setPrimaryPlatform(e.target.value)}
                        className="border border-[#e8e6f0] focus:border-brand-pink rounded-xl p-3 text-xs w-full outline-none appearance-none bg-white text-[#1a1a2e] pr-8 cursor-pointer"
                      >
                        <option value="Instagram">Instagram</option>
                        <option value="TikTok">TikTok</option>
                        <option value="YouTube">YouTube</option>
                        <option value="Twitter">Twitter / X</option>
                      </select>
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#7a7a9a]">
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="secondaryPlatform" className="text-xs font-bold text-[#1a1a2e]">
                      Primary platform
                    </label>
                    <div className="relative">
                      <select
                        id="secondaryPlatform"
                        value={secondaryPlatform}
                        onChange={(e) => setSecondaryPlatform(e.target.value)}
                        className="border border-[#e8e6f0] focus:border-brand-pink rounded-xl p-3 text-xs w-full outline-none appearance-none bg-white text-[#1a1a2e] pr-8 cursor-pointer"
                      >
                        <option value="None">None</option>
                        <option value="Instagram">Instagram</option>
                        <option value="TikTok">TikTok</option>
                        <option value="YouTube">YouTube</option>
                        <option value="Twitter">Twitter / X</option>
                      </select>
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#7a7a9a]">
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fee Request */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="feeRequest" className="text-xs font-bold text-[#1a1a2e]">
                    Fee request (₦) *
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-xs text-[#7a7a9a] select-none font-medium">
                      ₦
                    </span>
                    <input
                      id="feeRequest"
                      type="text"
                      value={feeRequest}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        if (val) {
                          setFeeRequest(Number(val).toLocaleString('en-US'));
                        } else {
                          setFeeRequest('');
                        }
                      }}
                      placeholder="Enter amount"
                      className="border border-[#e8e6f0] focus:border-brand-pink focus:ring-1 focus:ring-brand-pink/30 rounded-xl p-3 pl-7 text-xs w-full outline-none transition-all placeholder:text-[#9a99b0] text-[#1a1a2e]"
                    />
                  </div>
                </div>

                {/* Comments / Questions */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="comments" className="text-xs font-bold text-[#1a1a2e]">
                    Question/Comments(Optional)
                  </label>
                  <textarea
                    id="comments"
                    rows={3}
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Comments or questions regarding the campaign for the advertiser to answer (e.g. How long is the campaign?)"
                    className="border border-[#e8e6f0] focus:border-brand-pink focus:ring-1 focus:ring-brand-pink/30 rounded-xl p-3 text-xs w-full outline-none transition-all placeholder:text-[#9a99b0] text-[#1a1a2e] resize-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Escrow Protected Card */}
              <div className="border border-pink-200 bg-pink-50/15 rounded-2xl p-4 flex gap-3.5 items-start mt-2">
                <div className="w-8 h-8 rounded-full bg-[#fdf2f6] flex items-center justify-center shrink-0">
                  <Shield size={16} className="text-brand-pink" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <h4 className="text-xs font-bold text-brand-pink">Escrow Protected</h4>
                  <p className="text-[11px] font-extralight text-[#7a7a9a] leading-relaxed mt-1">
                    Brand payment confirmed in escrow before you receive the campaign. No work
                    before payment is secured.
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                onClick={() => {
                  if (isFormValid) {
                    setDrawerMode('success');
                  }
                }}
                disabled={!isFormValid}
                className={cn(
                  'w-full text-white font-semibold text-[15px] py-6.5 rounded-xl transition-all select-none border-none shrink-0 mt-2 flex items-center justify-center gap-1.5 shadow-md',
                  isFormValid
                    ? 'bg-brand-pink hover:bg-brand-pink/95 shadow-[0_6px_22px_rgba(215,23,111,0.22)] active:scale-[0.99] cursor-pointer'
                    : 'bg-zinc-200 hover:bg-zinc-200 text-zinc-400 cursor-not-allowed shadow-none',
                )}
              >
                <span>Submit application</span>
                <svg
                  className="w-4 h-4 animate-pulse"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Button>
            </div>
          </>
        )}

        {drawerMode === 'success' && (
          <>
            {/* Success Sticky Header */}
            <div className="sticky top-0 bg-white py-4.5 px-5 flex items-center justify-end z-20 shrink-0">
              <button
                onClick={handleClose}
                className="text-[#7a7a9a] hover:text-[#1a1a2e] transition-colors focus:outline-none"
                aria-label="Close success screen"
              >
                <X size={18} />
              </button>
            </div>

            {/* Success Body */}
            <div className="flex-1 flex flex-col items-center py-6 px-8 text-center my-auto min-h-[350px]">
              <div className="w-20 h-20 rounded-full border border-[#00c37b]/25 bg-[#00c37b]/5 flex items-center justify-center text-[#00c37b] mb-6 shadow-sm">
                <Check size={32} className="stroke-[2.5]" />
              </div>

              <h3 className="text-xl font-bold text-[#1a1a2e] mb-2 select-none">
                You&apos;re in the running!
              </h3>

              <p className="text-xs font-light text-[#7a7a9a] leading-relaxed max-w-[340px] mb-8">
                The brand reviews all applications after the 48-hour window closes. You&apos;ll get
                a push + email notification with the result.
              </p>

              {/* Progress Timeline List */}
              <div className="w-full max-w-[280px] text-left flex flex-col gap-6 pl-8 ml-3 border-l border-[#e8e6f0]/80 relative mb-8">
                {/* Step 1: Application Received */}
                <div className="relative">
                  <div className="absolute -left-[42px] top-0.5 w-5 h-5 rounded-full bg-[#00c37b] border-2 border-white flex items-center justify-center text-white select-none">
                    <Check size={10} className="stroke-[3]" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <h4 className="text-xs font-bold text-[#1a1a2e]">Application Received</h4>
                    <span className="text-[10px] text-[#9a99b0] font-light mt-0.5">Now</span>
                  </div>
                </div>

                {/* Step 2: 48hr Window Closes */}
                <div className="relative">
                  <div className="absolute -left-[42px] top-0.5 w-5 h-5 rounded-full bg-[#e8e6f0] border-2 border-white flex items-center justify-center text-[#9a99b0] select-none">
                    <div className="w-1.5 h-1.5 bg-[#9a99b0] rounded-full" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <h4 className="text-xs font-bold text-[#1a1a2e]">48hr Window Closes</h4>
                    <span className="text-[10px] text-[#9a99b0] font-light mt-0.5">
                      Application deadline
                    </span>
                  </div>
                </div>

                {/* Step 3: Brand Selects Creators */}
                <div className="relative">
                  <div className="absolute -left-[42px] top-0.5 w-5 h-5 rounded-full bg-[#e8e6f0] border-2 border-white flex items-center justify-center text-[#9a99b0] select-none">
                    <div className="w-1.5 h-1.5 bg-[#9a99b0] rounded-full" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <h4 className="text-xs font-bold text-[#1a1a2e]">Brand Selects Creators</h4>
                    <span className="text-[10px] text-[#9a99b0] font-light mt-0.5">
                      Within 48hrs of close
                    </span>
                  </div>
                </div>

                {/* Step 4: Escrow Confirmed -> Work Begins */}
                <div className="relative">
                  <div className="absolute -left-[42px] top-0.5 w-5 h-5 rounded-full bg-[#e8e6f0] border-2 border-white flex items-center justify-center text-[#9a99b0] select-none">
                    <div className="w-1.5 h-1.5 bg-[#9a99b0] rounded-full" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <h4 className="text-xs font-bold text-[#1a1a2e]">
                      Escrow Confirmed &rarr; Work Begins
                    </h4>
                    <span className="text-[10px] text-[#9a99b0] font-light mt-0.5">
                      After brand confirmed
                    </span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleClose}
                className="w-full max-w-[280px] bg-brand-pink text-white font-semibold text-[15px] py-6.5 rounded-xl hover:bg-brand-pink/95 shadow-[0_6px_22px_rgba(215,23,111,0.22)] active:scale-[0.99] transition-all border-none"
              >
                Back to campaigns
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
