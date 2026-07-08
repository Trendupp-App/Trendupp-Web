'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Clock, Check, ChevronLeft, AlertCircle, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WorkCampaign } from './WorkCampaignCard';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useRaiseDispute } from '@/hooks/useDisputes';

interface WorkDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: WorkCampaign | null;
  onSubmitLink?: (campaign: WorkCampaign) => void;
  onSubmitProof?: (campaign: WorkCampaign) => void;
}

type DrawerTab = 'Overview' | 'Requirements' | 'Timeline' | 'Deliverables';

export default function WorkDetailsDrawer({
  isOpen,
  onClose,
  campaign,
  onSubmitLink,
  onSubmitProof,
}: WorkDetailsDrawerProps) {
  const [activeTab, setActiveTab] = useState<DrawerTab>('Overview');
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');

  const raiseDisputeMutation = useRaiseDispute(() => {
    setIsDisputeModalOpen(false);
    setDisputeReason('');
    onClose();
  });

  const handleRaiseDisputeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeReason.trim() || !campaign) return;
    raiseDisputeMutation.mutate({
      campaignId: campaign.id,
      reason: disputeReason,
    });
  };

  // Lock scrolling when the drawer is open
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

  useEffect(() => {
    if (!isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveTab('Overview');
    }
  }, [isOpen]);

  if (!campaign) return null;

  const tabs: DrawerTab[] = ['Overview', 'Requirements', 'Timeline', 'Deliverables'];

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex justify-end transition-opacity duration-300',
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
      )}
    >
      {/* Backdrop with soft blur */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[3px] transition-all duration-300 ease-out"
        onClick={onClose}
      />

      {/* Slide-out Drawer Panel with Premium Expo Easing */}
      <div
        className={cn(
          'w-full max-w-[560px] h-full bg-white relative z-10 flex flex-col shadow-2xl transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] overflow-y-auto auth-scrollbar pb-6 border-0 border-none select-none',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
        style={{ border: 'none' }}
      >
        {/* Floating Back Chevron Button (Top Left of image) */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-20 bg-black/30 hover:bg-black/55 text-white p-2 rounded-full transition-colors focus:outline-none cursor-pointer"
          aria-label="Back"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Hero Banner Area */}
        <div className="relative w-full h-[220px] shrink-0">
          <Image
            src={campaign.image}
            alt={campaign.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 560px) 100vw, 560px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

          {/* Overlay Content */}
          <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between gap-4">
            <div className="flex flex-col min-w-0">
              <h2 className="text-white text-lg font-bold leading-tight truncate">
                {campaign.title}
              </h2>
              <span className="text-xs text-white/90 font-light mt-1.5 flex items-center gap-1 leading-none">
                {campaign.brand}
              </span>
            </div>

            <span className="bg-[#2563eb] text-white text-[10px] font-bold px-3 py-1.5 rounded-full leading-none uppercase tracking-wider shrink-0 shadow-lg border border-blue-400/20">
              {campaign.status === 'Payment released' ? 'Closed' : campaign.status}
            </span>
          </div>
        </div>

        {/* Clean Stats Row with bottom border */}
        <div className="grid grid-cols-3 py-4 border-b border-[#e8e6f0]/60 text-center select-none shrink-0 bg-[#faf9fc]/40 px-6">
          {/* Fee column */}
          <div className="flex flex-col gap-1 items-center justify-center">
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-extrabold text-brand-pink bg-brand-pink-light w-4.5 h-4.5 rounded-full flex items-center justify-center leading-none">
                ₦
              </span>
              <span className="text-[13px] font-extrabold text-[#1a1a2e]">
                ₦{(campaign.actualAmount ?? 180000).toLocaleString()}
              </span>
            </div>
            <span className="text-[9px] text-[#9a99b0] font-bold uppercase tracking-wider mt-0.5">
              Your Fee
            </span>
          </div>

          {/* Platform column */}
          <div className="flex flex-col gap-1 items-center justify-center">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-brand-pink bg-brand-pink-light px-2 py-0.5 rounded-md leading-none">
                {campaign.platform}
              </span>
            </div>
            <span className="text-[9px] text-[#9a99b0] font-bold uppercase tracking-wider mt-0.5">
              Platform
            </span>
          </div>

          {/* Time Left column */}
          <div className="flex flex-col gap-1 items-center justify-center">
            <div className="flex items-center gap-1.5">
              <Clock size={13} className="text-brand-pink" />
              <span className="text-[13px] font-extrabold text-[#1a1a2e]">{campaign.daysLeft}</span>
            </div>
            <span className="text-[9px] text-[#9a99b0] font-bold uppercase tracking-wider mt-0.5">
              Time Left
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#e8e6f0]/60 px-6 mt-4 shrink-0 bg-white">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'flex-1 text-center pb-2.5 text-xs font-bold transition-all border-b-2 focus:outline-none cursor-pointer',
                activeTab === tab
                  ? 'border-brand-pink text-brand-pink'
                  : 'border-transparent text-[#7a7a9a] hover:text-[#5a5a7a]',
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="px-6 py-6 flex-1 overflow-y-auto">
          {/* 1. Overview */}
          {activeTab === 'Overview' && (
            <div className="flex flex-col gap-6 text-left">
              {/* About Brief */}
              <div className="flex flex-col gap-2.5">
                <h3 className="text-xs font-extrabold text-[#1a1a2e] uppercase tracking-wider">
                  About Campaign Brief
                </h3>
                <p className="text-xs font-light text-[#5a5a7a] leading-relaxed">
                  Zara Africa is launching its Summer 2026 collection across West Africa. We want
                  authentic creators to showcase our new arrivals in an aspirational but relatable
                  way — think Lagos street style meets global fashion week energy.
                </p>
              </div>

              {/* Deliverables with pink circle indexes */}
              <div className="flex flex-col gap-3">
                <h3 className="text-xs font-extrabold text-[#1a1a2e] uppercase tracking-wider">
                  Deliverables
                </h3>
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#fcecf3] text-brand-pink flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      1
                    </div>
                    <span className="text-xs text-[#5a5a7a] font-light leading-relaxed">
                      1 x Instagram carousel post (5-8 slides) featuring the outfits
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#fcecf3] text-brand-pink flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      2
                    </div>
                    <span className="text-xs text-[#5a5a7a] font-light leading-relaxed">
                      1 x Instagram Reel (30-60 seconds) styling tutorial
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#fcecf3] text-brand-pink flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      3
                    </div>
                    <span className="text-xs text-[#5a5a7a] font-light leading-relaxed">
                      3 x Instagram Stories with product tags
                    </span>
                  </div>
                </div>
              </div>

              {/* Content Direction outline card */}
              <div className="border border-brand-pink/30 rounded-2xl p-4 flex flex-col gap-3.5 bg-white text-left">
                <span className="text-xs font-bold text-brand-pink flex items-center gap-1.5">
                  ➔ Content Direction
                </span>
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#fcecf3] text-brand-pink flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      1
                    </div>
                    <span className="text-xs text-[#5a5a7a] font-light leading-relaxed">
                      Dramatic before and after revealing the collection&apos;s impact.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#fcecf3] text-brand-pink flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      2
                    </div>
                    <span className="text-xs text-[#5a5a7a] font-light leading-relaxed">
                      Incorporate the hair styling seamlessly into your beauty routine.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#fcecf3] text-brand-pink flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      3
                    </div>
                    <span className="text-xs text-[#5a5a7a] font-light leading-relaxed">
                      Step-by-step guide to achieving an effortless, elegant look.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. Requirements */}
          {activeTab === 'Requirements' && (
            <div className="flex flex-col gap-6 text-left">
              {/* Content Guidelines */}
              <div className="flex flex-col gap-3">
                <h3 className="text-xs font-extrabold text-[#1a1a2e] uppercase tracking-wider">
                  Content Guidelines (Brand Rules)
                </h3>
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#f0fdf4] border border-[#dcfce7] text-[#16a34a] flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={11} strokeWidth={3} />
                    </div>
                    <span className="text-xs text-[#5a5a7a] font-light leading-relaxed">
                      Ensure high-visibility, natural or soft white lighting.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#f0fdf4] border border-[#dcfce7] text-[#16a34a] flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={11} strokeWidth={3} />
                    </div>
                    <span className="text-xs text-[#5a5a7a] font-light leading-relaxed">
                      Tag @ZaraAfrica in the caption and on the video.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#fef2f2] border border-[#fee2e2] text-[#dc2626] flex items-center justify-center shrink-0 mt-0.5">
                      <X size={11} strokeWidth={3} />
                    </div>
                    <span className="text-xs text-[#5a5a7a] font-light leading-relaxed">
                      Do not feature or mention competitor hair brands.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#fef2f2] border border-[#fee2e2] text-[#dc2626] flex items-center justify-center shrink-0 mt-0.5">
                      <X size={11} strokeWidth={3} />
                    </div>
                    <span className="text-xs text-[#5a5a7a] font-light leading-relaxed">
                      Avoid cluttered backgrounds; maintain an editorial aesthetic.
                    </span>
                  </div>
                </div>
              </div>

              {/* Usage Rights amber card */}
              <div className="border border-amber-500/20 bg-amber-50/20 rounded-2xl p-4 flex flex-col gap-2 text-left">
                <span className="text-xs font-bold text-amber-700 flex items-center gap-1.5">
                  <AlertCircle size={14} />
                  Usage Rights
                </span>
                <p className="text-[11px] text-[#7a7a9a] leading-relaxed">
                  By participating in this campaign, creators grant Zara Africa permission to repost
                  and use campaign content across its digital platforms for marketing and
                  promotional purposes.
                </p>
              </div>

              {/* Success Looks Like */}
              <div className="border border-[#e8e6f0] rounded-2xl p-4 flex flex-col gap-2 text-left bg-[#fcfcfd]">
                <span className="text-xs font-bold text-[#1a1a2e] flex items-center gap-1.5">
                  <span className="text-brand-pink text-sm">♥</span> Success Looks Like
                </span>
                <p className="text-[11px] text-[#5a5a7a] leading-relaxed">
                  We are looking for content that feels authentic, relatable, visually appealing,
                  and inspires women to explore the new SWW Hair Collection. We are excited to
                  collaborate with you and can&apos;t wait to see your creativity bring the SWW Hair
                  Collection to life.
                </p>
              </div>
            </div>
          )}

          {/* 3. Timeline */}
          {activeTab === 'Timeline' && (
            <div className="flex flex-col gap-5 text-left">
              <h3 className="text-xs font-extrabold text-[#1a1a2e] uppercase tracking-wider">
                Campaign Timeline
              </h3>

              <div className="relative pl-7 ml-3 flex flex-col gap-6 py-2">
                {/* Vertical Lines */}
                <div className="absolute left-[9px] top-4 bottom-4 w-[2px] bg-[#e8e6f0]" />
                <div className="absolute left-[9px] top-4 h-[28px] w-[2px] bg-[#16a34a]" />

                {/* Step 1 */}
                <div className="relative">
                  <span className="absolute -left-[23px] top-0.5 w-[20px] h-[20px] rounded-full bg-[#dcfce7] border border-[#dcfce7] text-[#16a34a] flex items-center justify-center shadow-sm">
                    <Check size={11} strokeWidth={3} />
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-[#1a1a2e]">Brief issued</span>
                    <span className="text-[10px] font-light text-[#7a7a9a]">May 28, 2026</span>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative">
                  <span className="absolute -left-[23px] top-0.5 w-[20px] h-[20px] rounded-full bg-[#dcfce7] border border-[#dcfce7] text-[#16a34a] flex items-center justify-center shadow-sm">
                    <Check size={11} strokeWidth={3} />
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-[#1a1a2e]">Escrow confirmed</span>
                    <span className="text-[10px] font-light text-[#7a7a9a]">May 30, 2026</span>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative">
                  <span className="absolute -left-[23px] top-0.5 w-[20px] h-[20px] rounded-full bg-[#f4f3f6] text-[#9a99b0] flex items-center justify-center shadow-sm">
                    <Clock size={11} />
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold text-[#5a5a7a]">
                      Content submission deadline
                    </span>
                    <span className="text-[10px] font-light text-[#9a99b0]">June 5, 2026</span>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="relative">
                  <span className="absolute -left-[23px] top-0.5 w-[20px] h-[20px] rounded-full bg-[#f4f3f6] text-[#9a99b0] flex items-center justify-center shadow-sm">
                    <Clock size={11} />
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold text-[#5a5a7a]">Brand review (48h)</span>
                    <span className="text-[10px] font-light text-[#9a99b0]">June 7, 2026</span>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="relative">
                  <span className="absolute -left-[23px] top-0.5 w-[20px] h-[20px] rounded-full bg-[#f4f3f6] text-[#9a99b0] flex items-center justify-center shadow-sm">
                    <Clock size={11} />
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold text-[#5a5a7a]">Post live deadline</span>
                    <span className="text-[10px] font-light text-[#9a99b0]">June 10, 2026</span>
                  </div>
                </div>

                {/* Step 6 */}
                <div className="relative">
                  <span className="absolute -left-[23px] top-0.5 w-[20px] h-[20px] rounded-full bg-[#f4f3f6] text-[#9a99b0] flex items-center justify-center shadow-sm">
                    <Clock size={11} />
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold text-[#5a5a7a]">Payment release</span>
                    <span className="text-[10px] font-light text-[#9a99b0]">June 11, 2026</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. Deliverables */}
          {activeTab === 'Deliverables' && (
            <div className="flex flex-col gap-4 text-left">
              {/* always show Brand Reply */}
              <div className="border border-dashed border-[#2563eb]/60 rounded-2xl p-4 flex flex-col gap-1.5 bg-[#f8faff] text-left">
                <span className="text-xs font-bold text-[#2563eb]">Brand Reply</span>
                <p className="text-[11px] text-[#5a5a7a] font-light leading-relaxed italic">
                  &quot;Shot at Lekki beach during golden hour. Used trending audio. Caption ideas
                  included in the doc.&quot;
                </p>
              </div>

              {/* always show Content Guidelines Reminder */}
              <div className="bg-[#f3f0ff] border border-[#e9e3ff] rounded-2xl p-4 flex flex-col gap-1.5 text-left">
                <span className="text-xs font-bold text-[#6b21a8]">
                  Content Guidelines Reminder
                </span>
                <p className="text-[11px] text-[#5a5a7a] font-light leading-relaxed">
                  Create your content off-platform, then return to submit the link for brand review.
                  Keep your content within the brief guidelines. Submit content within the next 3-5
                  days.
                </p>
              </div>

              {/* conditionally show Content Link (if Under review, Revision requested, Approved, Payment released) */}
              {['Under review', 'Revision requested', 'Approved', 'Payment released'].includes(
                campaign.status,
              ) && (
                <div className="border border-[#e8e6f0] rounded-2xl p-4 flex flex-col gap-1.5 text-left bg-white shadow-sm">
                  <span className="text-xs font-bold text-[#1a1a2e]">Content Link</span>
                  <a
                    href="https://drive.google.com/file/d/amara-summer-style-reel"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11.5px] text-[#2563eb] hover:underline flex items-center gap-1 font-medium"
                  >
                    drive.google.com/file/d/amara-summer-style-reel
                    <span className="text-[10px]">↗</span>
                  </a>
                  <p className="text-[11px] text-[#7a7a9a] font-light leading-relaxed mt-0.5">
                    &quot;Shot at Lekki beach during golden hour. Used trending audio. Caption ideas
                    included in the doc.&quot;
                  </p>
                </div>
              )}

              {/* conditionally show Brand Revision Request (if Revision requested) */}
              {campaign.status === 'Revision requested' && (
                <div className="border border-amber-500/20 bg-amber-50/20 rounded-2xl p-4 flex flex-col gap-1.5 text-left">
                  <span className="text-xs font-bold text-amber-700 flex items-center gap-1.5">
                    <AlertCircle size={14} />
                    Brand Revision Request
                  </span>
                  <p className="text-[11px] text-[#7a7a9a] font-light leading-relaxed italic">
                    &quot;
                    {campaign.revisionComment ??
                      'The video needs to clearly show the front camera quality. Please reshoot the selfie segment with better lighting. Duration should be exactly 45 seconds.'}
                    &quot;
                  </p>
                </div>
              )}

              {/* conditionally show Content Approved! (if Approved, Payment released) */}
              {['Approved', 'Payment released'].includes(campaign.status) && (
                <div className="bg-[#fff0f5] border border-[#fcecf3] rounded-2xl p-4 flex flex-col gap-1.5 text-left">
                  <span className="text-xs font-bold text-brand-pink">✔ Content Approved!</span>
                  <p className="text-[11px] text-[#7a7a9a] font-light leading-relaxed">
                    Publish your content on <span className="font-bold">YouTube</span>, then come
                    back to submit proof of posting. The post must stay live for{' '}
                    <span className="font-bold">24 hours</span> before payment is released.
                  </p>
                </div>
              )}

              {/* conditionally show Live Content (if Payment released) */}
              {campaign.status === 'Payment released' && (
                <div className="border border-[#e8e6f0] rounded-2xl p-4 flex flex-col gap-2.5 text-left bg-white shadow-sm">
                  <span className="text-xs font-bold text-[#1a1a2e]">Live Content</span>
                  <a
                    href="https://youtube.com/shorts/Rh_Iz9giGkE"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11.5px] text-[#2563eb] hover:underline flex items-center gap-1 font-medium"
                  >
                    https://youtube.com/shorts/Rh_Iz9giGkE?...
                    <span className="text-[10px]">↗</span>
                  </a>
                  <div className="flex">
                    <span className="text-[10px] font-bold text-[#16a34a] bg-[#dcfce7] px-2.5 py-1 rounded-full flex items-center gap-1 leading-none">
                      ✔ Post live
                    </span>
                  </div>
                </div>
              )}

              {/* bottom action button wrapper */}
              {campaign.status === 'In progress' && (
                <button
                  onClick={() => onSubmitLink?.(campaign)}
                  className="w-full bg-brand-pink hover:bg-brand-pink/90 text-white font-bold text-xs py-3.5 rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer mt-4"
                >
                  Submit content link
                </button>
              )}

              {campaign.status === 'Revision requested' && (
                <button
                  onClick={() => onSubmitLink?.(campaign)}
                  className="w-full border border-[#2563eb] bg-[#f8faff] hover:bg-[#eff4ff] text-[#2563eb] font-bold text-xs py-3.5 rounded-2xl transition-all active:scale-95 cursor-pointer mt-4"
                >
                  Submit revised content
                </button>
              )}

              {campaign.status === 'Approved' && (
                <button
                  onClick={() => onSubmitProof?.(campaign)}
                  className="w-full bg-brand-pink hover:bg-brand-pink/90 text-white font-bold text-xs py-3.5 rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer mt-4"
                >
                  Submit Proof of Posting
                </button>
              )}

              {/* Raise Dispute Button */}
              {campaign.status !== 'Payment released' && (
                <button
                  onClick={() => setIsDisputeModalOpen(true)}
                  className="w-full border border-red-200 bg-red-50/50 hover:bg-red-50 text-red-600 font-bold text-xs py-3.5 rounded-2xl transition-all active:scale-95 cursor-pointer mt-4 flex items-center justify-center gap-1.5"
                >
                  <AlertCircle size={14} />
                  Raise a Dispute
                </button>
              )}
            </div>
          )}
          {/* Floating Chat/Message Icon (Bottom Right of white scrollable content area) */}
          <button
            onClick={() => {
              onClose();
              window.location.href = '/creator/messages';
            }}
            className="absolute bottom-6 right-6 z-30 w-11 h-11 bg-brand-pink hover:bg-brand-pink/90 text-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Chat with Trendupp Support"
          >
            <MessageCircle size={20} className="fill-current text-white" />
          </button>
        </div>
      </div>

      {/* Raise Dispute Modal Dialog */}
      <Dialog
        open={isDisputeModalOpen}
        onOpenChange={(open) => !open && setIsDisputeModalOpen(false)}
      >
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-[420px] rounded-[24px] bg-white border border-[#e8e6f0]/60 p-6 flex flex-col gap-5 shadow-xl select-none"
        >
          <div className="flex justify-between items-start">
            <DialogTitle className="text-[17px] font-bold text-[#1a1a2e]">
              Raise a Campaign Dispute
            </DialogTitle>
            <button
              onClick={() => setIsDisputeModalOpen(false)}
              className="w-7 h-7 rounded-full bg-[#f4f4f8] hover:bg-[#eaeaf0] flex items-center justify-center text-[#7a7a9a] transition-colors border-none cursor-pointer"
            >
              <X size={15} />
            </button>
          </div>

          <div className="bg-[#eff6ff] border border-[#dbeafe] rounded-2xl p-4 flex gap-3 text-left">
            <AlertCircle className="w-5 h-5 text-[#2563eb] shrink-0 mt-0.5" />
            <span className="text-[11px] font-medium text-[#1e40af] leading-relaxed">
              Disputing this campaign will notify Trendupp administrators. They will review the case
              details and mediate communication between you and the brand.
            </span>
          </div>

          <form onSubmit={handleRaiseDisputeSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider">
                Reason for Dispute
              </Label>
              <Textarea
                placeholder="Describe the issue in detail (e.g. brand is unresponsive, terms of brief have changed, etc.)..."
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                className="border-[#e8e6f0] text-xs font-light min-h-[100px] focus-visible:ring-brand-pink/30 focus-visible:border-brand-pink rounded-xl p-3 resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={!disputeReason.trim() || raiseDisputeMutation.isPending}
              className="w-full bg-brand-pink hover:bg-brand-pink/90 text-white font-semibold text-xs h-11 rounded-2xl shadow-md transition-all active:scale-95 disabled:bg-brand-pink/50 cursor-pointer"
            >
              {raiseDisputeMutation.isPending ? 'Raising...' : 'Submit Dispute'}
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
