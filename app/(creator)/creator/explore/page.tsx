'use client';

import { useState } from 'react';
import CampaignDetailsDrawer, {
  MappedCampaign,
} from '@/components/creator-dashboard/CampaignDetailsDrawer';
import CampaignFilterModal, {
  FilterState,
} from '@/components/creator-dashboard/CampaignFilterModal';
import CategoryPillRow from '@/components/BrandExplore/CategoryPillRow';
import CreatorProfileSheet from '@/components/campaign-details/CreatorProfileSheet';
import BrandProfileSheet from '@/components/BrandExplore/BrandProfileSheet';

import MainTabs, { type MainTab } from '@/components/creator-dashboard/explore/MainTabs';
import CampaignFilterPillRow, {
  type CampaignStatusFilter,
} from '@/components/creator-dashboard/explore/CampaignFilterPillRow';
import CampaignsGrid from '@/components/creator-dashboard/explore/CampaignsGrid';
import BrandsList from '@/components/creator-dashboard/explore/BrandList';
import CreatorsList from '@/components/creator-dashboard/explore/CreatorList';

import { useExploreCampaigns } from '@/hooks/useExploreCampaign';
import { useExploreCreators, useExploreBrands } from '@/hooks/useExplore';
import { useNiches, useIndustries } from '@/hooks/useOnboardingQueries';
import type { ExploreCreator, ExploreBrand } from '@/types/explore';

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState<MainTab>('campaigns');
  const [activeCampaignFilter, setActiveCampaignFilter] = useState<CampaignStatusFilter>('all');
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedCampaign, setSelectedCampaign] = useState<MappedCampaign | null>(null);
  const [selectedCreatorId, setSelectedCreatorId] = useState<string | null>(null);
  const [creatorSheetOpen, setCreatorSheetOpen] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [brandSheetOpen, setBrandSheetOpen] = useState(false);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterModalKey, setFilterModalKey] = useState(0);
  const [campaignFilters, setCampaignFilters] = useState<FilterState>({
    sortBy: 'Newest',
    platforms: [],
    niches: [],
    campaignGoal: null,
  });

  const { campaigns: sortedCampaigns, isLoading: campaignsLoading } = useExploreCampaigns({
    statusFilter: activeCampaignFilter,
    searchQuery,
    filters: campaignFilters,
  });

  const { data: niches } = useNiches();
  const { data: industries } = useIndustries();

  const {
    data: creators = [],
    isLoading: creatorsLoading,
    isError: creatorsError,
  } = useExploreCreators(activeTab === 'creators' ? activeCategoryId : null);

  const {
    data: brands = [],
    isLoading: brandsLoading,
    isError: brandsError,
  } = useExploreBrands(activeTab === 'brands' ? activeCategoryId : null);

  const filteredBrands = brands.filter((brand: ExploreBrand) => {
    const name = brand.username || `${brand.firstName} ${brand.lastName}`;
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredCreators = creators.filter((creator: ExploreCreator) => {
    const name = `${creator.firstName} ${creator.lastName}`;
    return (
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  function handleTabChange(tab: MainTab) {
    setActiveTab(tab);
    setActiveCategoryId(null);
  }

  const countLabel =
    activeTab === 'campaigns'
      ? `${sortedCampaigns.length} campaign${sortedCampaigns.length !== 1 ? 's' : ''}`
      : activeTab === 'brands'
        ? `${filteredBrands.length} brand${filteredBrands.length !== 1 ? 's' : ''}`
        : `${filteredCreators.length} creator${filteredCreators.length !== 1 ? 's' : ''}`;

  return (
    <div className="flex flex-col gap-0 w-full pb-16 select-none">
      {/* Title + search + filter chrome (mobile/desktop) — see note below */}
      <div className="hidden md:flex flex-col gap-1 mb-5 shrink-0">
        <h1 className="text-2xl font-bold text-[#1a1a2e] tracking-tight">Explore</h1>
      </div>

      <div className="hidden md:flex items-center gap-3 mb-5 shrink-0">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-[320px] h-10 bg-white border border-[#e8e6f0]/80 rounded-2xl px-4 text-xs font-light text-[#1a1a2e] focus:outline-none focus:ring-1 focus:ring-brand-pink/30 shadow-sm"
        />
        {activeTab === 'campaigns' && (
          <button
            onClick={() => {
              setFilterModalKey((prev) => prev + 1);
              setIsFilterModalOpen(true);
            }}
            className="h-10 bg-white border border-[#e8e6f0]/80 rounded-2xl px-5 text-xs font-semibold text-[#1a1a2e] shadow-sm cursor-pointer"
          >
            Filter
          </button>
        )}
      </div>

      <MainTabs active={activeTab} onChange={handleTabChange} />

      {activeTab === 'campaigns' && (
        <CampaignFilterPillRow active={activeCampaignFilter} onChange={setActiveCampaignFilter} />
      )}
      {activeTab === 'brands' && (
        <CategoryPillRow
          categories={industries ?? []}
          activeId={activeCategoryId}
          onChange={setActiveCategoryId}
        />
      )}
      {activeTab === 'creators' && (
        <CategoryPillRow
          categories={niches ?? []}
          activeId={activeCategoryId}
          onChange={setActiveCategoryId}
        />
      )}

      <p className="text-xs font-light text-[#9a99b0] mb-3 shrink-0 mt-3">{countLabel}</p>

      {activeTab === 'campaigns' && (
        <CampaignsGrid
          campaigns={sortedCampaigns}
          isLoading={campaignsLoading}
          onSelect={setSelectedCampaign}
        />
      )}
      {activeTab === 'brands' && (
        <BrandsList
          brands={filteredBrands}
          isLoading={brandsLoading}
          isError={brandsError}
          onView={(b) => {
            setSelectedBrandId(b.id);
            setBrandSheetOpen(true);
          }}
        />
      )}
      {activeTab === 'creators' && (
        <CreatorsList
          creators={filteredCreators}
          isLoading={creatorsLoading}
          isError={creatorsError}
          onView={(c) => {
            setSelectedCreatorId(c.id);
            setCreatorSheetOpen(true);
          }}
        />
      )}

      <CampaignDetailsDrawer
        isOpen={!!selectedCampaign}
        onClose={() => setSelectedCampaign(null)}
        campaign={selectedCampaign}
      />
      <CreatorProfileSheet
        creatorId={selectedCreatorId}
        open={creatorSheetOpen}
        onOpenChange={setCreatorSheetOpen}
      />
      <BrandProfileSheet
        brandId={selectedBrandId}
        open={brandSheetOpen}
        onOpenChange={setBrandSheetOpen}
      />
      <CampaignFilterModal
        key={filterModalKey}
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        currentFilters={campaignFilters}
        onApply={setCampaignFilters}
        onReset={() =>
          setCampaignFilters({ sortBy: 'Newest', platforms: [], niches: [], campaignGoal: null })
        }
      />
    </div>
  );
}
