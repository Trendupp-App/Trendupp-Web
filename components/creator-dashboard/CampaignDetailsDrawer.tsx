'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Clock, Shield, Check, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCampaignPlatforms, useApplyCampaign } from '@/hooks/useCampaign';
import { Portal } from '@/components/ui/portal';

export interface MappedCampaign {
  id: string;
  title: string;
  brand: string;
  budget: string;
  daysLeft: string;
  tier: string;
  appliedCount: number;
  image: string;
  niches?: string[];
  platforms?: string[];
  campaignBrief?: string;
  deliverables?: string[];
  contentDirection?: string[];
  contentGuidelines?: { dos: string[]; donts: string[] };
  usageRights?: string;
  successLooksLike?: string;
  status?: string;
  createdAt?: string;
  timeline?: string;
}

interface CampaignDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: MappedCampaign | null;
}

type TabType = 'overview' | 'requirements' | 'timeline';

export default function CampaignDetailsDrawer({
  isOpen,
  onClose,
  campaign,
}: CampaignDetailsDrawerProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [drawerMode, setDrawerMode] = useState<'details' | 'apply' | 'success'>('details');
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    setCurrentDate(isOpen ? new Date() : null);
  }

  const [contentTitle, setContentTitle] = useState('');
  const [workLink, setWorkLink] = useState('');
  const [primaryPlatform, setPrimaryPlatform] = useState('Instagram');
  const [secondaryPlatform, setSecondaryPlatform] = useState('None');
  const [feeRequest, setFeeRequest] = useState('');
  const [comments, setComments] = useState('');

  const { data: platformsList = [] } = useCampaignPlatforms();

  const applyMutation = useApplyCampaign(() => {
    setDrawerMode('success');
  });

  const getPlatformIdByName = (name: string) => {
    if (name === 'None') return undefined;
    const normalizedSelected = name.toLowerCase().trim();
    const found = platformsList.find((p) => {
      const pName = p.name.toLowerCase().trim();
      return (
        pName === normalizedSelected ||
        pName.includes(normalizedSelected) ||
        normalizedSelected.includes(pName) ||
        (normalizedSelected === 'twitter' && pName.includes('twitter')) ||
        (normalizedSelected === 'twitter' && pName.includes('x'))
      );
    });
    return found?.id;
  };

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

  const handleSubmit = () => {
    if (!isFormValid || !campaign) return;
    const primaryId = getPlatformIdByName(primaryPlatform);
    const secondaryId = getPlatformIdByName(secondaryPlatform);
    const fallbackId = platformsList[0]?.id || '';

    applyMutation.mutate({
      id: campaign.id,
      payload: {
        contentIdea: contentTitle,
        pastWorkLink: workLink || undefined,
        primaryPlatformId: primaryId || fallbackId,
        secondaryPlatformId: secondaryId,
        feeRequest: Number(feeRequest.replace(/[^0-9]/g, '')),
        comments: comments || undefined,
      },
    });
  };

  const formatDate = (date?: Date | string | null) => {
    if (!date) return '';
    try {
      const d = date instanceof Date ? date : new Date(date);
      const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];
      return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
    } catch {
      return '';
    }
  };

  const getTimelineDates = () => {
    if (!campaign)
      return {
        briefIssued: '',
        escrowConfirmed: '',
        contentDeadline: '',
        brandReview: '',
        postLive: '',
        paymentRelease: '',
      };
    const created = campaign.createdAt ? new Date(campaign.createdAt) : new Date();
    const deadline = campaign.timeline
      ? new Date(campaign.timeline)
      : new Date(created.getTime() + 14 * 24 * 60 * 60 * 1000);

    const diff = deadline.getTime() - created.getTime();
    const stepDuration = diff / 5;

    return {
      briefIssued: formatDate(created),
      escrowConfirmed: formatDate(new Date(created.getTime() + stepDuration * 0.5)),
      contentDeadline: formatDate(new Date(created.getTime() + stepDuration * 2)),
      brandReview: formatDate(new Date(created.getTime() + stepDuration * 3)),
      postLive: formatDate(new Date(created.getTime() + stepDuration * 4.5)),
      paymentRelease: formatDate(deadline),
    };
  };

  const timelineDates = getTimelineDates();

  const isTimelineStepCompleted = (stepIndex: number) => {
    if (!campaign) return false;
    if (campaign.status === 'past' || campaign.status === 'completed') return true;
    if (stepIndex <= 2) return true; // Brief & Escrow are always completed for live campaigns
    if (!currentDate) return false;

    const created = campaign.createdAt ? new Date(campaign.createdAt) : new Date();
    const deadline = campaign.timeline
      ? new Date(campaign.timeline)
      : new Date(created.getTime() + 14 * 24 * 60 * 60 * 1000);
    const diff = deadline.getTime() - created.getTime();
    const stepDuration = diff / 5;

    let stepTime = created.getTime();
    if (stepIndex === 3) stepTime = created.getTime() + stepDuration * 2;
    if (stepIndex === 4) stepTime = created.getTime() + stepDuration * 3;
    if (stepIndex === 5) stepTime = created.getTime() + stepDuration * 4.5;
    if (stepIndex === 6) stepTime = deadline.getTime();

    return currentDate.getTime() > stepTime;
  };

  if (!campaign) return null;

  return (
    <Portal>
      <div
        className={cn(
          'fixed inset-0 z-50 flex justify-end transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-[3px] transition-all duration-300 ease-out"
          onClick={handleClose}
        />

        {/* Slide-out Drawer Panel */}
        <div
          className={cn(
            'w-full max-w-[560px] h-full bg-white relative z-10 flex flex-col shadow-2xl transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] overflow-y-auto auth-scrollbar pb-6 border-0 border-none',
            isOpen ? 'translate-x-0' : 'translate-x-full',
          )}
          style={{ border: 'none' }}
        >
          {drawerMode === 'details' && (
            <>
              {/* Left Back circle icon to close the drawer */}
              <button
                onClick={handleClose}
                className="absolute top-4 left-4 z-20 bg-black/40 text-white w-9 h-9 rounded-full hover:bg-black/60 flex items-center justify-center transition-colors focus:outline-none border-none cursor-pointer"
                aria-label="Back"
              >
                <ArrowLeft size={16} />
              </button>

              {/* Hero image header banner */}
              <div className="relative h-[240px] w-full shrink-0 bg-zinc-100">
                <Image src={campaign.image} alt={campaign.title} fill className="object-cover" />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-5">
                  <div className="flex flex-col gap-0.5 text-white pr-20 pb-1">
                    <h3 className="text-xl font-bold leading-tight">{campaign.title}</h3>
                    <p className="text-[11px] text-white/70 font-light mt-1.5 flex items-center gap-1.5">
                      <span>{campaign.brand}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} className="text-white/75" />
                        {campaign.daysLeft}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="p-5 flex flex-col gap-6">
                {/* Metadata Statistics Row */}
                <div className="flex items-center gap-2.5 w-full shrink-0">
                  {/* Budget card */}
                  <div className="bg-white border border-[#e8e6f0]/60 rounded-[18px] p-3.5 flex flex-col items-center justify-center text-center gap-1 flex-1 shadow-xs">
                    <span className="text-[10px] text-[#7a7a9a] font-medium leading-none">
                      Budget Range
                    </span>
                    <span className="text-xs font-bold text-brand-pink leading-none mt-0.5 break-all">
                      {campaign.budget}
                    </span>
                  </div>
                  {/* Applied card */}
                  <div className="bg-white border border-[#e8e6f0]/60 rounded-[18px] p-3.5 flex flex-col items-center justify-center text-center gap-1 flex-1 shadow-xs">
                    <span className="text-[10px] text-[#7a7a9a] font-medium leading-none">
                      Applied
                    </span>
                    <span className="text-xs font-bold text-[#1a1a2e] leading-none mt-0.5">
                      {campaign.appliedCount}
                    </span>
                  </div>
                  {/* Deadline card */}
                  <div className="bg-white border border-[#e8e6f0]/60 rounded-[18px] p-3.5 flex flex-col items-center justify-center text-center gap-1 flex-1 shadow-xs">
                    <span className="text-[10px] text-[#7a7a9a] font-medium leading-none">
                      Deadline
                    </span>
                    <span className="text-xs font-bold text-brand-pink leading-none mt-0.5 flex items-center gap-1">
                      <Clock size={12} className="text-brand-pink" />
                      {campaign.daysLeft}
                    </span>
                  </div>
                </div>

                {/* Navigation Underlined Tabs */}
                <div className="border-b border-[#e8e6f0]/50 flex w-full text-[13px] font-medium text-[#9a99b0] shrink-0 mb-1 select-none">
                  {(['overview', 'requirements', 'timeline'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={cn(
                        'flex-1 text-center py-2.5 capitalize transition-all focus:outline-none cursor-pointer',
                        activeTab === tab
                          ? 'text-brand-pink font-semibold border-b-2 border-brand-pink'
                          : 'hover:text-[#5a5a7a]',
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
                      {/* Pink labels */}
                      <div className="flex flex-col gap-1">
                        <div className="text-xs text-[#1a1a2e]">
                          <span className="text-brand-pink font-semibold">Campaign Title • </span>
                          <span className="font-bold">{campaign.title}</span>
                        </div>
                        <div className="text-xs text-[#1a1a2e] mt-0.5">
                          <span className="text-brand-pink font-semibold">Brand - </span>
                          <span className="font-bold">{campaign.brand}</span>
                        </div>
                      </div>

                      {/* Info cards grid: Niche, Platform, Creator Tier */}
                      <div className="grid grid-cols-3 gap-2.5 w-full">
                        <div className="bg-white border border-[#e8e6f0]/60 rounded-xl p-3.5 flex flex-col gap-1 min-w-0">
                          <span className="text-[10px] text-[#9a99b0] font-light leading-none">
                            Niche
                          </span>
                          <span className="text-xs font-bold text-[#1a1a2e] leading-none mt-0.5 truncate">
                            {campaign.niches?.[0] ?? 'Fashion'}
                          </span>
                        </div>
                        <div className="bg-white border border-[#e8e6f0]/60 rounded-xl p-3.5 flex flex-col gap-1 min-w-0">
                          <span className="text-[10px] text-[#9a99b0] font-light leading-none">
                            Platform
                          </span>
                          <div className="flex items-center gap-1 mt-0.5 min-w-0">
                            <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white shrink-0">
                              <div className="w-1.5 h-1.5 rounded-full border border-white" />
                            </div>
                            <span className="text-xs font-bold text-[#1a1a2e] leading-none truncate">
                              {campaign.platforms?.[0] ?? 'Instagram'}
                            </span>
                          </div>
                        </div>
                        <div className="bg-white border border-[#e8e6f0]/60 rounded-xl p-3.5 flex flex-col gap-1 min-w-0">
                          <span className="text-[10px] text-[#9a99b0] font-light leading-none">
                            Creator Tier
                          </span>
                          <span className="text-xs font-bold text-[#1a1a2e] leading-none mt-0.5 truncate">
                            {campaign.tier}
                          </span>
                        </div>
                      </div>

                      {/* Campaign Brief */}
                      <div className="flex flex-col gap-2.5">
                        <h4 className="text-[13px] font-bold text-[#1a1a2e]">Campaign Brief</h4>
                        <p className="text-xs font-light text-[#5a5a7a] leading-relaxed">
                          {campaign.campaignBrief || 'No brief provided.'}
                        </p>
                      </div>

                      {/* Deliverables */}
                      {campaign.deliverables && campaign.deliverables.length > 0 && (
                        <div className="flex flex-col gap-3">
                          <h4 className="text-[13px] font-bold text-[#1a1a2e]">Deliverables</h4>
                          <div className="flex flex-col gap-3">
                            {campaign.deliverables.map((item, index) => (
                              <div key={index} className="flex gap-3 items-start">
                                <div className="w-5 h-5 rounded-[4px] bg-[#d7176f] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                                  {index + 1}
                                </div>
                                <span className="text-xs font-light text-[#5a5a7a] leading-relaxed">
                                  {item}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Content Direction */}
                      {campaign.contentDirection && campaign.contentDirection.length > 0 && (
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[#d7176f] text-xs font-bold leading-none">➔</span>
                            <h4 className="text-[13px] font-bold text-[#1a1a2e]">
                              Content Direction
                            </h4>
                          </div>
                          <div className="flex flex-col gap-3">
                            {campaign.contentDirection.map((item, index) => (
                              <div key={index} className="flex gap-3 items-start">
                                <div className="w-5 h-5 rounded-[4px] bg-[#d7176f]/10 text-[#d7176f] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                                  {index + 1}
                                </div>
                                <span className="text-xs font-light text-[#5a5a7a] leading-relaxed">
                                  {item}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Escrow Protected Card */}
                      <div className="border border-[#e8e6f0]/80 bg-white rounded-2xl p-4 flex gap-3.5 items-start mt-1">
                        <div className="w-8 h-8 rounded-full bg-[#fdf2f6] flex items-center justify-center shrink-0">
                          <Shield size={16} className="text-brand-pink" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <h4 className="text-xs font-bold text-[#1a1a2e]">Escrow Protected</h4>
                          <p className="text-[11px] font-extralight text-[#7a7a9a] leading-relaxed mt-1">
                            Brand payment confirmed in escrow before you receive the campaign. No
                            work before payment is secured.
                          </p>
                        </div>
                      </div>

                      {/* 48-Hour Application Window Card */}
                      <div className="border border-blue-100 bg-[#eff6ff]/35 rounded-2xl p-4 flex gap-3.5 items-start">
                        <div className="w-8 h-8 rounded-full bg-[#eff6ff] flex items-center justify-center shrink-0">
                          <Clock size={16} className="text-[#2563eb]" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <h4 className="text-xs font-bold text-[#2563eb]">
                            48-Hour Application Window
                          </h4>
                          <p className="text-[11px] font-extralight text-[#7a7a9a] leading-relaxed mt-1">
                            This campaign accepts applications for 48 hours only. After the window
                            closes, the brand selects creators. Results are sent within 48 hours of
                            closing.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'requirements' && (
                    <div className="flex flex-col gap-5">
                      {/* Content Guidelines */}
                      {campaign.contentGuidelines && (
                        <div className="flex flex-col gap-3.5">
                          <h4 className="text-[13px] font-bold text-[#1a1a2e]">
                            Content Guidelines (Brand Rules)
                          </h4>
                          <div className="flex flex-col gap-3">
                            {campaign.contentGuidelines.dos?.map((item, index) => (
                              <div key={`do-${index}`} className="flex gap-2.5 items-start">
                                <div className="w-4.5 h-4.5 rounded-full bg-[#00c37b]/10 text-[#00c37b] flex items-center justify-center shrink-0 mt-0.5">
                                  <Check size={11} className="stroke-[3]" />
                                </div>
                                <span className="text-xs font-light text-[#5a5a7a] leading-relaxed">
                                  {item}
                                </span>
                              </div>
                            ))}
                            {campaign.contentGuidelines.donts?.map((item, index) => (
                              <div key={`dont-${index}`} className="flex gap-2.5 items-start">
                                <div className="w-4.5 h-4.5 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0 mt-0.5">
                                  <span className="text-[10px] font-bold">✕</span>
                                </div>
                                <span className="text-xs font-light text-[#5a5a7a] leading-relaxed">
                                  {item}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Usage Rights */}
                      {campaign.usageRights && (
                        <div className="flex flex-col gap-2">
                          <h4 className="text-[13px] font-bold text-[#1a1a2e]">Usage Rights</h4>
                          <p className="text-xs font-light text-[#5a5a7a] leading-relaxed">
                            {campaign.usageRights}
                          </p>
                        </div>
                      )}

                      {/* Success Looks Like */}
                      {campaign.successLooksLike && (
                        <div className="flex flex-col gap-2">
                          <h4 className="text-[13px] font-bold text-[#1a1a2e]">
                            Success Looks Like
                          </h4>
                          <p className="text-xs font-light text-[#5a5a7a] leading-relaxed">
                            {campaign.successLooksLike}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'timeline' && (
                    <div className="flex flex-col gap-5">
                      <h4 className="text-[13px] font-bold text-[#1a1a2e] mb-1">
                        Campaign Timeline
                      </h4>
                      <div className="flex flex-col gap-6 pl-8 ml-3 border-l border-[#e8e6f0]/75 relative select-none">
                        {/* Step 1 */}
                        <div className="relative">
                          {isTimelineStepCompleted(1) ? (
                            <div className="absolute -left-[42px] top-0.5 w-5 h-5 rounded-full bg-[#00c37b] border-2 border-white flex items-center justify-center text-white select-none">
                              <Check size={10} className="stroke-[3]" />
                            </div>
                          ) : (
                            <div className="absolute -left-[42px] top-0.5 w-5 h-5 rounded-full bg-[#e8e6f0] border-2 border-white flex items-center justify-center text-[#9a99b0] select-none">
                              <div className="w-1.5 h-1.5 bg-[#9a99b0] rounded-full" />
                            </div>
                          )}
                          <div className="flex flex-col gap-0.5">
                            <h4 className="text-xs font-bold text-[#1a1a2e]">Brief issued</h4>
                            <span className="text-[10px] text-[#9a99b0] font-light mt-0.5">
                              {timelineDates.briefIssued}
                            </span>
                          </div>
                        </div>

                        {/* Step 2 */}
                        <div className="relative">
                          {isTimelineStepCompleted(2) ? (
                            <div className="absolute -left-[42px] top-0.5 w-5 h-5 rounded-full bg-[#00c37b] border-2 border-white flex items-center justify-center text-white select-none">
                              <Check size={10} className="stroke-[3]" />
                            </div>
                          ) : (
                            <div className="absolute -left-[42px] top-0.5 w-5 h-5 rounded-full bg-[#e8e6f0] border-2 border-white flex items-center justify-center text-[#9a99b0] select-none">
                              <div className="w-1.5 h-1.5 bg-[#9a99b0] rounded-full" />
                            </div>
                          )}
                          <div className="flex flex-col gap-0.5">
                            <h4 className="text-xs font-bold text-[#1a1a2e]">Escrow confirmed</h4>
                            <span className="text-[10px] text-[#9a99b0] font-light mt-0.5">
                              {timelineDates.escrowConfirmed}
                            </span>
                          </div>
                        </div>

                        {/* Step 3 */}
                        <div className="relative">
                          {isTimelineStepCompleted(3) ? (
                            <div className="absolute -left-[42px] top-0.5 w-5 h-5 rounded-full bg-[#00c37b] border-2 border-white flex items-center justify-center text-white select-none">
                              <Check size={10} className="stroke-[3]" />
                            </div>
                          ) : (
                            <div className="absolute -left-[42px] top-0.5 w-5 h-5 rounded-full bg-[#e8e6f0] border-2 border-white flex items-center justify-center text-[#9a99b0] select-none">
                              <div className="w-1.5 h-1.5 bg-[#9a99b0] rounded-full" />
                            </div>
                          )}
                          <div className="flex flex-col gap-0.5">
                            <h4 className="text-xs font-bold text-[#1a1a2e]">Content deadline</h4>
                            <span className="text-[10px] text-[#9a99b0] font-light mt-0.5">
                              {timelineDates.contentDeadline}
                            </span>
                          </div>
                        </div>

                        {/* Step 4 */}
                        <div className="relative">
                          {isTimelineStepCompleted(4) ? (
                            <div className="absolute -left-[42px] top-0.5 w-5 h-5 rounded-full bg-[#00c37b] border-2 border-white flex items-center justify-center text-white select-none">
                              <Check size={10} className="stroke-[3]" />
                            </div>
                          ) : (
                            <div className="absolute -left-[42px] top-0.5 w-5 h-5 rounded-full bg-[#e8e6f0] border-2 border-white flex items-center justify-center text-[#9a99b0] select-none">
                              <div className="w-1.5 h-1.5 bg-[#9a99b0] rounded-full" />
                            </div>
                          )}
                          <div className="flex flex-col gap-0.5">
                            <h4 className="text-xs font-bold text-[#1a1a2e]">Brand review (48h)</h4>
                            <span className="text-[10px] text-[#9a99b0] font-light mt-0.5">
                              {timelineDates.brandReview}
                            </span>
                          </div>
                        </div>

                        {/* Step 5 */}
                        <div className="relative">
                          {isTimelineStepCompleted(5) ? (
                            <div className="absolute -left-[42px] top-0.5 w-5 h-5 rounded-full bg-[#00c37b] border-2 border-white flex items-center justify-center text-white select-none">
                              <Check size={10} className="stroke-[3]" />
                            </div>
                          ) : (
                            <div className="absolute -left-[42px] top-0.5 w-5 h-5 rounded-full bg-[#e8e6f0] border-2 border-white flex items-center justify-center text-[#9a99b0] select-none">
                              <div className="w-1.5 h-1.5 bg-[#9a99b0] rounded-full" />
                            </div>
                          )}
                          <div className="flex flex-col gap-0.5">
                            <h4 className="text-xs font-bold text-[#1a1a2e]">Post live deadline</h4>
                            <span className="text-[10px] text-[#9a99b0] font-light mt-0.5">
                              {timelineDates.postLive}
                            </span>
                          </div>
                        </div>

                        {/* Step 6 */}
                        <div className="relative">
                          {isTimelineStepCompleted(6) ? (
                            <div className="absolute -left-[42px] top-0.5 w-5 h-5 rounded-full bg-[#00c37b] border-2 border-white flex items-center justify-center text-white select-none">
                              <Check size={10} className="stroke-[3]" />
                            </div>
                          ) : (
                            <div className="absolute -left-[42px] top-0.5 w-5 h-5 rounded-full bg-[#e8e6f0] border-2 border-white flex items-center justify-center text-[#9a99b0] select-none">
                              <div className="w-1.5 h-1.5 bg-[#9a99b0] rounded-full" />
                            </div>
                          )}
                          <div className="flex flex-col gap-0.5">
                            <h4 className="text-xs font-bold text-[#1a1a2e]">Payment release</h4>
                            <span className="text-[10px] text-[#9a99b0] font-light mt-0.5">
                              {timelineDates.paymentRelease}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action apply button */}
                {campaign.status === 'live' && campaign.daysLeft.toLowerCase() !== 'closed' ? (
                  <Button
                    onClick={() => setDrawerMode('apply')}
                    className="w-full bg-brand-pink text-white font-semibold text-[15px] py-6.5 rounded-xl hover:bg-brand-pink/95 shadow-[0_6px_22px_rgba(215,23,111,0.22)] active:scale-[0.99] transition-all select-none border-none shrink-0 mt-4 cursor-pointer"
                  >
                    Apply Now -{' '}
                    {campaign.daysLeft.toLowerCase().includes('left') ||
                    campaign.daysLeft.toLowerCase() === 'closed'
                      ? campaign.daysLeft
                      : `${campaign.daysLeft} left`}{' '}
                    →
                  </Button>
                ) : (
                  <Button
                    disabled
                    className="w-full bg-[#eaeaf0] text-[#7a7a9a] font-semibold text-[15px] py-6.5 rounded-xl transition-all select-none border-none shrink-0 mt-4 cursor-not-allowed"
                  >
                    {campaign.status === 'past' ||
                    campaign.status === 'completed' ||
                    campaign.daysLeft.toLowerCase() === 'closed'
                      ? 'Campaign Closed'
                      : `Apply Disabled (Campaign is ${campaign.status || 'Pending approval'})`}
                  </Button>
                )}
              </div>
            </>
          )}

          {drawerMode === 'apply' && (
            <>
              {/* Custom Sticky Header */}
              <div className="sticky top-0 bg-white border-b border-[#e8e6f0]/60 py-4.5 px-5 flex items-center justify-between z-20 shrink-0 select-none">
                {/* Circle back button */}
                <button
                  onClick={() => setDrawerMode('details')}
                  className="w-9 h-9 rounded-full bg-[#f4f4f8] hover:bg-[#eaeaf0] flex items-center justify-center text-[#1a1a2e] transition-colors focus:outline-none cursor-pointer border-none"
                  aria-label="Back to details"
                >
                  <ArrowLeft size={16} />
                </button>

                <div className="flex flex-col items-center text-center pr-2">
                  <span className="text-sm font-bold text-[#1a1a2e] truncate max-w-[200px]">
                    {campaign.title}
                  </span>
                  <span className="text-[10.5px] text-[#7a7a9a] mt-0.5 leading-none">
                    {campaign.brand} •{' '}
                    <span className="font-bold text-brand-pink">{campaign.budget}</span>
                  </span>
                </div>

                {/* Top right deadline pill */}
                <div className="py-1 px-2.5 bg-red-50 text-red-500 border border-red-100 rounded-full flex items-center gap-1 text-[10px] font-bold shrink-0">
                  <Clock size={11} className="stroke-[2.5]" />
                  <span>
                    {campaign.daysLeft.toLowerCase().includes('left') ||
                    campaign.daysLeft.toLowerCase() === 'closed'
                      ? campaign.daysLeft
                      : `${campaign.daysLeft} left`}
                  </span>
                </div>
              </div>

              {/* Scrollable Form Body */}
              <div className="p-5 flex flex-col gap-5 overflow-y-auto">
                <div className="flex flex-col gap-4">
                  {/* Content Idea * */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contentTitle" className="text-xs font-bold text-[#1a1a2e]">
                      Content Idea *
                    </label>
                    <span className="text-[10.5px] text-[#7a7a9a] font-light -mt-0.5 leading-relaxed">
                      Describe your creative concept. Be specific — this is what the brand
                      evaluates.
                    </span>
                    <textarea
                      id="contentTitle"
                      rows={4}
                      value={contentTitle}
                      onChange={(e) => setContentTitle(e.target.value)}
                      placeholder="e.g. I'll create a morning routine reel showing how I style the summer collection for a Lagos workday..."
                      className="border border-[#e8e6f0] focus:border-brand-pink focus:ring-1 focus:ring-brand-pink/30 rounded-xl p-3 text-xs w-full outline-none transition-all placeholder:text-[#9a99b0] text-[#1a1a2e] resize-none leading-relaxed mt-1"
                    />
                    <div className="flex justify-between items-center text-[10px] px-0.5 mt-0.5">
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

                  {/* Past Work Link */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="workLink" className="text-xs font-bold text-[#1a1a2e]">
                      Past Work Link (optional)
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

                  {/* Platform select dropdowns */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="primaryPlatform" className="text-xs font-bold text-[#1a1a2e]">
                        Primary Platform
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
                      <label
                        htmlFor="secondaryPlatform"
                        className="text-xs font-bold text-[#1a1a2e]"
                      >
                        Secondary (optional)
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
                      Fee Request (₦) *
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
                    <span className="text-[10px] text-[#7a7a9a] font-light leading-none px-0.5 mt-0.5">
                      Range: {campaign.budget}
                    </span>
                  </div>

                  {/* Question/Comments */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="comments" className="text-xs font-bold text-[#1a1a2e]">
                      Question/Comments(Optional)
                    </label>
                    <span className="text-[10.5px] text-[#7a7a9a] font-light -mt-0.5 leading-relaxed">
                      Comments or questions regarding the campaign for the advertiser to answer (eg.
                      How long is the campaign?)
                    </span>
                    <textarea
                      id="comments"
                      rows={3}
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      placeholder="Any questions or comments for the advertiser..."
                      className="border border-[#e8e6f0] focus:border-brand-pink focus:ring-1 focus:ring-brand-pink/30 rounded-xl p-3 text-xs w-full outline-none transition-all placeholder:text-[#9a99b0] text-[#1a1a2e] resize-none leading-relaxed mt-1"
                    />
                  </div>
                </div>

                {/* Escrow banner */}
                <div className="bg-pink-50 border border-pink-100 rounded-xl p-4 flex gap-3 items-start mt-2">
                  <Shield size={16} className="text-brand-pink shrink-0 mt-0.5" />
                  <p className="text-[10.5px] text-brand-pink leading-relaxed font-semibold">
                    Your payment is fully secured by Trendupp escrow. The brand&apos;s funds are
                    locked before you receive the brief. You&apos;ll only be notified after escrow
                    is confirmed.
                  </p>
                </div>

                {/* Submit application */}
                <Button
                  onClick={handleSubmit}
                  disabled={!isFormValid || applyMutation.isPending}
                  className={cn(
                    'w-full text-white font-semibold text-[15px] py-6.5 rounded-xl transition-all select-none border-none shrink-0 mt-2 flex items-center justify-center gap-1.5 shadow-md',
                    isFormValid && !applyMutation.isPending
                      ? 'bg-brand-pink hover:bg-brand-pink/95 shadow-[0_6px_22px_rgba(215,23,111,0.22)] active:scale-[0.99] cursor-pointer'
                      : 'bg-zinc-200 hover:bg-zinc-200 text-zinc-400 cursor-not-allowed shadow-none',
                  )}
                >
                  {applyMutation.isPending ? 'Submitting...' : 'Submit Application'}
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
                  className="text-[#7a7a9a] hover:text-[#1a1a2e] transition-colors focus:outline-none border-none bg-transparent cursor-pointer"
                  aria-label="Close success screen"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Success Body */}
              <div className="flex-1 flex flex-col items-center py-6 px-8 text-center my-auto min-h-[350px]">
                <div className="w-16 h-16 rounded-full border border-[#00c37b]/25 bg-[#00c37b]/5 flex items-center justify-center text-[#00c37b] mb-6 shadow-sm">
                  <Check size={28} className="stroke-[2.5]" />
                </div>

                <span className="text-[10px] font-bold text-[#00c37b] leading-none uppercase tracking-wider mb-2">
                  Application Sent
                </span>

                <h3 className="text-xl font-bold text-[#1a1a2e] mb-3 select-none leading-none">
                  You&apos;re in the running!
                </h3>

                <p className="text-xs font-light text-[#7a7a9a] leading-relaxed max-w-[340px] mb-8">
                  The brand reviews all applications after the 48-hour window closes. You will get a
                  push+email notification whether your application is approved or rejected.
                </p>

                {/* Progress Timeline List */}
                <div className="w-full max-w-[280px] text-left flex flex-col gap-6 pl-8 ml-3 border-l border-[#e8e6f0]/80 relative mb-10 select-none">
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
                        After application closes
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
                        After application closes
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
                        Escrow Confirmed — Work Begins
                      </h4>
                      <span className="text-[10px] text-[#9a99b0] font-light mt-0.5">
                        After brand confirmed
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleClose}
                  className="w-full max-w-[280px] bg-brand-pink text-white font-semibold text-[14px] py-6.5 rounded-xl hover:bg-brand-pink/95 shadow-[0_6px_22px_rgba(215,23,111,0.22)] active:scale-[0.99] transition-all border-none cursor-pointer"
                >
                  Back to Campaigns
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </Portal>
  );
}
