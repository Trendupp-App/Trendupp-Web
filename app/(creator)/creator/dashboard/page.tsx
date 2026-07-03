'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Clock, Users, ArrowUpRight, Eye, Ticket, ExternalLink, Newspaper } from 'lucide-react';
import CompletenessCard from '@/components/creator-dashboard/CompletenessCard';
import BannerCarousel from '@/components/creator-dashboard/BannerCarousel';
import StatCard from '@/components/creator-dashboard/StatCard';
import CampaignCard from '@/components/creator-dashboard/CampaignCard';
import SocialCampaignCard from '@/components/creator-dashboard/SocialCampaignCard';
import AnalyticsDrawer from '@/components/creator-dashboard/AnalyticsDrawer';
import CampaignDetailsDrawer, {
  MappedCampaign,
} from '@/components/creator-dashboard/CampaignDetailsDrawer';
import CampaignCardSkeleton from '@/components/skeletons/CampaignCard';
import { useCampaigns } from '@/hooks/useCampaign';
import { Campaign } from '@/types/campaign';
import { cn } from '@/lib/utils';

type FilterType = 'all' | 'live' | 'past' | 'news';

const MOCK_NEWS = [
  {
    id: 1,
    title: 'TikTok Nigeria launches creator fund — ₦500M available for Q3',
    brand: 'Trendupp Africa',
    publishedAt: '2h ago',
    category: 'Industry',
    image: '/dashboard/tiktok.png',
  },
  {
    id: 2,
    title: 'Instagram Collab posts now monetisable in Nigeria — what',
    brand: 'Trendupp Updates',
    publishedAt: '5h ago',
    category: 'Platform Update',
    image: '/dashboard/bin.png',
  },
  {
    id: 3,
    title: 'Top 10 Nigerian brands increasing influencer budgets in',
    brand: 'Trendupp Tips',
    publishedAt: '1d ago',
    category: 'Brands',
    image: '/dashboard/tiktok.png',
  },
  {
    id: 4,
    title: 'How Macro creators are 3x-ing their income with multi-platform',
    brand: 'Trendupp Insights',
    publishedAt: '2d ago',
    category: 'Tips',
    image: '/dashboard/bin.png',
  },
];

const MOCK_SOCIAL_CAMPAIGNS = [
  {
    id: 1,
    title: 'Clean Nigeria Initiative',
    brand: 'Trendupp x NESREA',
    daysLeft: '12h left',
    tokens: '100 Tokens',
    image: '/dashboard/bin.png',
    showParticipate: true,
  },
  {
    id: 2,
    title: 'Education For All',
    brand: 'Trendupp x UBE',
    daysLeft: '',
    tokens: '100 Tokens',
    image: '/dashboard/competed img.png',
    showParticipate: false,
  },
  {
    id: 3,
    title: 'Keep Lagos Green Campaign',
    brand: 'Trendupp x Green Earth',
    daysLeft: '10d left',
    tokens: '200 Tokens',
    image: '/dashboard/bin.png',
    showParticipate: true,
  },
];

export default function CreatorDashboardPage() {
  const router = useRouter();
  const handleNewsClick = (newsId: number) => {
    if (newsId === 1) {
      router.push('/creator/news/tiktok-creator-fund');
    }
  };
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [isUserActive, setIsUserActive] = useState(false); // Default is uncompleted dashboard
  const [socialSlide, setSocialSlide] = useState(0);
  const [newsSlide, setNewsSlide] = useState(0);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<MappedCampaign | null>(null);

  // Fetch campaigns from backend
  const { data: liveCampaigns = [], isLoading } = useCampaigns();

  const getDaysLeft = (timelineDate: string) => {
    const diffTime = new Date(timelineDate).getTime() - new Date().getTime();
    if (diffTime <= 0) return 'Closed';
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 0) return `${diffDays}d left`;
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    return `${diffHours}h left`;
  };

  const mappedCampaigns = liveCampaigns.map((c: Campaign) => ({
    id: c.id,
    title: c.title,
    brand: c.brand?.username || 'Unknown Brand',
    budget: `₦${c.totalBudget.toLocaleString()}`,
    budgetMin: c.totalBudget,
    budgetMax: c.totalBudget,
    daysLeft: getDaysLeft(c.timeline),
    daysLeftNumber: Math.max(
      0,
      Math.floor((new Date(c.timeline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
    ),
    tier: c.creatorCategory?.name || 'Nano',
    appliedCount: c.applicationsCount?.total || 0,
    image:
      c.coverImage ||
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    niches: c.creatorNiche ? [c.creatorNiche.name] : [],
    platforms: c.preferredPlatforms?.map((p: { name: string }) => p.name) || [],
    status: (c.status === 'active'
      ? 'live'
      : c.status === 'completed'
        ? 'past'
        : c.status) as string,
    isSocialImpact: false,
    goal: c.goal === 'Create Content' ? 'Content Creation' : 'Amplification',
    createdAt: c.createdAt,
    campaignBrief: c.campaignBrief || 'No brief provided.',
    deliverables: c.deliverables || [],
    contentDirection: c.contentDirection || [],
    contentGuidelines: c.contentGuidelines || { dos: [], donts: [] },
    usageRights: c.usageRights || '',
    successLooksLike: c.successLooksLike || '',
  }));

  // Auto-scroll for Social Impact Campaigns carousel on desktop
  useEffect(() => {
    const timer = setInterval(() => {
      setSocialSlide((prev) => (prev + 1) % MOCK_SOCIAL_CAMPAIGNS.length);
    }, 4500); // Scroll every 4.5 seconds
    return () => clearInterval(timer);
  }, []);

  // Auto-scroll for Top News carousel on desktop
  useEffect(() => {
    const timer = setInterval(() => {
      setNewsSlide((prev) => (prev + 1) % 3); // Slide between first 3 news items
    }, 5000); // Scroll every 5 seconds
    return () => clearInterval(timer);
  }, []);

  const filteredCampaigns = mappedCampaigns.filter((campaign) => {
    if (activeFilter === 'all') return campaign.status === 'live';
    if (activeFilter === 'news') return false; // Handled separately
    return campaign.status === activeFilter;
  });

  return (
    <div className="flex flex-col gap-8 w-full pb-12 select-none">
      {/* Welcome Message and State Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-[28px] font-bold text-[#1a1a2e] tracking-tight">Hey, Alex</h1>
          <p className="text-sm font-light text-[#7a7a9a]">
            Welcome back to your creator dashboard
          </p>
        </div>

        {/* Developer testing toggle */}
        <button
          onClick={() => setIsUserActive(!isUserActive)}
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#f0edf7] text-[#4c49d8] hover:bg-brand-pink hover:text-white transition-all cursor-pointer shadow-sm"
        >
          Toggle Profile State: {isUserActive ? 'Active (Image B)' : 'Uncompleted (Image A)'}
        </button>
      </div>

      {/* Row 1: Banner & Stats Grid (Conditional Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: CompletenessCard or BannerCarousel */}
        <div className="lg:col-span-5 flex flex-col justify-between h-full min-h-[256px]">
          {isUserActive ? <BannerCarousel /> : <CompletenessCard percentage={20} />}
        </div>

        {/* Right Column: Stats Grid (Conditional Values/Icons) */}
        <div className="lg:col-span-7 hidden lg:grid grid-cols-1 sm:grid-cols-2 gap-4">
          {isUserActive ? (
            <>
              <StatCard
                amount="3241"
                label="Profile Views"
                color="pink"
                icon={Eye}
                onClick={() => setIsAnalyticsOpen(true)}
              />
              <StatCard
                amount="9"
                label="Post view"
                color="pink"
                icon={Eye}
                onClick={() => setIsAnalyticsOpen(true)}
              />
              <StatCard
                amount="6.8%"
                label="Avg. Engagement"
                color="green"
                icon={Users}
                onClick={() => setIsAnalyticsOpen(true)}
              />
              <StatCard
                amount="₦847,000"
                label="Total money earned"
                color="yellow"
                icon="₦"
                onClick={() => setIsAnalyticsOpen(true)}
              />
            </>
          ) : (
            <>
              <StatCard amount="₦ -- -- --" label="Total money earned" color="pink" icon="₦" />
              <StatCard amount="₦ -- -- --" label="Total money earned" color="blue" icon="₦" />
              <StatCard amount="₦ -- -- --" label="Total money earned" color="yellow" icon="₦" />
              <StatCard amount="₦ -- -- --" label="Total money earned" color="green" icon="₦" />
            </>
          )}
        </div>
      </div>

      {/* Row 2: Campaigns Filters & Action Row */}
      <div className="flex flex-col gap-5 mt-2">
        {/* Filter Headers */}
        <div className="flex items-center justify-between border-b border-[#e8e6f0]/40 pb-4 overflow-hidden">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide shrink-0 max-w-full">
            {(['all', 'live', 'past', 'news'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  'px-5 py-2.5 text-xs font-semibold rounded-2xl transition-all border-none cursor-pointer shrink-0 outline-none select-none',
                  activeFilter === filter
                    ? 'bg-brand-pink text-white shadow-[0_2px_8px_rgba(215,23,111,0.15)]'
                    : 'bg-[#f0edf7]/65 text-[#5a5a7a] hover:bg-[#f0edf7]',
                )}
              >
                {filter === 'all' && 'All'}
                {filter === 'live' && 'Live Campaigns'}
                {filter === 'past' && 'Past Campaigns'}
                {filter === 'news' && 'News Update'}
              </button>
            ))}
          </div>
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between mt-1 mb-0.5">
          <div className="flex items-center gap-2 text-[#1a1a2e]">
            <span className="text-base sm:text-lg">🔥</span>
            <h3 className="text-base font-bold tracking-tight">
              {activeFilter === 'past' ? 'Past Campaigns' : 'Live Campaigns'}
            </h3>
          </div>
          <button className="flex items-center gap-1 text-xs font-semibold text-brand-pink hover:underline cursor-pointer">
            <span>See all</span>
            <span className="text-[10px] font-bold">&gt;</span>
          </button>
        </div>

        {/* Dynamic Display based on Active Filter */}
        {isLoading ? (
          <div>
            {/* Mobile View Skeleton */}
            <div className="lg:hidden flex flex-col gap-4 w-full pb-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <CampaignCardSkeleton key={i} />
              ))}
            </div>
            {/* Desktop View Skeleton */}
            <div className="hidden lg:grid lg:grid-cols-3 gap-x-6 gap-y-4 w-full pb-4 select-none">
              {Array.from({ length: 3 }).map((_, i) => (
                <CampaignCardSkeleton key={i} />
              ))}
            </div>
          </div>
        ) : activeFilter !== 'news' ? (
          <div>
            {/* Mobile View */}
            <div className="lg:hidden w-full select-none">
              {activeFilter === 'all' ? (
                /* Horizontal scrolling list for "All" active tab */
                <div className="flex flex-row overflow-x-auto gap-4 w-full pb-4 scrollbar-hide">
                  {filteredCampaigns.map((campaign) => (
                    <div
                      key={campaign.id}
                      className="w-[220px] shrink-0 cursor-pointer"
                      onClick={() => setSelectedCampaign(campaign)}
                    >
                      <CampaignCard
                        title={campaign.title}
                        brand={campaign.brand}
                        budget={campaign.budget}
                        daysLeft=""
                        tier={campaign.tier}
                        appliedCount={campaign.appliedCount}
                        image={campaign.image}
                        hideApplied={true}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                /* Vertical stack list for "Live" or "Past" active tabs */
                <div className="flex flex-col gap-4 w-full pb-4">
                  {filteredCampaigns.map((campaign) => (
                    <div
                      key={campaign.id}
                      className="w-full cursor-pointer"
                      onClick={() => setSelectedCampaign(campaign)}
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
                  ))}
                </div>
              )}
            </div>

            {/* Desktop View: Grid for all tabs */}
            <div className="hidden lg:grid lg:grid-cols-3 gap-x-6 gap-y-4 w-full pb-4 select-none">
              {filteredCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="w-full cursor-pointer"
                  onClick={() => setSelectedCampaign(campaign)}
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
              ))}
            </div>
          </div>
        ) : (
          <div>
            {/* Mobile View: Featured Card + Stack */}
            <div className="flex flex-col gap-4 lg:hidden">
              {/* Featured Card */}
              <div
                onClick={() => handleNewsClick(1)}
                className="bg-white border border-[#e8e6f0]/60 rounded-3xl overflow-hidden hover:shadow-[0_8px_30px_rgba(4,0,57,0.05)] transition-all duration-300 flex flex-col group cursor-pointer"
              >
                <div className="relative w-full h-[180px] bg-zinc-100 overflow-hidden shrink-0">
                  <Image
                    src={MOCK_NEWS[0].image}
                    alt={MOCK_NEWS[0].title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-102"
                  />
                  <div className="absolute top-3 left-3 bg-[#2563eb] text-white text-[10px] font-semibold px-2.5 py-1 rounded-full z-10">
                    {MOCK_NEWS[0].category}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pt-12 z-10">
                    <h4 className="text-sm font-bold text-white leading-snug line-clamp-2">
                      {MOCK_NEWS[0].title}
                    </h4>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-[#2563eb]">
                      {MOCK_NEWS[0].brand}
                    </span>
                    <span className="text-[10px] text-[#9a99b0] font-light mt-0.5">
                      {MOCK_NEWS[0].publishedAt}
                    </span>
                  </div>
                  <div className="p-2 rounded-full text-[#9a99b0] group-hover:text-brand-pink transition-colors shrink-0">
                    <ExternalLink size={15} />
                  </div>
                </div>
              </div>

              {/* Subsequent Stack */}
              <div className="flex flex-col gap-4">
                {MOCK_NEWS.slice(1).map((news) => (
                  <div
                    key={news.id}
                    onClick={() => handleNewsClick(news.id)}
                    className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-3 flex flex-row gap-4 items-center hover:shadow-[0_8px_30px_rgba(4,0,57,0.04)] transition-all duration-300 cursor-pointer group/item"
                  >
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-zinc-100 shrink-0">
                      <Image src={news.image} alt={news.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col">
                      <span className="text-[9px] font-bold text-[#2563eb] bg-[#eff6ff] px-2 py-0.5 rounded-full w-fit">
                        {news.category}
                      </span>
                      <h5 className="text-xs font-bold text-[#1a1a2e] leading-snug line-clamp-2 mt-1.5 group-hover/item:text-brand-pink transition-colors">
                        {news.title}
                      </h5>
                      <span className="text-[10px] text-[#9a99b0] font-light mt-1">
                        {news.publishedAt}
                      </span>
                    </div>
                    <div className="p-2 text-[#9a99b0] group-hover/item:text-brand-pink transition-colors shrink-0">
                      <ExternalLink size={15} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop View: Grid */}
            <div className="hidden lg:grid lg:grid-cols-3 gap-x-6 gap-y-4 w-full pb-4 select-none">
              {MOCK_NEWS.map((news) => (
                <div
                  key={news.id}
                  onClick={() => handleNewsClick(news.id)}
                  className="bg-white border border-[#e8e6f0]/60 rounded-3xl overflow-hidden hover:shadow-[0_8px_30px_rgba(4,0,57,0.05)] transition-all duration-300 flex flex-col h-full group cursor-pointer"
                >
                  <div className="relative w-full h-[150px] bg-zinc-100 overflow-hidden shrink-0">
                    <Image
                      src={news.image}
                      alt={news.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute bottom-3 right-3 bg-brand-pink text-white text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
                      {news.category}
                    </div>
                  </div>
                  <div className="p-4 flex flex-col justify-between flex-1">
                    <div className="flex flex-col gap-1">
                      <h4 className="text-sm sm:text-base font-bold text-[#1a1a2e] group-hover:text-brand-pink transition-colors line-clamp-2 leading-snug">
                        {news.title}
                      </h4>
                      <p className="text-[11px] sm:text-xs font-light text-[#7a7a9a] mt-1">
                        {news.brand} • {news.publishedAt}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-brand-pink mt-4 group-hover:underline cursor-pointer w-fit">
                      <span>Read article</span>
                      <ArrowUpRight
                        size={13}
                        className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Row 3: Social Impact Campaigns & Top News Grid */}
      {activeFilter === 'all' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
          {/* Left Column: Social Impact Campaigns */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#1a1a2e] tracking-tight">
                Social Impact Campaigns
              </h3>
              <button className="text-xs font-semibold text-brand-pink hover:underline cursor-pointer">
                See all
              </button>
            </div>

            {/* Mobile View: Horizontal scrolling row of separate campaign cards */}
            <div className="flex lg:hidden flex-row overflow-x-auto gap-6 w-full pb-4 scrollbar-hide select-none">
              {MOCK_SOCIAL_CAMPAIGNS.map((campaign) => (
                <div
                  key={campaign.id}
                  className="w-[280px] shrink-0 sm:w-[340px] md:w-[360px] h-full"
                >
                  <SocialCampaignCard
                    title={campaign.title}
                    brand={campaign.brand}
                    daysLeft={campaign.daysLeft}
                    tokens={campaign.tokens}
                    image={campaign.image}
                    showParticipate={campaign.showParticipate}
                  />
                </div>
              ))}
            </div>

            {/* Desktop View: Single Auto-sliding Carousel Card */}
            <div className="hidden lg:flex bg-white border border-[#e8e6f0]/60 rounded-3xl p-4 flex-col hover:shadow-[0_8px_30px_rgba(4,0,57,0.04)] transition-all duration-300 h-full relative">
              {/* Image Banner */}
              <div className="relative w-full h-[220px] rounded-2xl overflow-hidden bg-zinc-100 shrink-0">
                {MOCK_SOCIAL_CAMPAIGNS.map((campaign, idx) => (
                  <div
                    key={campaign.id}
                    className={cn(
                      'absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out',
                      socialSlide === idx
                        ? 'opacity-100 z-10'
                        : 'opacity-0 z-0 pointer-events-none',
                    )}
                  >
                    <Image
                      src={campaign.image}
                      alt={campaign.title}
                      fill
                      className="object-cover"
                    />
                    {/* Overlays */}
                    {campaign.daysLeft && (
                      <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/45 backdrop-blur-md text-white text-[10px] font-medium px-2.5 py-1 rounded-full border border-white/10 z-10">
                        <Clock size={11} className="text-white" />
                        <span>{campaign.daysLeft}</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-[#e6f9f1] text-[#00c37b] text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-sm z-10">
                      Live
                    </div>
                  </div>
                ))}
              </div>

              {/* Card Details */}
              <div className="flex-1 flex flex-col justify-between mt-4 relative">
                {MOCK_SOCIAL_CAMPAIGNS.map((campaign, idx) => (
                  <div
                    key={campaign.id}
                    className={cn(
                      'flex flex-col flex-1 justify-between transition-opacity duration-500',
                      socialSlide === idx
                        ? 'opacity-100 relative z-10'
                        : 'opacity-0 absolute inset-0 z-0 pointer-events-none',
                    )}
                  >
                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-[#1a1a2e] leading-tight hover:text-brand-pink transition-colors">
                        {campaign.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-[#7a7a9a] font-light mt-1">
                        {campaign.brand}
                      </p>
                    </div>

                    {/* Bottom Row */}
                    <div className="flex items-center justify-between mt-4">
                      {/* Tokens */}
                      <div className="flex items-center gap-1.5 text-brand-pink font-bold text-xs sm:text-sm">
                        <Ticket size={14} className="text-brand-pink shrink-0" />
                        <span>{campaign.tokens}</span>
                      </div>

                      {/* Participate Action */}
                      {campaign.showParticipate && (
                        <button className="bg-[#fef2f6] hover:bg-brand-pink text-brand-pink hover:text-white transition-all duration-250 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold cursor-pointer shrink-0">
                          Participate
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Slide Indicators */}
              <div className="flex justify-center items-center gap-1.5 mt-4 pt-1">
                {MOCK_SOCIAL_CAMPAIGNS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSocialSlide(idx)}
                    className={cn(
                      'h-2 rounded-full transition-all duration-300 cursor-pointer',
                      idx === socialSlide ? 'w-5 bg-brand-pink' : 'w-2 bg-[#e8e6f0]',
                    )}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Top News */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-none pb-1 mt-2 mb-1">
              <div className="flex items-center gap-2">
                <Newspaper size={18} className="text-[#2563eb]" />
                <h3 className="text-base font-bold text-[#1a1a2e] tracking-tight">Top News</h3>
                <span className="text-xs font-semibold text-[#2563eb] ml-1 bg-[#eff6ff] px-2.5 py-0.5 rounded-full">
                  by Trendupp Africa
                </span>
              </div>
              <button className="flex items-center gap-1 text-xs font-semibold text-[#2563eb] hover:underline cursor-pointer">
                <span>All news</span>
                <span className="text-[10px] font-bold">&gt;</span>
              </button>
            </div>

            {/* Mobile View: Static Featured Card + Vertical Feed */}
            <div className="flex lg:hidden flex-col gap-4">
              {/* Featured Card */}
              <div
                onClick={() => handleNewsClick(1)}
                className="bg-white border border-[#e8e6f0]/60 rounded-3xl overflow-hidden hover:shadow-[0_8px_30px_rgba(4,0,57,0.05)] transition-all duration-300 flex flex-col group cursor-pointer"
              >
                <div className="relative w-full h-[180px] bg-zinc-100 overflow-hidden shrink-0">
                  <Image
                    src={MOCK_NEWS[0].image}
                    alt={MOCK_NEWS[0].title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-102"
                  />
                  <div className="absolute top-3 left-3 bg-[#2563eb] text-white text-[10px] font-semibold px-2.5 py-1 rounded-full z-10">
                    {MOCK_NEWS[0].category}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pt-12 z-10">
                    <h4 className="text-sm font-bold text-white leading-snug line-clamp-2">
                      {MOCK_NEWS[0].title}
                    </h4>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-[#2563eb]">
                      {MOCK_NEWS[0].brand}
                    </span>
                    <span className="text-[10px] text-[#9a99b0] font-light mt-0.5">
                      {MOCK_NEWS[0].publishedAt}
                    </span>
                  </div>
                  <div className="p-2 rounded-full text-[#9a99b0] group-hover:text-brand-pink transition-colors shrink-0">
                    <ExternalLink size={15} />
                  </div>
                </div>
              </div>

              {/* Subsequent Stack */}
              <div className="flex flex-col gap-4">
                {MOCK_NEWS.slice(1).map((news) => (
                  <div
                    key={news.id}
                    onClick={() => handleNewsClick(news.id)}
                    className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-3 flex flex-row gap-4 items-center hover:shadow-[0_8px_30px_rgba(4,0,57,0.04)] transition-all duration-300 cursor-pointer group/item"
                  >
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-zinc-100 shrink-0">
                      <Image src={news.image} alt={news.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col">
                      <span className="text-[9px] font-bold text-[#2563eb] bg-[#eff6ff] px-2 py-0.5 rounded-full w-fit">
                        {news.category}
                      </span>
                      <h5 className="text-xs font-bold text-[#1a1a2e] leading-snug line-clamp-2 mt-1.5 group-hover/item:text-brand-pink transition-colors">
                        {news.title}
                      </h5>
                      <span className="text-[10px] text-[#9a99b0] font-light mt-1">
                        {news.publishedAt}
                      </span>
                    </div>
                    <div className="p-2 text-[#9a99b0] group-hover/item:text-brand-pink transition-colors shrink-0">
                      <ExternalLink size={15} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop View: Auto-sliding Carousel Featured Card (No vertical news feed) */}
            <div
              onClick={() => handleNewsClick(newsSlide + 1)}
              className="hidden lg:flex bg-white border border-[#e8e6f0]/60 rounded-3xl p-4 flex-col hover:shadow-[0_8px_30px_rgba(4,0,57,0.04)] transition-all duration-300 h-full relative cursor-pointer"
            >
              {/* Image Banner */}
              <div className="relative w-full h-[220px] rounded-2xl overflow-hidden bg-zinc-100 shrink-0">
                {MOCK_NEWS.slice(0, 3).map((news, idx) => (
                  <div
                    key={news.id}
                    className={cn(
                      'absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out',
                      newsSlide === idx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none',
                    )}
                  >
                    <Image src={news.image} alt={news.title} fill className="object-cover" />
                    <div className="absolute bottom-3 right-3 bg-brand-pink text-white text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
                      {news.category}
                    </div>
                  </div>
                ))}
              </div>

              {/* Card Details */}
              <div className="flex-1 flex flex-col justify-end mt-4 relative">
                {MOCK_NEWS.slice(0, 3).map((news, idx) => (
                  <div
                    key={news.id}
                    className={cn(
                      'flex flex-col gap-3 transition-opacity duration-500',
                      newsSlide === idx
                        ? 'opacity-100 relative z-10'
                        : 'opacity-0 absolute inset-0 z-0 pointer-events-none',
                    )}
                  >
                    {/* Line 1: Title and Link Icon */}
                    <div className="flex justify-between items-start gap-4">
                      <h4 className="text-base sm:text-lg font-bold text-[#1a1a2e] leading-snug line-clamp-2 hover:text-brand-pink transition-colors">
                        {news.title}
                      </h4>
                      <div className="p-2.5 rounded-full bg-[#fcecf3] hover:bg-brand-pink text-brand-pink hover:text-white transition-colors shrink-0 cursor-pointer">
                        <ArrowUpRight size={14} />
                      </div>
                    </div>

                    {/* Line 2: Brand & Time */}
                    <p className="text-xs sm:text-sm text-[#7a7a9a] font-light mt-1">
                      {news.brand} • {news.publishedAt}
                    </p>
                  </div>
                ))}
              </div>

              {/* Slide Indicators */}
              <div className="flex justify-center items-center gap-1.5 mt-4 pt-1">
                {MOCK_NEWS.slice(0, 3).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setNewsSlide(idx)}
                    className={cn(
                      'h-2 rounded-full transition-all duration-300 cursor-pointer',
                      idx === newsSlide ? 'w-5 bg-brand-pink' : 'w-2 bg-[#e8e6f0]',
                    )}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      <AnalyticsDrawer isOpen={isAnalyticsOpen} onClose={() => setIsAnalyticsOpen(false)} />
      <CampaignDetailsDrawer
        isOpen={!!selectedCampaign}
        onClose={() => setSelectedCampaign(null)}
        campaign={selectedCampaign}
      />
    </div>
  );
}
