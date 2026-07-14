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
  Eye,
  TrendingUp,
  ThumbsUp,
  MessageSquare,
  Play,
  Pause,
  Calendar,
  Lock,
  Unlock,
  RefreshCw,
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

interface CreatorDrawerData {
  name: string;
  handle: string;
  rating: string;
  location: string;
  status: string;
  initials: string;
}

export default function CampaignDetailsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('Campaign Details');
  const [deliverableFilter, setDeliverableFilter] = useState('Revision');
  const [selectedCreatorForDrawer, setSelectedCreatorForDrawer] =
    useState<CreatorDrawerData | null>(null);

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 relative min-h-screen">
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

                    <div className="bg-[#fff7ed]/50 border border-[#fde68a]/50 rounded-xl p-3.5 flex items-start gap-2.5 mt-2 text-xs leading-relaxed text-[#92400e] font-medium">
                      <Info size={14} className="shrink-0 mt-0.5 text-[#f59e0b]" />
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#b45309]">
                          Revision Request
                        </span>
                        <span>{sub.revision}</span>
                      </div>
                    </div>

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

                  <div className="flex justify-end">
                    <button
                      onClick={() =>
                        setSelectedCreatorForDrawer({
                          name: sub.name,
                          handle: sub.name === 'Adaeze Obi' ? '@adaeze_eats' : '@chef_emeka',
                          rating: '4.9',
                          location: 'Lagos, Nigeria',
                          status: 'Impact Advocate',
                          initials: sub.initials,
                        })
                      }
                      className="h-8.5 px-4.5 border border-[#e8e6f0] text-xs font-bold text-[#5a5a7a] rounded-xl hover:bg-[#faf9fc] transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      View more details <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Analytics */}
        {activeTab === 'Analytics' && (
          <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-5 text-left">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-bold text-[#9a99b0] uppercase tracking-wider">
                CREATOR&apos;S POST
              </span>
              <a
                href="https://instagram.com/p/example1"
                target="_blank"
                rel="noreferrer"
                className="text-sm font-bold text-[#1a1a2e] hover:text-brand-pink flex items-center gap-1.5 w-fit"
              >
                https://instagram.com/p/example1{' '}
                <ExternalLink size={14} className="text-[#9a99b0]" />
              </a>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Views', icon: Eye, val: '3241' },
                { label: 'Reach', icon: TrendingUp, val: '3241' },
                { label: 'Likes', icon: ThumbsUp, val: '3241' },
                { label: 'Comments', icon: MessageSquare, val: '3241' },
              ].map((m, i) => (
                <div
                  key={i}
                  className="border border-[#e8e6f0] rounded-2xl p-4 flex flex-col gap-2"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#faf9fc] flex items-center justify-center border border-[#e8e6f0]/40 text-[#7a7a9a]">
                    <m.icon size={15} />
                  </div>
                  <div className="flex flex-col mt-1">
                    <span className="text-xl font-bold text-[#1a1a2e]">{m.val}</span>
                    <span className="text-[10px] text-[#9a99b0] font-medium mt-0.5">{m.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Activity Timeline */}
        {activeTab === 'Activity Timeline' && (
          <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-6 text-left">
            <h3 className="text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider border-b border-[#e8e6f0]/40 pb-3">
              ACTIVITY TIMELINE &mdash; ALL EVENTS ARE IMMUTABLE AND TIMESTAMPED
            </h3>

            <div className="relative pl-6 flex flex-col gap-6.5">
              <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-[#e8e6f0]" />

              {[
                {
                  role: 'Brand',
                  time: 'Jun 1, 2026 - 10:00 AM',
                  text: 'Campaign created — Summer Style Collection 2025',
                  color: 'bg-brand-pink',
                },
                {
                  role: 'System',
                  time: 'Jun 1, 2026 - 10:02 AM',
                  text: 'Campaign submitted for admin review',
                  color: 'bg-[#7a7a9a]',
                },
                {
                  role: 'Admin',
                  time: 'Jun 1, 2026 - 11:30 AM',
                  text: 'Campaign approved — Chisom Adeyemi',
                  color: 'bg-[#f59e0b]',
                },
                {
                  role: 'Brand',
                  time: 'Jun 1, 2026 - 2:15 PM',
                  text: 'Escrow funded — ₦3,712,500 secured',
                  color: 'bg-[#16a34a]',
                },
                {
                  role: 'System',
                  time: 'Jun 1, 2026 - 2:16 PM',
                  text: 'Campaign published — Applications opened (48hr window)',
                  color: 'bg-[#7a7a9a]',
                },
                {
                  role: 'Creator',
                  time: 'Jun 1, 2026 - 3:05 PM',
                  text: 'Amara Osei applied — fee: ₦120,000',
                  color: 'bg-brand-pink',
                },
                {
                  role: 'Creator',
                  time: 'Jun 1, 2026 - 4:22 PM',
                  text: 'Tolu Fashola applied — fee: ₦250,000',
                  color: 'bg-brand-pink',
                },
                {
                  role: 'System',
                  time: 'Jun 3, 2026 - 2:16 PM',
                  text: 'Applications closed automatically after 48hrs',
                  color: 'bg-[#7a7a9a]',
                },
                {
                  role: 'Brand',
                  time: 'Jun 3, 2026 - 4:00 PM',
                  text: 'Creator selection completed — 3 creators chosen',
                  color: 'bg-[#16a34a]',
                },
                {
                  role: 'System',
                  time: 'Jun 3, 2026 - 4:01 PM',
                  text: 'Other 44 applications automatically declined',
                  color: 'bg-[#7a7a9a]',
                },
                {
                  role: 'Creator',
                  time: 'Jun 4, 2026 - 8:30 AM',
                  text: 'Amara Osei accepted campaign',
                  color: 'bg-brand-pink',
                },
                {
                  role: 'Creator',
                  time: 'Jun 4, 2026 - 9:14 AM',
                  text: 'Amara Osei submitted content for review',
                  color: 'bg-brand-pink',
                },
              ].map((ev, i) => (
                <div key={i} className="relative flex flex-col gap-1 items-start text-left">
                  <div
                    className={cn(
                      'absolute -left-[22px] top-1 w-3.5 h-3.5 rounded-full border-4 border-white shadow-sm ring-1 ring-[#e8e6f0]',
                      ev.color,
                    )}
                  />

                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider',
                        ev.role === 'Brand'
                          ? 'bg-[#fff1f2] text-brand-pink'
                          : ev.role === 'Admin'
                            ? 'bg-[#fff7ed] text-[#ea580c]'
                            : ev.role === 'Creator'
                              ? 'bg-[#f5f3ff] text-[#7c3aed]'
                              : 'bg-[#faf9fc] text-[#5a5a7a]',
                      )}
                    >
                      {ev.role}
                    </span>
                    <span className="text-[10px] text-[#9a99b0] font-semibold">{ev.time}</span>
                  </div>
                  <p className="text-xs text-[#1a1a2e] font-bold mt-0.5">{ev.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 6: Admin Actions */}
        {activeTab === 'Admin Actions' && (
          <div className="flex flex-col gap-6 text-left">
            <div className="bg-[#fff7ed]/50 border border-[#fde68a]/50 rounded-2xl p-4.5 flex items-start gap-3 text-xs leading-relaxed text-[#92400e] font-medium">
              <Info size={15} className="shrink-0 mt-0.5 text-[#ea580c]" />
              <span>
                All administrative actions require a reason and are permanently recorded in the
                audit log with your identity and timestamp. Financial actions require mandatory
                reasoning.
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: 'Pause Campaign',
                  desc: 'Temporarily suspend all campaign activity',
                  icon: Pause,
                  color: 'text-[#f59e0b] bg-[#fff7ed]',
                },
                {
                  title: 'Resume Campaign',
                  desc: 'Resume a paused campaign',
                  icon: Play,
                  color: 'text-[#16a34a] bg-[#f0fdf4]',
                },
                {
                  title: 'Cancel Campaign',
                  desc: 'Permanently cancel this campaign',
                  icon: X,
                  color: 'text-[#dc2626] bg-[#fef2f2]',
                },
                {
                  title: 'Hold Escrow Funds',
                  desc: 'Freeze escrow pending investigation',
                  icon: Lock,
                  color: 'text-[#7c3aed] bg-[#f5f3ff]',
                },
                {
                  title: 'Release Escrow Funds',
                  desc: 'Manually release funds to creator',
                  icon: Unlock,
                  color: 'text-[#2563eb] bg-[#eff6ff]',
                },
                {
                  title: 'Refund Campaign',
                  desc: 'Initiate refund to brand',
                  icon: RefreshCw,
                  color: 'text-[#92400e] bg-[#fff7ed]',
                },
                {
                  title: 'Extend Application Deadline',
                  desc: 'Give more time for applications',
                  icon: Calendar,
                  color: 'text-brand-pink bg-[#fff1f2]',
                },
                {
                  title: 'Trigger Manual Verification',
                  desc: 'Manually verify posted content',
                  icon: Check,
                  color: 'text-[#16a34a] bg-[#f0fdf4]',
                },
              ].map((act, i) => (
                <div
                  key={i}
                  className="bg-white border border-[#e8e6f0]/60 rounded-2xl p-4 flex items-center justify-between gap-4 cursor-pointer hover:border-brand-pink/30 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'w-9 h-9 rounded-xl flex items-center justify-center border border-transparent',
                        act.color,
                      )}
                    >
                      <act.icon size={15} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#1a1a2e] group-hover:text-brand-pink transition-colors">
                        {act.title}
                      </span>
                      <span className="text-[10px] text-[#9a99b0] font-semibold mt-0.5">
                        {act.desc}
                      </span>
                    </div>
                  </div>
                  <RefreshCw
                    size={13}
                    className="text-[#9a99b0] opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 7: Audit Log */}
        {activeTab === 'Audit Log' && (
          <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-5 text-left">
            <div className="flex justify-between items-center border-b border-[#e8e6f0]/40 pb-3">
              <h3 className="text-xs font-bold text-[#1a1a2e] uppercase tracking-wider">
                Audit Log &mdash; Immutable administrative record
              </h3>
              <button className="h-8.5 px-3.5 border border-[#e8e6f0] text-[10px] font-bold text-[#5a5a7a] rounded-lg hover:bg-[#faf9fc] transition-colors cursor-pointer flex items-center gap-1.5">
                <Download size={11} /> Export
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#e8e6f0]/40 text-[9px] font-bold text-[#9a99b0] uppercase tracking-wider">
                    <th className="pb-3 pl-2">Admin</th>
                    <th className="pb-3">Role</th>
                    <th className="pb-3">Action</th>
                    <th className="pb-3">Previous Value</th>
                    <th className="pb-3">New Value</th>
                    <th className="pb-3">Reason</th>
                    <th className="pb-3">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e8e6f0]/30 font-medium">
                  {[
                    {
                      admin: 'Chisom A.',
                      action: 'Campaign Approved',
                      prev: 'Pending Review',
                      next: 'Live',
                      reason: 'Brief complete and compliant',
                      time: 'Jun 1 11:30',
                    },
                    {
                      admin: 'Chisom A.',
                      action: 'Escrow Released',
                      prev: 'Held',
                      next: 'Released',
                      reason: 'Verification confirmed',
                      time: 'Jun 15 09:00',
                    },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-[#faf9fc]/30">
                      <td className="py-3.5 pl-2 font-bold text-[#1a1a2e]">{row.admin}</td>
                      <td className="py-3.5">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#fff1f2] text-brand-pink">
                          Super Admin
                        </span>
                      </td>
                      <td className="py-3.5 font-semibold text-[#1a1a2e]">{row.action}</td>
                      <td className="py-3.5 text-[#7a7a9a] font-medium">{row.prev}</td>
                      <td className="py-3.5">
                        <span className="text-[#16a34a] font-bold">{row.next}</span>
                      </td>
                      <td className="py-3.5 text-[#5a5a7a] font-medium">{row.reason}</td>
                      <td className="py-3.5 text-[#9a99b0] font-semibold">{row.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Slide-over Creator Drawer */}
      {selectedCreatorForDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setSelectedCreatorForDrawer(null)}
          />

          <div className="relative z-10 w-full max-w-[400px] h-full bg-white shadow-2xl flex flex-col overflow-y-auto">
            <div className="bg-[#121026] text-white p-5 pt-8 relative flex flex-col gap-4 text-left">
              <button
                onClick={() => setSelectedCreatorForDrawer(null)}
                className="absolute right-4 top-4 p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white cursor-pointer"
              >
                <X size={15} />
              </button>

              <div className="flex gap-4 items-center mt-3">
                <div className="w-16 h-16 rounded-full border-2 border-brand-pink flex items-center justify-center overflow-hidden bg-white shrink-0">
                  <UserAvatar initials={selectedCreatorForDrawer.initials} size={64} />
                </div>
                <div className="flex-1 flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[15px] font-bold leading-tight">
                      {selectedCreatorForDrawer.name}
                    </span>
                    <span className="text-[11px] font-bold text-[#f59e0b]">
                      ★ {selectedCreatorForDrawer.rating}
                    </span>
                  </div>
                  <span className="text-xs text-[#9a99b0] mt-0.5">
                    {selectedCreatorForDrawer.handle}
                  </span>
                  <span className="text-[10px] text-[#9a99b0] font-semibold mt-1">
                    {selectedCreatorForDrawer.location}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 mt-2">
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-[#fff1f2] text-brand-pink border border-[#ffe4e6] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-pink" />
                  {selectedCreatorForDrawer.status}
                </span>

                <a
                  href="/admin/users/creators"
                  className="text-[10px] font-bold text-white/90 hover:text-white flex items-center gap-1"
                >
                  View profile <ArrowRight size={11} />
                </a>
              </div>
            </div>

            <div className="p-5 flex flex-col gap-4 text-left flex-1 bg-[#faf9fc]">
              <div className="flex justify-between items-center gap-2">
                <span className="text-xs font-bold text-[#1a1a2e]">Instagram</span>
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-[#fff7ed] text-[#ea580c] border border-[#ffedd5]">
                  Revision requested
                </span>
              </div>
              <span className="text-[9px] text-[#9a99b0] font-semibold -mt-2.5">
                Submitted 2 hours ago
              </span>

              <div className="bg-white border border-[#e8e6f0]/60 rounded-2xl p-4 flex flex-col gap-2">
                <span className="text-[9px] font-bold text-[#9a99b0] uppercase tracking-wider">
                  Content Link
                </span>
                <a
                  href="https://instagram.com/p/example1"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-brand-pink hover:underline flex items-center gap-1 w-fit"
                >
                  https://instagram.com/p/example1 <ExternalLink size={11} />
                </a>
                <p className="text-xs text-[#5a5a7a] font-medium italic mt-0.5">
                  “Shot at Lekki beach during golden hour. Used trending audio. Caption ideas
                  included in the doc.”
                </p>

                <div className="bg-[#fff7ed]/50 border border-[#fde68a]/50 rounded-xl p-3 flex items-start gap-2 text-xs leading-relaxed text-[#92400e] font-medium mt-1">
                  <Info size={13} className="shrink-0 mt-0.5 text-[#f59e0b]" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#b45309]">
                      Revision Request
                    </span>
                    <span>
                      Great take overall! Please add the Audiomack app UI briefly &mdash; it was
                      missing from this submission. Also, the hashtag #AudiomackAfrobeats needs to
                      be in the caption.
                    </span>
                  </div>
                </div>

                <div className="border border-[#dbeafe] bg-[#eff6ff]/20 rounded-xl p-3 flex flex-col gap-1.5 mt-2 text-xs leading-relaxed text-[#2563eb]">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#1d4ed8]">
                    Revised Content
                  </span>
                  <a
                    href="https://instagram.com/p/example1"
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold flex items-center gap-1 w-fit"
                  >
                    https://instagram.com/p/example1 <ExternalLink size={11} />
                  </a>
                  <p className="text-[#5a5a7a] font-medium italic mt-0.5">
                    “Shot at Lekki beach during golden hour. Used trending audio. Caption ideas
                    included in the doc.”
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
