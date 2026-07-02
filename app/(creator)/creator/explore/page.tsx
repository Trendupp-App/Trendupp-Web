'use client';

import { useState } from 'react';
import CampaignCard from '@/components/creator-dashboard/CampaignCard';
import BrandCard from '@/components/creator-dashboard/BrandCard';
import BrandProfileDrawer from '@/components/creator-dashboard/BrandProfileDrawer';
import CreatorCard from '@/components/creator-dashboard/CreatorCard';
import CreatorProfileDrawer from '@/components/creator-dashboard/CreatorProfileDrawer';
import CampaignDetailsDrawer from '@/components/creator-dashboard/CampaignDetailsDrawer';
import CampaignFilterModal, {
  FilterState,
} from '@/components/creator-dashboard/CampaignFilterModal';
import { cn } from '@/lib/utils';

type MainTab = 'campaigns' | 'brands' | 'creators';
type CampaignFilter = 'all' | 'live' | 'past' | 'social impact';

import {
  Campaign,
  Brand,
  Creator,
  MOCK_CAMPAIGNS,
  MOCK_BRANDS,
  MOCK_CREATORS,
} from '@/constants/mockData';

const MAIN_TABS = [
  { id: 'campaigns', label: 'Campaigns' },
  { id: 'brands', label: 'Brands' },
  { id: 'creators', label: 'Creators' },
] as const;

const CAMPAIGN_FILTERS: { id: CampaignFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'live', label: 'Live' },
  { id: 'past', label: 'Past' },
  { id: 'social impact', label: 'Social Impact' },
];

const BRAND_FILTERS = [
  'All',
  'FMCG',
  'Technology',
  'Finance',
  'Healthcare',
  'Education',
  'Fashion',
  'Beauty',
  'Food & Beverage',
  'Retail',
  'Real Estate',
] as const;

const CREATOR_FILTERS = [
  'All',
  'Fashion',
  'Tech',
  'Food',
  'Beauty',
  'Lifestyle',
  'Finance',
  'Music',
  'Sport',
  'Travel',
] as const;

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState<MainTab>('campaigns');
  const [activeCampaignFilter, setActiveCampaignFilter] = useState<CampaignFilter>('all');
  const [activeBrandFilter, setActiveBrandFilter] = useState<string>('All');
  const [activeCreatorFilter, setActiveCreatorFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);

  // Filter modal visibility & settings
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterModalKey, setFilterModalKey] = useState(0);
  const [campaignFilters, setCampaignFilters] = useState<FilterState>({
    sortBy: 'Newest',
    platforms: [],
    niches: [],
    campaignGoal: null,
  });

  // Filter campaigns
  const filteredCampaigns = MOCK_CAMPAIGNS.filter((campaign) => {
    const matchesSearch =
      campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.brand.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (activeCampaignFilter === 'live' && campaign.status !== 'live') return false;
    if (activeCampaignFilter === 'past' && campaign.status !== 'past') return false;
    if (activeCampaignFilter === 'social impact' && !campaign.isSocialImpact) return false;

    if (campaignFilters.platforms.length > 0) {
      const hasMatchingPlatform = campaign.platforms?.some((p) => {
        const normalized = p === 'X (Twitter)' ? 'X' : p;
        return campaignFilters.platforms.includes(normalized);
      });
      if (!hasMatchingPlatform) return false;
    }

    // Niche filter
    if (campaignFilters.niches.length > 0) {
      const hasMatchingNiche = campaign.niches?.some((n) => campaignFilters.niches.includes(n));
      if (!hasMatchingNiche) return false;
    }

    // Campaign Goal filter
    if (campaignFilters.campaignGoal) {
      if (campaign.goal !== campaignFilters.campaignGoal) return false;
    }

    return true;
  });

  // Sort campaigns
  const sortedCampaigns = [...filteredCampaigns].sort((a, b) => {
    if (campaignFilters.sortBy === 'Newest') {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    }
    if (campaignFilters.sortBy === 'Closing Soon') {
      const daysA = a.daysLeftNumber ?? 999999;
      const daysB = b.daysLeftNumber ?? 999999;
      return daysA - daysB;
    }
    if (campaignFilters.sortBy === 'Highest Budget') {
      const budgetA = a.budgetMax ?? 0;
      const budgetB = b.budgetMax ?? 0;
      return budgetB - budgetA;
    }
    return 0;
  });

  // Filter brands
  const filteredBrands = MOCK_BRANDS.filter((brand) => {
    const matchesSearch =
      brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brand.category.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (
      activeBrandFilter !== 'All' &&
      brand.category.toLowerCase() !== activeBrandFilter.toLowerCase()
    )
      return false;
    return true;
  });

  // Filter creators
  const filteredCreators = MOCK_CREATORS.filter((creator) => {
    const matchesSearch =
      creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.category.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (
      activeCreatorFilter !== 'All' &&
      creator.category.toLowerCase() !== activeCreatorFilter.toLowerCase()
    )
      return false;
    return true;
  });

  // Count label
  const countLabel =
    activeTab === 'campaigns'
      ? `${sortedCampaigns.length} campaign${sortedCampaigns.length !== 1 ? 's' : ''}`
      : activeTab === 'brands'
        ? `${filteredBrands.length} brand${filteredBrands.length !== 1 ? 's' : ''}`
        : activeTab === 'creators'
          ? `${filteredCreators.length} creator${filteredCreators.length !== 1 ? 's' : ''}`
          : '2 updates';

  return (
    <div className="flex flex-col gap-0 w-full pb-16 select-none">
      {/* Mobile Title & Filters Row */}
      <div className="flex md:hidden items-center justify-between mb-4 w-full shrink-0">
        <h1 className="text-2xl font-bold text-[#1a1a2e] tracking-tight">Explore</h1>
        {activeTab === 'campaigns' && (
          <button
            onClick={() => {
              setFilterModalKey((prev) => prev + 1);
              setIsFilterModalOpen(true);
            }}
            className="py-1.5 px-3 bg-[#e8e6f0]/50 hover:bg-[#e8e6f0]/80 rounded-full flex items-center gap-1.5 text-xs font-semibold text-[#1a1a2e] focus:outline-none border-none cursor-pointer transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-3.5 h-3.5 text-[#1a1a2e]"
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            <span>Filters</span>
          </button>
        )}
      </div>

      {/* Mobile Search Bar */}
      <div className="flex md:hidden relative w-full mb-5 shrink-0">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9a99b0]"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="text"
          placeholder="Search campaigns, brands..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-11 bg-white border border-[#e8e6f0]/80 rounded-[18px] pl-11 pr-4 text-xs font-light text-[#1a1a2e] focus:outline-none focus:ring-1 focus:ring-brand-pink/30 placeholder-[#9a99b0] shadow-sm"
        />
      </div>

      {/* Desktop Page Title (hidden on mobile, matches headerTitle of dashboard layout) */}
      <div className="hidden md:flex flex-col gap-1 mb-5 shrink-0">
        <h1 className="text-2xl font-bold text-[#1a1a2e] tracking-tight">Campaigns</h1>
        <p className="text-xs font-light text-[#7a7a9a]">You have 6 live campaigns</p>
      </div>

      {/* Desktop Search & Filter Row (hidden on mobile) */}
      <div className="hidden md:flex items-center gap-3 mb-5 shrink-0">
        <div className="relative w-[320px]">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9a99b0]"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 bg-white border border-[#e8e6f0]/80 rounded-2xl pl-11 pr-4 text-xs font-light text-[#1a1a2e] focus:outline-none focus:ring-1 focus:ring-brand-pink/30 placeholder-[#9a99b0] shadow-sm"
          />
        </div>
        {activeTab === 'campaigns' && (
          <button
            onClick={() => {
              setFilterModalKey((prev) => prev + 1);
              setIsFilterModalOpen(true);
            }}
            className="h-10 bg-white border border-[#e8e6f0]/80 rounded-2xl px-5 flex items-center gap-2 text-xs font-semibold text-[#1a1a2e] hover:bg-[#fcfbfd] transition-colors shadow-sm focus:outline-none cursor-pointer"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4 text-[#1a1a2e]"
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            <span>Filter</span>
          </button>
        )}
      </div>

      {/* ── Main Tabs: Campaigns | Brands | Creators ── */}
      <div className="border-b border-[#e8e6f0]/40 flex w-full md:w-auto md:justify-start gap-0 md:gap-8 text-sm font-medium text-[#7a7a9a] shrink-0 mb-4">
        {MAIN_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex-1 md:flex-none text-center pb-2.5 transition-all relative focus:outline-none whitespace-nowrap',
              activeTab === tab.id
                ? 'text-brand-pink font-semibold border-b-2 border-brand-pink'
                : 'hover:text-brand-pink',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Campaigns Sub-filter Pills ── */}
      {activeTab === 'campaigns' && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide shrink-0 mb-3">
          {CAMPAIGN_FILTERS.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveCampaignFilter(filter.id)}
              className={cn(
                'px-4 py-1.5 text-xs font-semibold rounded-full border transition-all whitespace-nowrap shrink-0',
                activeCampaignFilter === filter.id
                  ? 'bg-[#040039] text-white border-[#040039] shadow-sm'
                  : 'bg-white text-[#7a7a9a] border-[#e8e6f0]/70 hover:border-[#040039]/20',
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      )}

      {/* ── Brands Sub-filter Pills ── */}
      {activeTab === 'brands' && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide shrink-0 mb-3">
          {BRAND_FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveBrandFilter(filter)}
              className={cn(
                'px-4 py-1.5 text-xs font-semibold rounded-full border transition-all whitespace-nowrap shrink-0',
                activeBrandFilter === filter
                  ? 'bg-[#040039] text-white border-[#040039] shadow-sm'
                  : 'bg-white text-[#7a7a9a] border-[#e8e6f0]/70 hover:border-[#040039]/20',
              )}
            >
              {filter}
            </button>
          ))}
        </div>
      )}

      {/* ── Creators Sub-filter Pills ── */}
      {activeTab === 'creators' && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide shrink-0 mb-3">
          {CREATOR_FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveCreatorFilter(filter)}
              className={cn(
                'px-4 py-1.5 text-xs font-semibold rounded-full border transition-all whitespace-nowrap shrink-0',
                activeCreatorFilter === filter
                  ? 'bg-[#040039] text-white border-[#040039] shadow-sm'
                  : 'bg-white text-[#7a7a9a] border-[#e8e6f0]/70 hover:border-[#040039]/20',
              )}
            >
              {filter}
            </button>
          ))}
        </div>
      )}

      {/* ── Result Count ── */}
      <p className="text-xs font-light text-[#9a99b0] mb-3 shrink-0">{countLabel}</p>

      {/* ── Campaigns Grid ── */}
      {activeTab === 'campaigns' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
          {sortedCampaigns.length > 0 ? (
            sortedCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                onClick={() => setSelectedCampaign(campaign)}
                className="cursor-pointer"
              >
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
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-[#9a99b0] gap-2">
              <span className="text-sm">No campaigns found</span>
            </div>
          )}
        </div>
      )}

      {/* ── Brands List ── */}
      {activeTab === 'brands' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {filteredBrands.length > 0 ? (
            filteredBrands.map((brand) => (
              <BrandCard
                key={brand.id}
                name={brand.name}
                category={brand.category}
                campaignCount={brand.campaignCount}
                followerCount={brand.followerCount}
                image={brand.image}
                onClick={() => setSelectedBrand(brand)}
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-[#9a99b0] gap-2">
              <span className="text-sm">No brands found</span>
            </div>
          )}
        </div>
      )}

      {/* ── Creators List ── */}
      {activeTab === 'creators' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {filteredCreators.length > 0 ? (
            filteredCreators.map((creator) => (
              <CreatorCard
                key={creator.id}
                name={creator.name}
                handle={creator.handle}
                category={creator.category}
                displayCategory={creator.displayCategory}
                tier={creator.tier}
                rating={creator.rating}
                campaignCount={creator.campaignCount}
                image={creator.image}
                followers={creator.followers}
                reach={creator.reach}
                engagement={creator.engagement}
                onClick={() => setSelectedCreator(creator)}
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-[#9a99b0] gap-2">
              <span className="text-sm">No creators found</span>
            </div>
          )}
        </div>
      )}

      {/* ── Campaign Details Slide-out Drawer ── */}
      <CampaignDetailsDrawer
        isOpen={!!selectedCampaign}
        onClose={() => setSelectedCampaign(null)}
        campaign={selectedCampaign}
      />

      {/* ── Brand Profile Drawer ── */}
      <BrandProfileDrawer
        isOpen={!!selectedBrand}
        onClose={() => setSelectedBrand(null)}
        brand={selectedBrand}
      />

      {/* ── Creator Profile Drawer ── */}
      <CreatorProfileDrawer
        isOpen={!!selectedCreator}
        onClose={() => setSelectedCreator(null)}
        creator={selectedCreator}
      />

      {/* ── Campaign Filter & Sort Modal ── */}
      <CampaignFilterModal
        key={filterModalKey}
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        currentFilters={campaignFilters}
        onApply={(filters) => setCampaignFilters(filters)}
        onReset={() =>
          setCampaignFilters({
            sortBy: 'Newest',
            platforms: [],
            niches: [],
            campaignGoal: null,
          })
        }
      />
    </div>
  );
}
