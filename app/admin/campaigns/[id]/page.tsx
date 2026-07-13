'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Download,
  ChevronDown,
  Check,
  X,
  ExternalLink,
  Info,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import UserAvatar from '@/shared/UserAvatar';

type TabType =
  | 'Campaign Details'
  | 'Applications (47)'
  | 'Deliverables'
  | 'Analytics'
  | 'Activity Timeline'
  | 'Admin Actions'
  | 'Audit Log';

export default function CampaignDetailsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('Campaign Details');
  const [deliverableFilter, setDeliverableFilter] = useState('Revision');

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/campaigns"
            className="p-2 hover:bg-[#f4f3f6] rounded-xl text-[#7a7a9a] hover:text-[#1a1a2e] transition-colors shrink-0"
          >
            <ArrowLeft size={16} />
          </Link>
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base font-bold text-[#1a1a2e]">Summer Style Collection 2025</h1>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#fff1f2] text-[#e11d48] border border-[#ffe4e6] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e11d48]" />
                Live
              </span>
            </div>
            <span className="text-[10px] text-[#9a99b0] font-medium mt-0.5">
              TRD-1001 &bull; Zara Africa &bull; Created Jun 1, 2026
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button className="h-9 px-4 border border-[#e8e6f0] text-xs font-bold text-[#5a5a7a] rounded-xl hover:bg-[#faf9fc] transition-colors cursor-pointer flex items-center gap-1.5">
            <Download size={13} /> Export
          </button>
          <button className="h-9 px-4 bg-brand-pink text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all cursor-pointer flex items-center gap-1">
            Admin Actions <ChevronDown size={13} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#e8e6f0]/40 overflow-x-auto shrink-0 scrollbar-none">
        {[
          'Campaign Details',
          'Applications (47)',
          'Deliverables',
          'Analytics',
          'Activity Timeline',
          'Admin Actions',
          'Audit Log',
        ].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as TabType)}
            className={cn(
              'px-4 py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap',
              activeTab === tab
                ? 'border-brand-pink text-brand-pink font-bold'
                : 'border-transparent text-[#9a99b0] hover:text-[#1a1a2e]',
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Tab 1: Campaign Details */}
        {activeTab === 'Campaign Details' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left">
            {/* Left section */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              {/* Campaign Info */}
              <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-4">
                <h3 className="text-xs font-bold text-[#1a1a2e] uppercase tracking-wider">
                  Campaign Info
                </h3>
                <div className="flex flex-col gap-3 text-xs">
                  {[
                    { label: 'Campaign Title', val: 'Summer Style Collection 2025' },
                    { label: 'Campaign ID', val: 'TRD-1001' },
                    { label: 'Goal', val: 'Create Content' },
                    { label: 'Niche', val: 'Fashion' },
                    { label: 'Creator Tiers', val: 'Micro, Macro' },
                    { label: 'Preferred Platforms', val: 'Instagram' },
                    { label: 'Total Budget', val: '₦3,000,000', highlight: true },
                    { label: 'Escrow Status', val: 'Funded', status: true },
                    { label: 'Date Created', val: 'Jun 1, 2026' },
                    { label: 'Application Closing', val: 'Jun 3, 2026' },
                  ].map((row, i) => (
                    <div key={i} className="flex justify-between items-center py-0.5">
                      <span className="font-medium text-[#7a7a9a]">{row.label}</span>
                      <span
                        className={cn(
                          'font-semibold text-[#1a1a2e]',
                          row.highlight ? 'text-brand-pink font-bold' : '',
                          row.status ? 'text-[#16a34a] font-bold' : '',
                        )}
                      >
                        {row.val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Content Direction */}
              <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-4">
                <h3 className="text-xs font-bold text-[#1a1a2e] uppercase tracking-wider">
                  Content Direction
                </h3>
                <div className="flex flex-col gap-3.5 text-xs text-[#5a5a7a] leading-relaxed">
                  {[
                    "Dramatic before and after revealing the collection's impact.",
                    'Incorporate the hair styling seamlessly into your beauty routine.',
                    'Step-by-step guide to achieving an effortless, elegant look.',
                  ].map((dir, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className="text-brand-pink font-bold shrink-0">{i + 1}.</span>
                      <span>{dir}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right section */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              {/* Campaign Brief */}
              <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-3">
                <h3 className="text-xs font-bold text-[#1a1a2e] uppercase tracking-wider">
                  Campaign Brief
                </h3>
                <p className="text-xs text-[#5a5a7a] leading-relaxed font-medium">
                  Zara Africa is launching a campaign to connect with authentic Nigerian creators
                  and build brand awareness across key demographics.
                </p>
              </div>

              {/* Deliverables */}
              <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-4">
                <h3 className="text-xs font-bold text-[#1a1a2e] uppercase tracking-wider">
                  Deliverables
                </h3>
                <div className="flex flex-col gap-3.5 text-xs text-[#5a5a7a] leading-relaxed">
                  {[
                    '1 &times; Platform Reel (60 seconds)',
                    '3 &times; Stories with product tag',
                    'Caption in English or Pidgin',
                  ].map((del, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className="text-brand-pink font-bold shrink-0">{i + 1}.</span>
                      <span dangerouslySetInnerHTML={{ __html: del }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Content Guidelines */}
              <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-4">
                <h3 className="text-xs font-bold text-[#1a1a2e] uppercase tracking-wider">
                  Content Guidelines
                </h3>
                <div className="flex flex-col gap-4 text-xs">
                  <div className="flex flex-col gap-2.5">
                    <span className="text-[10px] font-bold text-[#16a34a] uppercase tracking-wider">
                      Do&apos;s
                    </span>
                    {[
                      'Tag brand account and use campaign hashtag',
                      'Show product in natural settings',
                      'Include verbal CTA',
                    ].map((doItem, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-[#5a5a7a]">
                        <div className="w-4 h-4 rounded-full bg-[#f0fdf4] text-[#16a34a] flex items-center justify-center shrink-0 border border-[#dcfce7]">
                          <Check size={9} className="stroke-[3]" />
                        </div>
                        <span className="font-medium">{doItem}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-2.5 border-t border-[#e8e6f0]/40 pt-4">
                    <span className="text-[10px] font-bold text-[#dc2626] uppercase tracking-wider">
                      Don&apos;ts
                    </span>
                    {['No competitor brands visible', 'No misleading health claims'].map(
                      (dontItem, i) => (
                        <div key={i} className="flex items-center gap-2.5 text-[#5a5a7a]">
                          <div className="w-4 h-4 rounded-full bg-[#fef2f2] text-[#dc2626] flex items-center justify-center shrink-0 border border-[#fee2e2]">
                            <X size={9} className="stroke-[3]" />
                          </div>
                          <span className="font-medium">{dontItem}</span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>

              {/* Success Looks Like */}
              <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-3">
                <h3 className="text-xs font-bold text-[#1a1a2e] uppercase tracking-wider">
                  Success Looks Like
                </h3>
                <p className="text-xs text-[#5a5a7a] leading-relaxed font-medium">
                  We are looking for content that feels authentic, relatable, visually appealing,
                  and inspires women to explore the new SWW Hair Collection. We are excited to
                  collaborate with you and can&apos;t wait to see your creativity bring the SWW Hair
                  Collection to life.
                </p>
              </div>
            </div>

            {/* Bottom Full-width: Usage Rights */}
            <div className="col-span-1 lg:col-span-12 bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-3">
              <h3 className="text-xs font-bold text-[#1a1a2e] uppercase tracking-wider">
                Usage Rights
              </h3>
              <p className="text-xs text-[#5a5a7a] leading-relaxed font-medium">
                By participating in this campaign, creators grant Zara Africa permission to repost
                and use campaign content across its digital platforms for marketing and promotional
                purposes.
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Applications */}
        {activeTab === 'Applications (47)' && (
          <div className="flex flex-col gap-4 text-left">
            <h3 className="text-[11px] font-semibold text-[#9a99b0]">
              47 total applications &bull; Admin view only
            </h3>

            <div className="flex flex-col gap-4">
              {[
                {
                  name: 'Adaeze Obi',
                  handle: '@adaeze_eats',
                  rating: '4.9',
                  pitch:
                    "I'll create a warm iftar unboxing video featuring KFC's new sharing bucket — opening it with family just as the adhan sounds.",
                  initials: 'AO',
                  price: null,
                },
                {
                  name: 'Chisom Nwosu',
                  handle: '@chisom.ng',
                  rating: '4.9',
                  pitch:
                    "A 'day in my Ramadan' vlog that features KFC as the iftar meal of choice — authentic, personal, low-key.",
                  initials: 'CN',
                  price: null,
                },
                {
                  name: 'Emeka Chukwu',
                  handle: '@chef_emeka',
                  rating: '4.9',
                  pitch:
                    "I'll create a warm iftar unboxing video featuring KFC's new sharing bucket — opening it with family just as the adhan sounds.",
                  initials: 'EC',
                  price: '₦120,000',
                },
                {
                  name: 'Fatima Garba',
                  handle: '@fatima.foods',
                  rating: '4.9',
                  pitch:
                    "I'll create a warm iftar unboxing video featuring KFC's new sharing bucket — opening it with family just as the adhan sounds.",
                  initials: 'FG',
                  price: '₦120,000',
                },
              ].map((app, i) => (
                <div
                  key={i}
                  className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5.5 flex flex-col md:flex-row justify-between gap-4.5 items-start md:items-center"
                >
                  <div className="flex gap-4 items-start flex-1 min-w-0">
                    <UserAvatar initials={app.initials} size={40} />
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-[#1a1a2e]">{app.name}</span>
                        <span className="text-[10px] text-[#9a99b0] font-medium">{app.handle}</span>
                        <span className="text-[10px] font-bold text-[#f59e0b] flex items-center gap-0.5 ml-1">
                          ★ {app.rating}
                        </span>
                      </div>
                      <p className="text-xs text-[#5a5a7a] font-medium leading-relaxed mt-1.5">
                        {app.pitch}
                      </p>
                      <div className="flex items-center gap-2 mt-3 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#f5f3ff] text-[#7c3aed] border border-[#ede9fe]">
                          Micro
                        </span>
                        <span className="text-[10px] font-bold text-[#5a5a7a]">
                          180K <span className="text-[#9a99b0] font-medium">followers</span>
                        </span>
                        <span className="w-1 h-1 rounded-full bg-[#9a99b0] shrink-0" />
                        <span className="text-[10px] font-bold text-[#5a5a7a]">
                          5.2% <span className="text-[#9a99b0] font-medium">engagement</span>
                        </span>
                        {app.price && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-[#9a99b0] shrink-0" />
                            <span className="text-[10px] font-bold text-[#1a1a2e]">
                              {app.price}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <button className="h-9 px-4.5 border border-[#e8e6f0] text-xs font-bold text-[#5a5a7a] rounded-xl hover:bg-[#faf9fc] shrink-0 transition-colors cursor-pointer flex items-center gap-1.5">
                    View application <ArrowRight size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Deliverables */}
        {activeTab === 'Deliverables' && (
          <div className="flex flex-col gap-4 text-left">
            {/* Filter selection pill */}
            <div className="relative w-fit">
              <select
                value={deliverableFilter}
                onChange={(e) => setDeliverableFilter(e.target.value)}
                className="h-8 pl-3.5 pr-8 rounded-lg bg-[#f4f3f6] text-[10px] font-bold text-[#5a5a7a] appearance-none cursor-pointer border border-[#e8e6f0]/60 focus:outline-none"
              >
                <option value="Revision">Revision</option>
                <option value="Pending Review">Pending Review</option>
                <option value="Approved">Approved</option>
              </select>
              <ChevronDown
                size={12}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7a7a9a] pointer-events-none"
              />
            </div>

            {/* Submissions list */}
            <div className="flex flex-col gap-4">
              {[
                {
                  name: 'Adaeze Obi',
                  time: 'Submitted 2 hours ago',
                  initials: 'AO',
                  link: 'https://instagram.com/p/example1',
                  desc: '“Shot at Lekki beach during golden hour. Used trending audio. Caption ideas included in the doc.”',
                  revision:
                    'Great take overall! Please add the Audiomack app UI briefly — it was missing from this submission. Also, the hashtag #AudiomackAfrobeats needs to be in the caption.',
                  revised: null,
                },
                {
                  name: 'Emeka Chukwu',
                  time: 'Submitted 2 hours ago',
                  initials: 'EC',
                  link: 'https://instagram.com/p/example1',
                  desc: '“Shot at Lekki beach during golden hour. Used trending audio. Caption ideas included in the doc.”',
                  revision:
                    'Great take overall! Please add the Audiomack app UI briefly — it was missing from this submission. Also, the hashtag #AudiomackAfrobeats needs to be in the caption.',
                  revised: {
                    link: 'https://instagram.com/p/example1',
                    desc: '“Shot at Lekki beach during golden hour. Used trending audio. Caption ideas included in the doc.”',
                  },
                },
              ].map((sub, i) => (
                <div
                  key={i}
                  className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5.5 flex flex-col gap-4 text-left"
                >
                  {/* Creator details header */}
                  <div className="flex justify-between items-center gap-3">
                    <div className="flex items-center gap-3">
                      <UserAvatar initials={sub.initials} size={36} />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-[#1a1a2e]">{sub.name}</span>
                        <span className="text-[10px] text-[#9a99b0] font-medium">{sub.time}</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-[#fff7ed] text-[#ea580c] border border-[#ffedd5]">
                      Revision requested
                    </span>
                  </div>

                  {/* Submission link */}
                  <div className="border border-[#e8e6f0] rounded-2xl p-4 flex flex-col gap-2">
                    <span className="text-[9px] font-bold text-[#9a99b0] uppercase tracking-wider">
                      Content Link
                    </span>
                    <a
                      href={sub.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-brand-pink hover:underline flex items-center gap-1 w-fit"
                    >
                      {sub.link} <ExternalLink size={11} />
                    </a>
                    <p className="text-xs text-[#5a5a7a] font-medium italic mt-0.5">{sub.desc}</p>

                    {/* Revision Alert block */}
                    <div className="bg-[#fff7ed]/50 border border-[#fde68a]/50 rounded-xl p-3.5 flex items-start gap-2.5 mt-2 text-xs leading-relaxed text-[#92400e] font-medium">
                      <Info size={14} className="shrink-0 mt-0.5 text-[#f59e0b]" />
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#b45309]">
                          Revision Request
                        </span>
                        <span>{sub.revision}</span>
                      </div>
                    </div>

                    {/* Revised content section */}
                    {sub.revised && (
                      <div className="border border-[#dbeafe] bg-[#eff6ff]/20 rounded-xl p-3.5 flex flex-col gap-2 mt-3 text-xs leading-relaxed text-[#2563eb]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#1d4ed8]">
                          Revised Content
                        </span>
                        <a
                          href={sub.revised.link}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold flex items-center gap-1 w-fit"
                        >
                          {sub.revised.link} <ExternalLink size={11} />
                        </a>
                        <p className="text-[#5a5a7a] font-medium italic mt-0.5">
                          {sub.revised.desc}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action button row */}
                  <div className="flex justify-end">
                    <button className="h-8.5 px-4.5 border border-[#e8e6f0] text-xs font-bold text-[#5a5a7a] rounded-xl hover:bg-[#faf9fc] transition-colors cursor-pointer flex items-center gap-1.5">
                      View more details <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Placeholder: Other tabs */}
        {!['Campaign Details', 'Applications (47)', 'Deliverables'].includes(activeTab) && (
          <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-10 flex flex-col items-center justify-center text-center">
            <span className="text-xs text-[#9a99b0] font-medium">
              {activeTab} content will go here
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
