'use client';

import { useState } from 'react';
import CompletenessCard from '@/components/dashboard/CompletenessCard';
import BannerCarousel from '@/components/dashboard/BannerCarousel';
import FeaturedCampaign from '@/components/dashboard/FeaturedCampaign';
import StatCard from '@/components/dashboard/StatCard';
import CampaignCard from '@/components/dashboard/CampaignCard';
import { cn } from '@/lib/utils';

type FilterType = 'all' | 'live' | 'closed';

const MOCK_CAMPAIGNS = [
  {
    id: 1,
    title: 'Summer Style Collection',
    brand: 'Zara Africa',
    budget: '₦150K–₦300K',
    daysLeft: '4d',
    tier: 'Micro',
    appliedCount: 47,
    status: 'live' as const,
    image:
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 2,
    title: 'Summer Style Collection',
    brand: 'Zara Africa',
    budget: '₦150K–₦300K',
    daysLeft: '4d',
    tier: 'Micro',
    appliedCount: 47,
    status: 'live' as const,
    image:
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 3,
    title: 'Summer Style Collection',
    brand: 'Zara Africa',
    budget: '₦150K–₦300K',
    daysLeft: '4d',
    tier: 'Micro',
    appliedCount: 47,
    status: 'live' as const,
    image:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 4,
    title: 'Streetwear Launch Promo',
    brand: 'Zara Africa',
    budget: '₦100K–₦200K',
    daysLeft: '0d',
    tier: 'Nano',
    appliedCount: 120,
    status: 'closed' as const,
    image:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80',
  },
];

export default function CreatorDashboardPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filteredCampaigns = MOCK_CAMPAIGNS.filter((campaign) => {
    if (activeFilter === 'all') return true;
    return campaign.status === activeFilter;
  });

  return (
    <div className="flex flex-col gap-8 w-full pb-12">
      {/* Welcome Message */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-[28px] font-bold text-[#1a1a2e] tracking-tight">Hey, John</h1>
        <p className="text-sm font-light text-[#7a7a9a]">Welcome back to your creator dashboard</p>
      </div>

      {/* Row 1: Banners Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CompletenessCard percentage={20} />
        <BannerCarousel />
      </div>

      {/* Row 2: Featured Campaign & Stats Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column: Featured Campaign */}
        <div className="xl:col-span-5 h-full">
          <FeaturedCampaign />
        </div>

        {/* Right Column: Stats Grid */}
        <div className="xl:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
          <StatCard amount="₦847,000" label="Total money earned" color="pink" />
          <StatCard amount="₦847,000" label="Total money earned" color="blue" />
          <StatCard amount="₦847,000" label="Total money earned" color="yellow" />
          <StatCard amount="₦847,000" label="Total money earned" color="green" />
        </div>
      </div>

      {/* Row 3: Campaigns List Section */}
      <div className="flex flex-col gap-5 mt-2">
        {/* Filter Headers */}
        <div className="flex items-center justify-between border-b border-[#e8e6f0]/40 pb-4">
          <div className="flex items-center gap-2">
            {(['all', 'live', 'closed'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  'px-4 py-2 text-xs font-medium rounded-full transition-all border border-transparent',
                  activeFilter === filter
                    ? 'bg-brand-pink text-white border-brand-pink shadow-[0_2px_8px_rgba(215,23,111,0.15)]'
                    : 'bg-white text-[#7a7a9a] border-[#e8e6f0] hover:border-[#d7176f]/30',
                )}
              >
                {filter === 'all' && 'All'}
                {filter === 'live' && 'Live campaigns'}
                {filter === 'closed' && 'Closed campaigns'}
              </button>
            ))}
          </div>

          <button className="text-xs font-semibold text-brand-pink hover:underline">See all</button>
        </div>

        {/* Campaigns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              title={campaign.title}
              brand={campaign.brand}
              budget={campaign.budget}
              daysLeft={campaign.daysLeft}
              tier={campaign.tier}
              appliedCount={campaign.appliedCount}
              image={campaign.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
