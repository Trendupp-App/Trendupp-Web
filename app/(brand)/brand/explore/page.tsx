'use client';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ExploreHeader from '@/components/BrandExplore/ExploreHeader';
import ExploreSearchBar from '@/components/BrandExplore/ExploreSearchBar';
import ExploreTabs, { type ExploreTab } from '@/components/BrandExplore/ExploreTabs';
import CategoryPillRow from '@/components/BrandExplore/CategoryPillRow';
import CreatorsExploreTab from '@/components/BrandExplore/CreatorsExploreTab';
import BrandsExploreTab from '@/components/BrandExplore/BrandExploreTab';
import NewsExploreTab from '@/components/BrandExplore/NewsExploreTab';
import CreatorProfileSheet from '@/components/campaign-details/CreatorProfileSheet';
import BrandProfileSheet from '@/components/BrandExplore/BrandProfileSheet';
import { useExploreCreators, useExploreBrands, useExploreSearch } from '@/hooks/useExplore';
import { useNiches, useIndustries } from '@/hooks/useOnboardingQueries';
import type { ExploreCreator, ExploreBrand } from '@/types/explore';
import CampaignsExploreTab from '@/components/BrandExplore/CampaignExploreTab';
import { useCampaignsInfinite } from '@/hooks/useCampaign';
import InfiniteScrollSentinel from '@/shared/InfiniteScrollSentinel';
import CampaignFilterPillRow, { type CampaignStatusFilter } from '@/shared/CampaignFilterPillRow';
import ExploreSearchResults from '@/components/BrandExplore/ExploreSearchResults';
import CampaignDetailsSheet from '@/components/BrandExplore/CampaignDetailsSheet';
import { Campaign } from '@/types/campaign';

const VALID_TABS: ExploreTab[] = ['campaigns', 'creators', 'brands', 'news'];
const CAMPAIGNS_PAGE_SIZE = 12;

export default function ExplorePage() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const initialTab: ExploreTab = VALID_TABS.includes(tabParam as ExploreTab)
    ? (tabParam as ExploreTab)
    : 'campaigns';

  const [activeTab, setActiveTab] = useState<ExploreTab>(initialTab);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [activeCampaignFilter, setActiveCampaignFilter] = useState<CampaignStatusFilter>('all');
  const isSearching = searchValue.trim().length > 0;

  const [selectedCreatorId, setSelectedCreatorId] = useState<string | null>(null);
  const [creatorSheetOpen, setCreatorSheetOpen] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [brandSheetOpen, setBrandSheetOpen] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [campaignSheetOpen, setCampaignSheetOpen] = useState(false);
  const { data: niches } = useNiches();
  const { data: industries } = useIndustries();

  const {
    campaigns,
    isLoading: campaignsLoading,
    isError: campaignsError,
    isFetchingNextPage: campaignsFetchingNext,
    hasNextPage: campaignsHasNextPage,
    fetchNextPage: fetchNextCampaignsPage,
  } = useCampaignsInfinite(
    {
      status:
        activeCampaignFilter === 'all'
          ? 'all'
          : activeCampaignFilter === 'live'
            ? 'live'
            : 'completed',
      limit: CAMPAIGNS_PAGE_SIZE,
    },
    !isSearching && activeTab === 'campaigns',
  );

  const {
    data: creators,
    isLoading: creatorsLoading,
    isError: creatorsError,
  } = useExploreCreators(activeCategoryId, !isSearching && activeTab === 'creators');

  const {
    data: brands,
    isLoading: brandsLoading,
    isError: brandsError,
  } = useExploreBrands(activeCategoryId, !isSearching && activeTab === 'brands');

  const {
    data: searchResults,
    isLoading: searchLoading,
    isError: searchError,
  } = useExploreSearch(searchValue, isSearching);

  function handleTabChange(tab: ExploreTab) {
    setActiveTab(tab);
    setActiveCategoryId(null);
  }

  function handleCampaignFilterChange(filter: CampaignStatusFilter) {
    setActiveCampaignFilter(filter);
  }

  function handleViewCreator(creator: ExploreCreator) {
    setSelectedCreatorId(creator.id);
    setCreatorSheetOpen(true);
  }
  function handleViewCampaign(campaign: Campaign) {
    setSelectedCampaignId(campaign.id);
    setCampaignSheetOpen(true);
  }

  function handleViewBrand(brand: ExploreBrand) {
    setSelectedBrandId(brand.id);
    setBrandSheetOpen(true);
  }

  return (
    <div className="flex flex-col gap-6">
      <ExploreHeader />
      <div className="flex items-center gap-3">
        <ExploreSearchBar value={searchValue} onChange={setSearchValue} />
      </div>

      <ExploreTabs active={activeTab} onChange={handleTabChange} />
      {isSearching ? (
        <ExploreSearchResults
          query={searchValue.trim()}
          results={searchResults}
          isLoading={searchLoading}
          isError={searchError}
          onViewCampaign={handleViewCampaign}
          onViewCreator={handleViewCreator}
          onViewBrand={handleViewBrand}
        />
      ) : (
        <>
          {activeTab === 'campaigns' && (
            <>
              <CampaignFilterPillRow
                active={activeCampaignFilter}
                onChange={handleCampaignFilterChange}
              />
              <CampaignsExploreTab
                campaigns={campaigns}
                isLoading={campaignsLoading}
                isError={campaignsError}
              />
              <InfiniteScrollSentinel
                onIntersect={fetchNextCampaignsPage}
                enabled={!!campaignsHasNextPage}
                isLoading={campaignsFetchingNext}
              />
            </>
          )}

          {activeTab === 'creators' && (
            <>
              <CategoryPillRow
                categories={niches ?? []}
                activeId={activeCategoryId}
                onChange={setActiveCategoryId}
              />
              <CreatorsExploreTab
                creators={creators}
                isLoading={creatorsLoading}
                isError={creatorsError}
                onView={handleViewCreator}
              />
            </>
          )}

          {activeTab === 'brands' && (
            <>
              <CategoryPillRow
                categories={industries ?? []}
                activeId={activeCategoryId}
                onChange={setActiveCategoryId}
              />
              <BrandsExploreTab
                brands={brands}
                isLoading={brandsLoading}
                isError={brandsError}
                onView={handleViewBrand}
              />
            </>
          )}

          {activeTab === 'news' && <NewsExploreTab />}
        </>
      )}
      <CreatorProfileSheet
        creatorId={selectedCreatorId}
        open={creatorSheetOpen}
        onOpenChange={setCreatorSheetOpen}
      />

      <CampaignDetailsSheet
        campaignId={selectedCampaignId}
        open={campaignSheetOpen}
        onOpenChange={setCampaignSheetOpen}
      />

      <BrandProfileSheet
        brandId={selectedBrandId}
        open={brandSheetOpen}
        onOpenChange={setBrandSheetOpen}
      />
    </div>
  );
}
