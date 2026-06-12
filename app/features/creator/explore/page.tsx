'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import CampaignCard from '@/components/dashboard/CampaignCard';
import CampaignDetailsDrawer from '@/components/dashboard/CampaignDetailsDrawer';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type MainTab = 'campaigns' | 'brands' | 'creators';
type SubFilter = 'all' | 'live' | 'trendupp' | 'closed';

interface Campaign {
  id: number;
  title: string;
  brand: string;
  budget: string;
  daysLeft: string;
  tier: string;
  appliedCount: number;
  status: 'live' | 'closed';
  isTrendupp: boolean;
  image: string;
}

const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: 1,
    title: 'Summer Style Collection',
    brand: 'Zara Africa',
    budget: '₦150K–₦300K',
    daysLeft: '4d',
    tier: 'Micro',
    appliedCount: 47,
    status: 'live',
    isTrendupp: true,
    image:
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    title: 'Summer Style Collection',
    brand: 'Zara Africa',
    budget: '₦150K–₦300K',
    daysLeft: '4d',
    tier: 'Micro',
    appliedCount: 47,
    status: 'live',
    isTrendupp: false,
    image:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    title: 'Summer Style Collection',
    brand: 'Zara Africa',
    budget: '₦150K–₦300K',
    daysLeft: '4d',
    tier: 'Micro',
    appliedCount: 47,
    status: 'live',
    isTrendupp: true,
    image:
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    title: 'Summer Style Collection',
    brand: 'Zara Africa',
    budget: '₦150K–₦300K',
    daysLeft: '4d',
    tier: 'Micro',
    appliedCount: 47,
    status: 'live',
    isTrendupp: false,
    image:
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 5,
    title: 'Summer Style Collection',
    brand: 'Zara Africa',
    budget: '₦150K–₦300K',
    daysLeft: '4d',
    tier: 'Micro',
    appliedCount: 47,
    status: 'live',
    isTrendupp: true,
    image:
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 6,
    title: 'Summer Style Collection',
    brand: 'Zara Africa',
    budget: '₦150K–₦300K',
    daysLeft: '4d',
    tier: 'Micro',
    appliedCount: 47,
    status: 'live',
    isTrendupp: false,
    image:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  },
];

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState<MainTab>('campaigns');
  const [activeFilter, setActiveFilter] = useState<SubFilter>('all');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  // Filter logic
  const filteredCampaigns = MOCK_CAMPAIGNS.filter((campaign) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'live') return campaign.status === 'live';
    if (activeFilter === 'closed') return campaign.status === 'closed';
    if (activeFilter === 'trendupp') return campaign.isTrendupp;
    return true;
  });

  return (
    <div className="flex flex-col gap-6 w-full pb-12 select-none">
      {/* Page Title block */}
      <div className="flex flex-col gap-1">
        <h1 className="text-[28px] font-bold text-[#1a1a2e]">Campaigns</h1>
        <p className="text-sm font-light text-[#7a7a9a]">
          You have {filteredCampaigns.length} live campaigns
        </p>
      </div>

      {/* Search & Filter Row */}
      <div className="flex items-center gap-3 mt-1 shrink-0">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9a99b0]" />
          <input
            type="text"
            placeholder="Search..."
            className="w-[320px] h-10 bg-white border border-[#e8e6f0]/60 rounded-xl pl-10 pr-4 text-xs font-light text-[#1a1a2e] focus:outline-none focus:ring-1 focus:ring-brand-pink/30 placeholder-[#9a99b0]"
          />
        </div>

        <button className="h-10 px-4 bg-white border border-[#e8e6f0]/60 hover:bg-zinc-50 rounded-xl text-xs font-semibold text-[#5a5a7a] flex items-center gap-1.5 transition-colors focus:outline-none">
          <SlidersHorizontal size={14} className="text-[#9a99b0]" />
          Filter
        </button>
      </div>

      {/* Navigation Tabs (Campaigns, Brands, Creators) */}
      <div className="border-b border-[#e8e6f0]/40 flex gap-6 text-sm font-medium text-[#7a7a9a] pb-0 mt-3 shrink-0">
        {(['campaigns', 'brands', 'creators'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'pb-2.5 transition-all relative capitalize focus:outline-none',
              activeTab === tab
                ? 'text-brand-pink font-semibold border-b-2 border-brand-pink'
                : 'hover:text-brand-pink',
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Sub-Filters Pill Row */}
      {activeTab === 'campaigns' && (
        <div className="flex items-center gap-2 mt-1 shrink-0">
          {(['all', 'live', 'trendupp', 'closed'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                'px-4.5 py-2 text-xs font-medium rounded-full border border-transparent transition-all capitalize',
                activeFilter === filter
                  ? 'bg-brand-pink text-white border-brand-pink shadow-[0_2px_8px_rgba(215,23,111,0.15)]'
                  : 'bg-white text-[#7a7a9a] border-[#e8e6f0]/70 hover:border-[#d7176f]/30',
              )}
            >
              {filter === 'all' && 'All'}
              {filter === 'live' && 'Live'}
              {filter === 'trendupp' && 'Trendupp'}
              {filter === 'closed' && 'Closed'}
            </button>
          ))}
        </div>
      )}

      {/* Campaigns Grid */}
      {activeTab === 'campaigns' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {filteredCampaigns.map((campaign) => (
            <div key={campaign.id} onClick={() => setSelectedCampaign(campaign)}>
              <CampaignCard
                title={campaign.title}
                brand={campaign.brand}
                budget={campaign.budget}
                daysLeft={campaign.daysLeft}
                tier={campaign.tier}
                appliedCount={campaign.appliedCount}
                image={campaign.image}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-[#9a99b0] gap-2 bg-white border border-[#e8e6f0]/40 rounded-3xl mt-4">
          <span className="text-sm">No {activeTab} available at the moment.</span>
        </div>
      )}

      {/* Slide-out details drawer */}
      <CampaignDetailsDrawer
        isOpen={!!selectedCampaign}
        onClose={() => setSelectedCampaign(null)}
        campaign={selectedCampaign}
      />
    </div>
  );
}
