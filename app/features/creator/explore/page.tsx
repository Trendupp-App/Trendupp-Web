'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import CampaignCard from '@/components/dashboard/CampaignCard';
import BrandCard from '@/components/dashboard/BrandCard';
import CreatorCard from '@/components/dashboard/CreatorCard';
import NewsCard from '@/components/dashboard/NewsCard';
import CampaignDetailsDrawer from '@/components/dashboard/CampaignDetailsDrawer';
import { cn } from '@/lib/utils';

type MainTab = 'campaigns' | 'brands' | 'creators' | 'news';
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

interface Brand {
  id: number;
  name: string;
  category: 'Fashion' | 'Tech' | 'Music' | 'Food' | 'Sport' | 'Finance' | 'Beauty';
  campaignCount: number;
  followerCount: string;
  image: string;
}

const MOCK_BRANDS: Brand[] = [
  {
    id: 1,
    name: 'Zara Africa',
    category: 'Fashion',
    campaignCount: 5,
    followerCount: '2.1M',
    image:
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 2,
    name: 'Tecno Mobile',
    category: 'Tech',
    campaignCount: 5,
    followerCount: '2.1M',
    image:
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 3,
    name: 'Audiomack Africa',
    category: 'Music',
    campaignCount: 5,
    followerCount: '2.1M',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 4,
    name: 'Audiomack Africa',
    category: 'Music',
    campaignCount: 5,
    followerCount: '2.1M',
    image:
      'https://images.unsplash.com/photo-1484755560695-a4c748918c29?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 5,
    name: 'Zara Africa',
    category: 'Fashion',
    campaignCount: 5,
    followerCount: '2.1M',
    image:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 6,
    name: 'Nestlé Nigeria',
    category: 'Food',
    campaignCount: 5,
    followerCount: '2.1M',
    image:
      'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 7,
    name: 'Monster Energy NG',
    category: 'Sport',
    campaignCount: 5,
    followerCount: '2.1M',
    image:
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 8,
    name: 'GTBank',
    category: 'Finance',
    campaignCount: 5,
    followerCount: '2.1M',
    image:
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=300&q=80',
  },
];

interface Creator {
  id: number;
  name: string;
  handle: string;
  category: 'Fashion' | 'Tech' | 'Music' | 'Food' | 'Sport' | 'Finance' | 'Beauty' | 'Lifestyle';
  tier: 'Micro' | 'Nano' | 'Macro' | 'Mega';
  rating: number;
  campaignCount: number;
  image: string;
}

const MOCK_CREATORS: Creator[] = [
  {
    id: 1,
    name: 'Teni Olu',
    handle: 'teniolu',
    category: 'Food',
    tier: 'Micro',
    rating: 4.9,
    campaignCount: 7,
    image:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 2,
    name: 'Emeka Dev',
    handle: 'emekadev',
    category: 'Tech',
    tier: 'Nano',
    rating: 4.9,
    campaignCount: 7,
    image:
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 3,
    name: 'Sade Foods',
    handle: 'sadefoods',
    category: 'Food',
    tier: 'Nano',
    rating: 4.9,
    campaignCount: 7,
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 4,
    name: 'Amara Osei',
    handle: 'amaraosei',
    category: 'Beauty',
    tier: 'Macro',
    rating: 4.9,
    campaignCount: 7,
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 5,
    name: 'Bayo Speaks',
    handle: 'bayospeaks',
    category: 'Finance',
    tier: 'Mega',
    rating: 4.9,
    campaignCount: 7,
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 6,
    name: 'Chidi Style',
    handle: 'chidistyle',
    category: 'Lifestyle',
    tier: 'Nano',
    rating: 4.9,
    campaignCount: 7,
    image:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 7,
    name: 'Fatima Bello',
    handle: 'fatimabello',
    category: 'Beauty',
    tier: 'Nano',
    rating: 4.9,
    campaignCount: 7,
    image:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
  },
];

const TABS = [
  { id: 'campaigns', label: 'Campaigns' },
  { id: 'brands', label: 'Brands' },
  { id: 'creators', label: 'Creators' },
  { id: 'news', label: 'News update' },
] as const;

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  category: 'Tips' | 'Platform' | 'Updates';
  publishedAt: string;
  image: string;
}

const MOCK_NEWS: NewsItem[] = [
  {
    id: 1,
    title: 'Introducing Trendupp Escrow Protection',
    excerpt:
      'We are excited to launch escrow protection for all collaborations, ensuring creators get paid securely and brands get quality deliverables.',
    category: 'Platform',
    publishedAt: '2 hours ago',
    image:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 2,
    title: 'How to Optimize Your Profile for Brand Deals',
    excerpt:
      'Discover the best practices for setting up your media kit and pricing strategy to attract high-paying brands to your page.',
    category: 'Tips',
    publishedAt: '1 day ago',
    image:
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 3,
    title: 'New Brand Campaigns Launching This Summer',
    excerpt:
      'A quick recap of the major fashion and lifestyle brands launching campaigns on Trendupp this season and how you can prepare.',
    category: 'Updates',
    publishedAt: '3 days ago',
    image:
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80',
  },
];

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState<MainTab>('campaigns');
  const [activeFilter, setActiveFilter] = useState<SubFilter>('all');
  const [activeBrandFilter, setActiveBrandFilter] = useState<string>('all');
  const [activeCreatorFilter, setActiveCreatorFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  // Filter campaigns logic
  const filteredCampaigns = MOCK_CAMPAIGNS.filter((campaign) => {
    const matchesSearch =
      campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.brand.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (activeFilter === 'all') return true;
    if (activeFilter === 'live') return campaign.status === 'live';
    if (activeFilter === 'closed') return campaign.status === 'closed';
    if (activeFilter === 'trendupp') return campaign.isTrendupp;
    return true;
  });

  // Filter brands logic
  const filteredBrands = MOCK_BRANDS.filter((brand) => {
    const matchesSearch =
      brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brand.category.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (activeBrandFilter !== 'all' && brand.category.toLowerCase() !== activeBrandFilter) {
      return false;
    }
    return true;
  });

  // Filter creators logic
  const filteredCreators = MOCK_CREATORS.filter((creator) => {
    const matchesSearch =
      creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.category.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (activeCreatorFilter !== 'all' && creator.category.toLowerCase() !== activeCreatorFilter) {
      return false;
    }
    return true;
  });

  // Filter news logic
  const filteredNews = MOCK_NEWS.filter((news) => {
    const matchesSearch =
      news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      news.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      news.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6 w-full pb-12 select-none">
      {/* Page Title block */}
      <div className="flex flex-col gap-1">
        <h1 className="text-[28px] font-bold text-[#1a1a2e] capitalize">
          {activeTab === 'news' ? 'News update' : activeTab}
        </h1>
        <p className="text-sm font-light text-[#7a7a9a]">
          You have{' '}
          {activeTab === 'campaigns'
            ? `${filteredCampaigns.length} live campaigns`
            : activeTab === 'brands'
              ? `${filteredBrands.length} live brands`
              : activeTab === 'creators'
                ? `${filteredCreators.length} live creators`
                : `${filteredNews.length} news updates`}
        </p>
      </div>

      {/* Search & Filter Row */}
      <div className="flex items-center gap-3 mt-1 shrink-0">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9a99b0]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-[320px] h-10 bg-white border border-[#e8e6f0]/60 rounded-xl pl-10 pr-4 text-xs font-light text-[#1a1a2e] focus:outline-none focus:ring-1 focus:ring-brand-pink/30 placeholder-[#9a99b0]"
          />
        </div>

        <button className="h-10 px-4 bg-white border border-[#e8e6f0]/60 hover:bg-zinc-50 rounded-xl text-xs font-semibold text-[#5a5a7a] flex items-center gap-1.5 transition-colors focus:outline-none">
          <SlidersHorizontal size={14} className="text-[#9a99b0]" />
          Filter
        </button>
      </div>

      {/* Navigation Tabs (Campaigns, Brands, Creators, News update) */}
      <div className="border-b border-[#e8e6f0]/40 flex gap-6 text-sm font-medium text-[#7a7a9a] pb-0 mt-3 shrink-0">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'pb-2.5 transition-all relative focus:outline-none',
              activeTab === tab.id
                ? 'text-brand-pink font-semibold border-b-2 border-brand-pink'
                : 'hover:text-brand-pink',
            )}
          >
            {tab.label}
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

      {activeTab === 'brands' && (
        <div className="flex items-center gap-2 mt-1 shrink-0">
          {(['all', 'fashion', 'tech', 'food', 'beauty'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveBrandFilter(filter)}
              className={cn(
                'px-4.5 py-2 text-xs font-medium rounded-full border border-transparent transition-all capitalize',
                activeBrandFilter === filter
                  ? 'bg-brand-pink text-white border-brand-pink shadow-[0_2px_8px_rgba(215,23,111,0.15)]'
                  : 'bg-white text-[#7a7a9a] border-[#e8e6f0]/70 hover:border-[#d7176f]/30',
              )}
            >
              {filter === 'all' && 'All'}
              {filter === 'fashion' && 'Fashion'}
              {filter === 'tech' && 'Tech'}
              {filter === 'food' && 'Food'}
              {filter === 'beauty' && 'Beauty'}
            </button>
          ))}
        </div>
      )}

      {activeTab === 'creators' && (
        <div className="flex items-center gap-2 mt-1 shrink-0">
          {(['all', 'fashion', 'tech', 'food', 'beauty'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveCreatorFilter(filter)}
              className={cn(
                'px-4.5 py-2 text-xs font-medium rounded-full border border-transparent transition-all capitalize',
                activeCreatorFilter === filter
                  ? 'bg-brand-pink text-white border-brand-pink shadow-[0_2px_8px_rgba(215,23,111,0.15)]'
                  : 'bg-white text-[#7a7a9a] border-[#e8e6f0]/70 hover:border-[#d7176f]/30',
              )}
            >
              {filter === 'all' && 'All'}
              {filter === 'fashion' && 'Fashion'}
              {filter === 'tech' && 'Tech'}
              {filter === 'food' && 'Food'}
              {filter === 'beauty' && 'Beauty'}
            </button>
          ))}
        </div>
      )}

      {/* Grid Content rendering */}
      {activeTab === 'campaigns' && (
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
      )}

      {activeTab === 'brands' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
          {filteredBrands.map((brand) => (
            <BrandCard
              key={brand.id}
              name={brand.name}
              category={brand.category}
              campaignCount={brand.campaignCount}
              followerCount={brand.followerCount}
              image={brand.image}
            />
          ))}
        </div>
      )}

      {activeTab === 'creators' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
          {filteredCreators.map((creator) => (
            <CreatorCard
              key={creator.id}
              name={creator.name}
              handle={creator.handle}
              category={creator.category}
              tier={creator.tier}
              rating={creator.rating}
              campaignCount={creator.campaignCount}
              image={creator.image}
            />
          ))}
        </div>
      )}

      {activeTab === 'news' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
          {filteredNews.map((news) => (
            <NewsCard
              key={news.id}
              title={news.title}
              excerpt={news.excerpt}
              category={news.category}
              publishedAt={news.publishedAt}
              image={news.image}
            />
          ))}
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
