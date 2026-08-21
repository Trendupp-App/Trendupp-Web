'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Clock, Shield, Check, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCampaignPlatforms, useApplyCampaign } from '@/hooks/useCampaign';
import ApplicationSuccessView from './ApplicationSuccessView';
import type { CampaignTimeline } from '@/types/campaign';
import { buildTimelineSteps } from '@/lib/campaignTimelineStage';
import { getCurrencySymbol } from '@/utils/Utilities';
import { ComboBox } from '@/shared/ComboBox';

export interface MappedCampaign {
  id: string;
  title: string;
  brand: string;
  budget: string;
  budgetMax?: number;
  currency?: string;
  feeRangeLabel?: string;
  feeRangeMin?: number;
  feeRangeMax?: number;
  hasApplied?: boolean;
  daysLeft: string;
  tier: string;
  appliedCount: number;
  image: string;
  niches?: string[];
  platforms?: string[];
  goal?: string;
  campaignBrief?: string;
  deliverables?: string[];
  contentDirection?: string[];
  contentGuidelines?: { dos: string[]; donts: string[] };
  usageRights?: string;
  successLooksLike?: string;
  status?: string;
  timeline?: CampaignTimeline;
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
  const [contentTitle, setContentTitle] = useState('');
  const [workLinks, setWorkLinks] = useState<string[]>(['']);
  const [primaryPlatform, setPrimaryPlatform] = useState('Instagram');
  const [secondaryPlatform, setSecondaryPlatform] = useState('None');
  const [feeRequest, setFeeRequest] = useState('');
  const [comments, setComments] = useState('');
  const [appliedTimeline, setAppliedTimeline] = useState<CampaignTimeline | undefined>();

  const { data: platformsList = [], isLoading: platformsLoading } = useCampaignPlatforms();

  // Backend platform names aren't consistently cased (e.g. "facebook" vs
  // "Instagram") — capitalize just the first letter for display so labels
  // read consistently without mangling names like "TikTok".
  const platformLabel = (name: string) =>
    name === 'Twitter' ? 'Twitter / X' : name.charAt(0).toUpperCase() + name.slice(1);
  const platformOptions = platformsList.map((p) => ({
    value: p.name,
    label: platformLabel(p.name),
  }));
  const secondaryPlatformOptions = [{ value: 'None', label: 'None' }, ...platformOptions];

  const applyMutation = useApplyCampaign((application) => {
    setAppliedTimeline(application?.campaign?.timeline);
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
    setWorkLinks(['']);
    setPrimaryPlatform('Instagram');
    setSecondaryPlatform('None');
    setFeeRequest('');
    setComments('');
    setAppliedTimeline(undefined);
    onClose();
  };

  // campaign.feeRangeMin/Max/Label already arrive display-currency-converted
  // (see useDisplayCurrency + mapCampaign/getCampaignBudgetRange), so this
  // just compares against whatever was handed in — no conversion here.
  const displayFeeRangeLabel = campaign?.feeRangeLabel ?? campaign?.budget;
  const currencySymbol = getCurrencySymbol(campaign?.currency);

  const isFormValid = contentTitle.length >= 20 && feeRequest.trim() !== '';
  const feeRequestNumber = Number(feeRequest.replace(/[^0-9]/g, '')) || 0;
  const feeExceedsBudget =
    feeRequestNumber > 0 &&
    campaign?.feeRangeMax !== undefined &&
    feeRequestNumber > campaign.feeRangeMax;
  const feeBelowRange =
    feeRequestNumber > 0 &&
    campaign?.feeRangeMin !== undefined &&
    feeRequestNumber < campaign.feeRangeMin;

  function updateWorkLink(index: number, value: string) {
    setWorkLinks((prev) => prev.map((link, i) => (i === index ? value : link)));
  }

  function addWorkLink() {
    setWorkLinks((prev) => [...prev, '']);
  }

  function removeWorkLink(index: number) {
    setWorkLinks((prev) => prev.filter((_, i) => i !== index));
  }

  const handleSubmit = () => {
    if (!isFormValid || !campaign) return;
    const primaryId = getPlatformIdByName(primaryPlatform);
    const secondaryId = getPlatformIdByName(secondaryPlatform);
    const fallbackId = platformsList[0]?.id || '';
    const cleanedWorkLinks = workLinks.map((link) => link.trim()).filter(Boolean);

    applyMutation.mutate({
      id: campaign.id,
      payload: {
        contentIdea: contentTitle,
        pastWorkLink: cleanedWorkLinks.length > 0 ? cleanedWorkLinks : undefined,
        primaryPlatformId: primaryId || fallbackId,
        secondaryPlatformId: secondaryId,
        feeRequest: Number(feeRequest.replace(/[^0-9]/g, '')),
        comments: comments || undefined,
      },
    });
  };

  if (!campaign) return null;

  const timelineSteps = buildTimelineSteps(campaign.timeline);

  return (
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
                      {campaign.daysLeft} left
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

                    {/* Info cards grid: Goal, Niche, Platform, Creator Tier */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full">
                      {campaign.goal && (
                        <div className="bg-white border border-[#e8e6f0]/60 rounded-xl p-3.5 flex flex-col gap-1 min-w-0">
                          <span className="text-[10px] text-[#9a99b0] font-light leading-none">
                            Goal
                          </span>
                          <span className="text-xs font-bold text-[#1a1a2e] leading-none mt-0.5 truncate">
                            {campaign.goal}
                          </span>
                        </div>
                      )}
                      <div className="bg-white border border-[#e8e6f0]/60 rounded-xl p-3.5 flex flex-col gap-1 min-w-0">
                        <span className="text-[10px] text-[#9a99b0] font-light leading-none">
                          Niche
                        </span>
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {(campaign.niches?.length ? campaign.niches : ['Fashion']).map((n) => (
                            <span
                              key={n}
                              className="text-[10px] font-bold text-[#1a1a2e] leading-none px-1.5 py-1 rounded-md bg-[#f4f3f6]"
                            >
                              {n}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="bg-white border border-[#e8e6f0]/60 rounded-xl p-3.5 flex flex-col gap-1 min-w-0">
                        <span className="text-[10px] text-[#9a99b0] font-light leading-none">
                          Platform
                        </span>
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {(campaign.platforms?.length ? campaign.platforms : ['Instagram']).map(
                            (p) => (
                              <span
                                key={p}
                                className="flex items-center gap-1 text-[10px] font-bold text-[#1a1a2e] leading-none px-1.5 py-1 rounded-md bg-[#f4f3f6]"
                              >
                                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white shrink-0">
                                  <div className="w-1 h-1 rounded-full border border-white" />
                                </div>
                                {p}
                              </span>
                            ),
                          )}
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
                          Brand payment confirmed in escrow before you receive the campaign. No work
                          before payment is secured.
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
                        <h4 className="text-[13px] font-bold text-[#1a1a2e]">Success Looks Like</h4>
                        <p className="text-xs font-light text-[#5a5a7a] leading-relaxed">
                          {campaign.successLooksLike}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'timeline' && (
                  <div className="flex flex-col gap-5">
                    <h4 className="text-[13px] font-bold text-[#1a1a2e] mb-1">Campaign Timeline</h4>
                    {timelineSteps.length === 0 ? (
                      <p className="text-xs font-light text-[#9a99b0] leading-relaxed">
                        Timeline details aren&apos;t available for this campaign yet.
                      </p>
                    ) : (
                      <div className="flex flex-col gap-6 pl-8 ml-3 border-l border-[#e8e6f0]/75 relative select-none">
                        {timelineSteps.map((step) => (
                          <div key={step.key} className="relative">
                            <div
                              className={cn(
                                'absolute -left-[42px] top-0.5 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center select-none',
                                step.status === 'completed'
                                  ? 'bg-[#00c37b] text-white'
                                  : step.status === 'in_progress'
                                    ? 'bg-brand-pink text-white'
                                    : 'bg-[#e8e6f0] text-[#9a99b0]',
                              )}
                            >
                              {step.status === 'completed' ? (
                                <Check size={10} className="stroke-[3]" />
                              ) : step.status === 'in_progress' ? (
                                <Clock size={10} />
                              ) : (
                                <div className="w-1.5 h-1.5 bg-[#9a99b0] rounded-full" />
                              )}
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <h4 className="text-xs font-bold text-[#1a1a2e]">{step.title}</h4>
                              <span className="text-[10px] text-[#9a99b0] font-light mt-0.5">
                                {step.subtext}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action apply button */}
              {campaign.hasApplied ? (
                <Button
                  disabled
                  className="w-full bg-[#e6f9f1] text-[#00c37b] font-semibold text-[15px] py-6.5 rounded-xl transition-all select-none border-none shrink-0 mt-4 cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Check size={18} />
                  Already Applied
                </Button>
              ) : campaign.status === 'live' ? (
                <Button
                  onClick={() => setDrawerMode('apply')}
                  className="w-full bg-brand-pink text-white font-semibold text-[15px] py-6.5 rounded-xl hover:bg-brand-pink/95 shadow-[0_6px_22px_rgba(215,23,111,0.22)] active:scale-[0.99] transition-all select-none border-none shrink-0 mt-4 cursor-pointer"
                >
                  Apply Now - 38h left →
                </Button>
              ) : (
                <Button
                  disabled
                  className="w-full bg-[#eaeaf0] text-[#7a7a9a] font-semibold text-[15px] py-6.5 rounded-xl transition-all select-none border-none shrink-0 mt-4 cursor-not-allowed"
                >
                  Apply Disabled (Campaign is {campaign.status || 'Pending approval'})
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
                <span>1d 14h left</span>
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
                    Describe your creative concept. Be specific — this is what the brand evaluates.
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

                {/* Past Work Link(s) */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#1a1a2e]">
                    Past Work Link (optional)
                  </label>
                  <div className="flex flex-col gap-2">
                    {workLinks.map((link, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={link}
                          onChange={(e) => updateWorkLink(index, e.target.value)}
                          placeholder="https://instagram.com/p/example"
                          className="border border-[#e8e6f0] focus:border-brand-pink focus:ring-1 focus:ring-brand-pink/30 rounded-xl p-3 text-xs w-full outline-none transition-all placeholder:text-[#9a99b0] text-[#1a1a2e]"
                        />
                        {workLinks.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeWorkLink(index)}
                            className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#e8e6f0] text-[#c4c2d4] hover:text-red-400 hover:border-red-200 transition-colors shrink-0 cursor-pointer"
                            aria-label="Remove link"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={addWorkLink}
                    className="flex items-center gap-1.5 text-xs font-bold text-brand-pink hover:text-brand-pink/80 transition-colors w-fit cursor-pointer"
                  >
                    <Plus size={13} />
                    Add another link
                  </button>
                </div>

                {/* Platform select dropdowns */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#1a1a2e]">Primary Platform</label>
                    <ComboBox
                      options={platformOptions}
                      value={primaryPlatform}
                      onValueChange={(val) => val && setPrimaryPlatform(val)}
                      placeholder="Select platform"
                      searchPlaceholder="Search platforms…"
                      emptyText="No platform found."
                      loading={platformsLoading}
                      triggerClassName="rounded-xl text-xs"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#1a1a2e]">Secondary (optional)</label>
                    <ComboBox
                      options={secondaryPlatformOptions}
                      value={secondaryPlatform}
                      onValueChange={(val) => setSecondaryPlatform(val || 'None')}
                      placeholder="Select platform"
                      searchPlaceholder="Search platforms…"
                      emptyText="No platform found."
                      loading={platformsLoading}
                      triggerClassName="rounded-xl text-xs"
                    />
                  </div>
                </div>

                {/* Fee Request */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="feeRequest" className="text-xs font-bold text-[#1a1a2e]">
                    Fee Request ({currencySymbol}) *
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-xs text-[#7a7a9a] select-none font-medium">
                      {currencySymbol}
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
                    Range: {displayFeeRangeLabel}
                  </span>
                  {feeExceedsBudget && (
                    <span className="text-[10px] text-red-500 font-medium leading-relaxed px-0.5 mt-0.5">
                      This exceeds the campaign&apos;s budget of {displayFeeRangeLabel}
                    </span>
                  )}
                  {feeBelowRange && (
                    <span className="text-[10px] text-red-500 font-medium leading-relaxed px-0.5 mt-0.5">
                      This is below the recommended range of {displayFeeRangeLabel}
                    </span>
                  )}
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
                  locked before you receive the brief. You&apos;ll only be notified after escrow is
                  confirmed.
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
          <ApplicationSuccessView timeline={appliedTimeline} onClose={handleClose} />
        )}
      </div>
    </div>
  );
}
