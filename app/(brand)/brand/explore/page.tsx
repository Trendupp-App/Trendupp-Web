'use client';

import { useState } from 'react';
import ExploreHeader from '@/components/BrandExplore/ExploreHeader';
import ExploreSearchBar from '@/components/BrandExplore/ExploreSearchBar';
import ExploreTabs, { type ExploreTab } from '@/components/BrandExplore/ExploreTabs';
import CategoryPillRow from '@/components/BrandExplore/CategoryPillRow';
import CreatorsExploreTab from '@/components/BrandExplore/CreatorsExploreTab';
import BrandsExploreTab from '@/components/BrandExplore/BrandExploreTab';
import NewsExploreTab from '@/components/BrandExplore/NewsExploreTab';
import CreatorProfileSheet from '@/components/campaign-details/CreatorProfileSheet';
import BrandProfileSheet from '@/components/BrandExplore/BrandProfileSheet';
import { useExploreCreators, useExploreBrands } from '@/hooks/useExplore';
import { useNiches, useIndustries } from '@/hooks/useOnboardingQueries';
import type { ExploreCreator, ExploreBrand } from '@/types/explore';

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState<ExploreTab>('creators');
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState('');

  const [selectedCreatorId, setSelectedCreatorId] = useState<string | null>(null);
  const [creatorSheetOpen, setCreatorSheetOpen] = useState(false);

  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [brandSheetOpen, setBrandSheetOpen] = useState(false);

  const { data: niches } = useNiches();
  const { data: industries } = useIndustries();

  const {
    data: creators,
    isLoading: creatorsLoading,
    isError: creatorsError,
  } = useExploreCreators(activeTab === 'creators' ? activeCategoryId : null);

  const {
    data: brands,
    isLoading: brandsLoading,
    isError: brandsError,
  } = useExploreBrands(activeTab === 'brands' ? activeCategoryId : null);

  function handleTabChange(tab: ExploreTab) {
    setActiveTab(tab);
    setActiveCategoryId(null);
  }

  function handleViewCreator(creator: ExploreCreator) {
    setSelectedCreatorId(creator.id);
    setCreatorSheetOpen(true);
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
    </div>
  );
}
