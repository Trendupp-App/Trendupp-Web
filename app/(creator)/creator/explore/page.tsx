'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CampaignDetailsDrawer, {
  MappedCampaign,
} from '@/components/creator-dashboard/CampaignDetailsDrawer';
import CategoryPillRow from '@/components/BrandExplore/CategoryPillRow';
import CreatorProfileSheet from '@/components/campaign-details/CreatorProfileSheet';
import BrandProfileSheet from '@/components/BrandExplore/BrandProfileSheet';

import MainTabs, { type MainTab } from '@/components/creator-dashboard/explore/MainTabs';
import CampaignFilterPillRow, {
  type CampaignStatusFilter,
} from '@/components/creator-dashboard/explore/CampaignFilterPillRow';
import CampaignsGrid from '@/components/creator-dashboard/explore/CampaignsGrid';
import CampaignsPagination from '@/shared/CampaignsPagination';
import SocialImpactGrid from '@/components/creator-dashboard/explore/SocialImpactGrid';
import SocialImpactDetailSheet from '@/components/creator-dashboard/explore/SocialImpactDetailSheet';
import SocialImpactSuccessModal from '@/components/creator-dashboard/explore/SocialImpactSuccessModal';
import BrandsList from '@/components/creator-dashboard/explore/BrandList';
import CreatorsList from '@/components/creator-dashboard/explore/CreatorList';
import ExploreSearchAndFilter from '@/components/creator-dashboard/explore/ExploreSearchAndFilter';
import { useExploreCampaigns } from '@/hooks/useExploreCampaign';
import { useExploreCreators, useExploreBrands, useExploreSearch } from '@/hooks/useExplore';
import { useSocialImpactCampaigns, useMySocialImpactApplications } from '@/hooks/useCampaign';
import { useNiches, useIndustries } from '@/hooks/useOnboardingQueries';
import { mapCampaign } from '@/lib/campaignMappers';
import type { FilterState } from '@/components/creator-dashboard/CampaignFilterModal';
import type { Campaign } from '@/types/campaign';

const DEFAULT_CAMPAIGN_FILTERS: FilterState = {
  sortBy: 'Newest',
  platforms: [],
  niches: [],
  campaignGoal: null,
};

export default function ExplorePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<MainTab>('campaigns');
  const [activeCampaignFilter, setActiveCampaignFilter] = useState<CampaignStatusFilter>('all');
  const [campaignPage, setCampaignPage] = useState(1);
  const [socialImpactPage, setSocialImpactPage] = useState(1);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const isSearching = searchQuery.trim().length > 0;

  function handleCampaignFilterChange(filter: CampaignStatusFilter) {
    setActiveCampaignFilter(filter);
    setCampaignPage(1);
  }

  const [selectedCampaign, setSelectedCampaign] = useState<MappedCampaign | null>(null);
  const [selectedCreatorId, setSelectedCreatorId] = useState<string | null>(null);
  const [creatorSheetOpen, setCreatorSheetOpen] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [brandSheetOpen, setBrandSheetOpen] = useState(false);
  const [selectedSocialImpactCampaign, setSelectedSocialImpactCampaign] = useState<Campaign | null>(
    null,
  );
  const [socialImpactSheetOpen, setSocialImpactSheetOpen] = useState(false);
  const [participatedCampaign, setParticipatedCampaign] = useState<Campaign | null>(null);

  const {
    campaigns: sortedCampaigns,
    isLoading: campaignsLoadingRaw,
    pagination: campaignsPagination,
  } = useExploreCampaigns({
    statusFilter: activeCampaignFilter,
    searchQuery,
    filters: DEFAULT_CAMPAIGN_FILTERS,
    page: campaignPage,
  });

  const { data: socialImpactResponse, isLoading: socialImpactLoading } = useSocialImpactCampaigns(
    { page: socialImpactPage, limit: 12 },
    !isSearching && activeTab === 'social-impact',
  );
  const socialImpactCampaigns = socialImpactResponse?.data ?? [];
  const socialImpactPagination = socialImpactResponse?.pagination;

  const { data: mySocialImpactApplications = [] } = useMySocialImpactApplications(
    undefined,
    !isSearching && activeTab === 'social-impact',
  );
  const appliedSocialImpactCampaignIds = new Set(
    mySocialImpactApplications.map((app) => app.campaignId),
  );

  const { data: niches } = useNiches();
  const { data: industries } = useIndustries();

  const {
    data: creators = [],
    isLoading: creatorsLoading,
    isError: creatorsError,
  } = useExploreCreators(
    activeTab === 'creators' ? activeCategoryId : null,
    !isSearching && activeTab === 'creators',
  );

  const {
    data: brands = [],
    isLoading: brandsLoading,
    isError: brandsError,
  } = useExploreBrands(
    activeTab === 'brands' ? activeCategoryId : null,
    !isSearching && activeTab === 'brands',
  );

  const {
    data: searchResults,
    isLoading: searchLoading,
    isError: searchError,
  } = useExploreSearch(searchQuery, isSearching);

  const searchCampaigns = (searchResults?.campaigns.data ?? []).map(mapCampaign);
  const searchCreators = searchResults?.creators.data ?? [];
  const searchBrands = searchResults?.brands.data ?? [];

  const displayedCampaigns = isSearching ? searchCampaigns : sortedCampaigns;
  const displayedCreators = isSearching ? searchCreators : creators;
  const displayedBrands = isSearching ? searchBrands : brands;

  const campaignsLoading = isSearching ? searchLoading : campaignsLoadingRaw;
  const creatorsLoadingFinal = isSearching ? searchLoading : creatorsLoading;
  const brandsLoadingFinal = isSearching ? searchLoading : brandsLoading;
  const creatorsErrorFinal = isSearching ? searchError : creatorsError;
  const brandsErrorFinal = isSearching ? searchError : brandsError;

  const showTabChrome = !isSearching;

  function handleTabChange(tab: MainTab) {
    setActiveTab(tab);
    setActiveCategoryId(null);
    setSocialImpactPage(1);
  }

  const countLabel =
    activeTab === 'campaigns'
      ? `${displayedCampaigns.length} campaign${displayedCampaigns.length !== 1 ? 's' : ''}`
      : activeTab === 'social-impact'
        ? `${socialImpactCampaigns.length} campaign${socialImpactCampaigns.length !== 1 ? 's' : ''}`
        : activeTab === 'brands'
          ? `${displayedBrands.length} brand${displayedBrands.length !== 1 ? 's' : ''}`
          : `${displayedCreators.length} creator${displayedCreators.length !== 1 ? 's' : ''}`;

  return (
    <div className="flex flex-col gap-0 w-full pb-16 select-none">
      {/* Title + search + filter chrome (mobile/desktop) — see note below */}
      <div className="hidden md:flex flex-col gap-1 mb-5 shrink-0">
        <h1 className="text-2xl font-bold text-[#1a1a2e] tracking-tight">Explore</h1>
      </div>

      <div className="flex flex-col gap-1 mb-1 shrink-0">
        <h1 className="text-xl md:text-2xl font-bold text-[#1a1a2e] tracking-tight">
          {activeTab === 'campaigns'
            ? 'Campaigns'
            : activeTab === 'social-impact'
              ? 'Social Impact'
              : activeTab === 'brands'
                ? 'Brands'
                : 'Creators'}
        </h1>
      </div>

      <ExploreSearchAndFilter searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <MainTabs active={activeTab} onChange={handleTabChange} />

      {showTabChrome && activeTab === 'campaigns' && (
        <CampaignFilterPillRow
          active={activeCampaignFilter}
          onChange={handleCampaignFilterChange}
        />
      )}
      {showTabChrome && activeTab === 'brands' && (
        <CategoryPillRow
          categories={industries ?? []}
          activeId={activeCategoryId}
          onChange={setActiveCategoryId}
        />
      )}
      {showTabChrome && activeTab === 'creators' && (
        <CategoryPillRow
          categories={niches ?? []}
          activeId={activeCategoryId}
          onChange={setActiveCategoryId}
        />
      )}

      <p className="text-xs font-light text-[#9a99b0] mb-3 shrink-0 mt-3">{countLabel}</p>

      {activeTab === 'campaigns' && (
        <>
          <CampaignsGrid
            campaigns={displayedCampaigns}
            isLoading={campaignsLoading}
            onSelect={setSelectedCampaign}
          />
          {!isSearching && (
            <CampaignsPagination
              page={campaignPage}
              totalPages={campaignsPagination?.pages ?? 1}
              onPageChange={setCampaignPage}
            />
          )}
        </>
      )}
      {activeTab === 'social-impact' && (
        <>
          <SocialImpactGrid
            campaigns={socialImpactCampaigns}
            isLoading={socialImpactLoading}
            appliedCampaignIds={appliedSocialImpactCampaignIds}
            onViewBrief={(campaign) => {
              setSelectedSocialImpactCampaign(campaign);
              setSocialImpactSheetOpen(true);
            }}
            onParticipated={(campaign) => setParticipatedCampaign(campaign)}
          />
          {!isSearching && (
            <CampaignsPagination
              page={socialImpactPage}
              totalPages={socialImpactPagination?.pages ?? 1}
              onPageChange={setSocialImpactPage}
            />
          )}
        </>
      )}
      {activeTab === 'brands' && (
        <BrandsList
          brands={displayedBrands}
          isLoading={brandsLoadingFinal}
          isError={brandsErrorFinal}
          onView={(b) => {
            setSelectedBrandId(b.id);
            setBrandSheetOpen(true);
          }}
        />
      )}
      {activeTab === 'creators' && (
        <CreatorsList
          creators={displayedCreators}
          isLoading={creatorsLoadingFinal}
          isError={creatorsErrorFinal}
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
      <SocialImpactDetailSheet
        campaignId={selectedSocialImpactCampaign?.id ?? null}
        open={socialImpactSheetOpen}
        onOpenChange={setSocialImpactSheetOpen}
        hasApplied={
          !!selectedSocialImpactCampaign &&
          appliedSocialImpactCampaignIds.has(selectedSocialImpactCampaign.id)
        }
        onParticipated={() => {
          if (selectedSocialImpactCampaign) setParticipatedCampaign(selectedSocialImpactCampaign);
        }}
      />
      {participatedCampaign && (
        <SocialImpactSuccessModal
          campaignTitle={participatedCampaign.title}
          onGoToCampaign={() => {
            setParticipatedCampaign(null);
            router.push('/creator/my-work?tab=social-impact');
          }}
        />
      )}
    </div>
  );
}
