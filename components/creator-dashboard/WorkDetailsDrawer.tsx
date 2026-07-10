'use client';

import { useState } from 'react';
import {
  X,
  Clock,
  ExternalLink,
  Check,
  XCircle,
  Info,
  ShieldCheck,
  CheckCircle2,
  MessageCircle,
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { WorkCampaign } from './WorkCampaignCard';

type DrawerTab = 'overview' | 'requirement' | 'timeline' | 'deliverables';

const TABS: { id: DrawerTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'requirement', label: 'Requirement' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'deliverables', label: 'Deliverables' },
];

interface WorkDetailsDrawerProps {
  campaign: WorkCampaign | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitLink?: (campaign: WorkCampaign) => void;
  onSubmitProof?: (campaign: WorkCampaign) => void;
  onRaiseDispute?: (campaign: WorkCampaign) => void;
}

export default function WorkDetailsDrawer({
  campaign,
  isOpen,
  onClose,
  onSubmitLink,
  onSubmitProof,
  onRaiseDispute,
}: WorkDetailsDrawerProps) {
  const [activeTab, setActiveTab] = useState<DrawerTab>('overview');

  if (!isOpen || !campaign) return null;

  const hasDraft = !!campaign.draftLink;
  const hasRevision = campaign.status === 'Revision requested' && !!campaign.revisionComment;
  const isPastRevision = campaign.status === 'Approved' || campaign.status === 'Payment released';
  const wasRevised = hasRevision || (isPastRevision && !!campaign.revisionComment);
  const isApproved = campaign.status === 'Approved' || campaign.status === 'Payment released';
  const hasLiveLink = campaign.liveLink && Object.keys(campaign.liveLink).length > 0;

  console.log('Campaign', campaign);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
      <div className="w-full sm:max-w-[520px] h-full bg-white overflow-y-auto">
        {/* Close button */}
        <div className="flex justify-end p-4 pb-0">
          <button
            onClick={onClose}
            className="text-[#9a99b0] hover:text-[#1a1a2e] transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-5 pb-8 flex flex-col gap-5">
          {/* Cover image */}
          <div className="relative w-full h-[180px] rounded-2xl overflow-hidden bg-zinc-100">
            <Image
              src={campaign.image}
              alt={campaign.title}
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <div>
                <p className="text-lg font-bold text-white">{campaign.title}</p>
                <p className="flex items-center gap-1.5 text-xs text-white/80 mt-0.5">
                  {campaign.brand}
                  <span>•</span>
                  <Clock size={12} />
                  {campaign.daysLeft} left
                </p>
              </div>
              <span className="bg-white/90 text-[#4f46e5] text-[11px] font-semibold px-3 py-1 rounded-full shrink-0">
                {campaign.tier}
              </span>
            </div>
          </div>

          {/* Stats row */}
          <div className="border border-[#e8e6f0] rounded-2xl grid grid-cols-4 divide-x divide-[#e8e6f0]">
            <div className="flex flex-col gap-0.5 p-3.5">
              <span className="text-[10px] text-[#9a99b0]">Budget</span>
              <span className="text-sm font-bold text-brand-pink">{campaign.budgetString}</span>
            </div>
            <div className="flex flex-col gap-0.5 p-3.5">
              <span className="text-[10px] text-[#9a99b0]">Platform</span>
              <span className="text-sm font-bold text-[#1a1a2e]">{campaign.platform}</span>
            </div>
            {/* <div className="flex flex-col gap-0.5 p-3.5">
              <span className="text-[10px] text-[#9a99b0]">Niche</span>
              <span className="text-sm font-bold text-[#1a1a2e]">{campaign.niches[0] ?? '—'}</span>
            </div> */}
            <div className="flex flex-col gap-0.5 p-3.5">
              <span className="text-[10px] text-[#9a99b0]">Applied</span>
              <span className="text-sm font-bold text-[#1a1a2e]">{campaign.applicationsCount}</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-[#f4f3f6] rounded-xl p-1 grid grid-cols-4 gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer',
                  activeTab === tab.id
                    ? 'bg-white text-brand-pink shadow-sm'
                    : 'text-[#7a7a9a] hover:text-[#1a1a2e]',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── Overview tab ── */}
          {activeTab === 'overview' && (
            <div className="flex flex-col gap-4">
              <div className="bg-[#f4f3f6] rounded-2xl p-4 flex flex-col gap-1.5">
                <p className="text-xs text-[#1a1a2e]">
                  <span className="font-bold">Campaign title:</span> {campaign.title}
                </p>
                <p className="text-xs text-[#1a1a2e]">
                  <span className="font-bold">Brand:</span> {campaign.brand}
                </p>
              </div>

              <div className="border border-[#e8e6f0] rounded-2xl p-4 flex flex-col gap-2">
                <h4 className="text-sm font-bold text-[#1a1a2e]">Campaign Brief</h4>
                <p className="text-xs text-[#4a4a6a] leading-relaxed">
                  {campaign.guidelines || 'No brief provided.'}
                </p>
              </div>

              <div className="border border-[#e8e6f0] rounded-2xl p-4 flex flex-col gap-2">
                <h4 className="text-sm font-bold text-[#1a1a2e]">Deliverables</h4>
                {campaign.deliverables.length > 0 ? (
                  <ul className="flex flex-col gap-2">
                    {campaign.deliverables.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-[#4a4a6a]">
                        <span className="w-4 h-4 rounded-full bg-brand-pink-light text-brand-pink text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-[#9a99b0] italic">No deliverables specified.</p>
                )}
              </div>

              <div className="border border-[#e8e6f0] rounded-2xl p-4 flex flex-col gap-2">
                <h4 className="text-sm font-bold text-[#1a1a2e]">Content Direction</h4>
                {campaign.contentDirection.length > 0 ? (
                  <ul className="flex flex-col gap-2">
                    {campaign.contentDirection.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-[#4a4a6a]">
                        <span className="w-4 h-4 rounded-full bg-brand-pink-light text-brand-pink text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-[#9a99b0] italic">No content direction specified.</p>
                )}
              </div>

              <div className="bg-[#fff0f5] rounded-2xl p-4 flex items-start gap-3">
                <ShieldCheck size={18} className="text-brand-pink shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-brand-pink">Escrow Protected</p>
                  <p className="text-xs text-[#7a7a9a] mt-0.5 leading-relaxed">
                    Brand payment confirmed in escrow before you receive the campaign. No work
                    before payment is secured.
                  </p>
                </div>
              </div>

              <div className="bg-[#f3f0ff] rounded-2xl p-4 flex items-start gap-3">
                <Clock size={18} className="text-[#4f46e5] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-[#4f46e5]">48-Hour Application Window</p>
                  <p className="text-xs text-[#7a7a9a] mt-0.5 leading-relaxed">
                    This campaign accepts applications for 48 hours only. After the window closes,
                    the brand selects creators. Results are sent within 48 hours of closing.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── Requirement tab ── */}
          {activeTab === 'requirement' && (
            <div className="flex flex-col gap-4">
              <div className="border border-[#e8e6f0] rounded-2xl p-4 flex flex-col gap-2.5">
                <h4 className="text-sm font-bold text-[#1a1a2e]">
                  Content Guidelines (Brand Rules)
                </h4>
                {campaign.contentDos.length === 0 && campaign.contentDonts.length === 0 ? (
                  <p className="text-xs text-[#9a99b0] italic">No specific guidelines provided.</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {campaign.contentDos.map((item, idx) => (
                      <div key={`do-${idx}`} className="flex items-center gap-2">
                        <Check size={15} className="text-emerald-500 shrink-0" />
                        <span className="text-xs text-[#4a4a6a]">{item}</span>
                      </div>
                    ))}
                    {campaign.contentDonts.map((item, idx) => (
                      <div key={`dont-${idx}`} className="flex items-center gap-2">
                        <XCircle size={15} className="text-red-500 shrink-0" />
                        <span className="text-xs text-[#4a4a6a]">{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border border-[#e8e6f0] rounded-2xl p-4 flex flex-col gap-2">
                <h4 className="text-sm font-bold text-[#1a1a2e]">Usage Rights</h4>
                <p className="text-xs text-[#4a4a6a] leading-relaxed">{campaign.usageRights}</p>
              </div>

              <div className="border border-[#e8e6f0] rounded-2xl p-4 flex flex-col gap-2">
                <h4 className="text-sm font-bold text-[#1a1a2e]">Success Looks Like</h4>
                <p className="text-xs text-[#4a4a6a] leading-relaxed">
                  {campaign.successLooksLike}
                </p>
              </div>
            </div>
          )}

          {/* ── Timeline tab (kept static, low priority) ── */}
          {activeTab === 'timeline' && (
            <div className="flex flex-col gap-4">
              <div className="border border-[#e8e6f0] rounded-2xl p-4 flex flex-col gap-4">
                {[
                  { label: 'Application accepted', date: 'May 28, 2026', done: true },
                  { label: 'Content submitted', date: 'June 1, 2026', done: true },
                  { label: 'Brand review', date: 'June 3, 2026', done: true },
                  { label: 'Content approved', date: 'June 5, 2026', done: false },
                  { label: 'Payment released', date: 'Pending', done: false },
                ].map((step, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div
                      className={cn(
                        'w-2.5 h-2.5 rounded-full shrink-0',
                        step.done ? 'bg-emerald-500' : 'bg-[#e8e6f0]',
                      )}
                    />
                    <div className="flex-1 flex items-center justify-between">
                      <span className="text-xs text-[#1a1a2e] font-medium">{step.label}</span>
                      <span className="text-[11px] text-[#9a99b0]">{step.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Deliverables tab — progressive stack built from real fields ── */}
          {activeTab === 'deliverables' && (
            <div className="flex flex-col gap-4">
              <div className="bg-[#f3f0ff] rounded-2xl p-4">
                <p className="text-xs font-bold text-[#4f46e5] mb-1">Content Guidelines Reminder</p>
                <p className="text-xs text-[#5a5a8a] leading-relaxed">
                  Create your content off-platform, then return to submit the link for brand review.
                  Keep your content within the brief guidelines. Submit content within the next 3-5
                  days
                </p>
              </div>

              {/* Original content link — shown once a draft exists */}
              {hasDraft && (
                <div className="border border-[#e8e6f0] rounded-2xl p-4">
                  <p className="text-[10px] font-semibold text-[#9a99b0] mb-1">CONTENT LINK</p>

                  <a
                    href={campaign.draftLink!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm font-medium text-[#1a1a2e] hover:text-brand-pink break-all"
                  >
                    {campaign.draftLink}
                    <ExternalLink size={13} className="shrink-0" />
                  </a>
                  {campaign.contentIdea && (
                    <p className="text-xs text-[#9a99b0] mt-1">
                      &quot;{campaign.contentIdea}&quot;
                    </p>
                  )}
                </div>
              )}

              {/* Brand revision request — only while awaiting/after a revision */}
              {wasRevised && campaign.revisionComment && (
                <div className="bg-[#fffbf0] border border-amber-300 rounded-2xl p-4">
                  <p className="flex items-center gap-1.5 text-xs font-bold text-amber-600 mb-1">
                    <Info size={13} />
                    Brand Revision Request
                  </p>
                  <p className="text-xs text-[#7a5c00] leading-relaxed">
                    &quot;{campaign.revisionComment}&quot;
                  </p>
                </div>
              )}

              {/* Revised content — shown once brand has requested a revision AND
                  the submission has moved past that stage (i.e. resubmitted) */}
              {wasRevised && isPastRevision && hasDraft && (
                <div className="bg-[#f5f3ff] border border-indigo-300 rounded-2xl p-4">
                  <p className="text-xs font-bold text-indigo-600 mb-1">Revised Content</p>

                  <a
                    href={campaign.draftLink!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm font-medium text-[#1a1a2e] hover:text-brand-pink break-all"
                  >
                    {campaign.draftLink}
                    <ExternalLink size={13} className="shrink-0" />
                  </a>
                </div>
              )}

              {/* Content approved banner */}
              {isApproved && (
                <div className="bg-[#fce7f3] rounded-2xl p-4">
                  <p className="text-sm font-bold text-brand-pink mb-1">Content Approved</p>
                  <p className="text-xs text-[#7a5c6a] leading-relaxed">
                    Publish your content on <span className="font-bold">{campaign.platform}</span>,
                    then come back to submit proof of posting. The post must stay live for{' '}
                    <span className="font-bold">24 hours</span> before payment is released.
                  </p>
                </div>
              )}

              {/* Live content links */}
              {hasLiveLink && (
                <div className="border border-[#e8e6f0] rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[10px] font-semibold text-[#9a99b0]">LIVE CONTENT</p>
                    <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                      <CheckCircle2 size={12} />
                      Post live
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {Object.entries(campaign.liveLink!).map(([platform, entry]) => (
                      <div key={platform} className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-[#9a99b0] capitalize">{platform}</span>
                        <a
                          href={entry.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm font-medium text-[#1a1a2e] hover:text-brand-pink break-all"
                        >
                          {entry.url}
                          <ExternalLink size={13} className="shrink-0" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              {campaign.status === 'In progress' && (
                <button
                  onClick={() => onSubmitLink?.(campaign)}
                  className="w-full bg-brand-pink text-white text-xs font-semibold py-3 rounded-2xl hover:bg-brand-pink/90 transition-colors cursor-pointer"
                >
                  Submit content
                </button>
              )}

              {campaign.status === 'Revision requested' && (
                <button
                  onClick={() => onSubmitLink?.(campaign)}
                  className="w-full border border-amber-500/80 bg-amber-50/50 hover:bg-amber-50 text-amber-700 text-xs font-bold py-3 rounded-2xl transition-all cursor-pointer"
                >
                  Submit revised content
                </button>
              )}

              {isApproved && !hasLiveLink && (
                <button
                  onClick={() => onSubmitProof?.(campaign)}
                  className="w-full bg-brand-pink text-white text-xs font-semibold py-3 rounded-2xl hover:bg-brand-pink/90 transition-colors cursor-pointer"
                >
                  Submit Proof of Posting
                </button>
              )}
              {campaign.status !== 'Payment released' && (
                <button
                  onClick={() => onRaiseDispute?.(campaign)}
                  className="absolute bottom-6 right-6 z-30 w-11 h-11 bg-brand-pink hover:bg-brand-pink/90 text-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  aria-label="Raise a campaign dispute"
                >
                  <MessageCircle size={20} className="fill-current text-white" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
