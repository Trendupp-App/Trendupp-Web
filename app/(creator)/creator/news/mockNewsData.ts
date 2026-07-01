export interface NewsArticle {
  id: number;
  title: string;
  brand: string;
  brandAvatar?: string;
  publishedAt: string;
  readTime: string;
  category: 'Industry' | 'Platform Update' | 'Brands' | 'Tips';
  image: string;
  detailImage?: string;
  summary: string;
  content: { heading?: string; text: string }[];
  tags: string[];
  fullStoryUrl: string;
  howItWorks?: boolean;
}

export const MOCK_NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 1,
    title: 'TikTok Nigeria launches creator fund — ₦500M available for Q3',
    brand: 'Trendupp Africa',
    brandAvatar: 'TA',
    publishedAt: '2 hours ago',
    readTime: '4 min read',
    category: 'Industry',
    image: '/dashboard/tiktok.png',
    detailImage: '/dashboard/tiktok_news_banner.png',
    summary:
      "TikTok has officially announced a ₦500 million creator fund targeted exclusively at Nigerian content creators for the third quarter of 2026. The announcement, made at a press event in Lagos, marks the platform's most significant investment in the Nigerian creator economy to date.",
    content: [
      {
        text: 'The fund will be distributed across three tiers — Nano, Micro, and Macro creators — with individual payouts ranging from ₦50,000 to ₦5 million depending on follower count, engagement rate, and content quality scores.',
      },
      {
        heading: 'Who qualifies?',
        text: 'To qualify, creators must have a Nigerian account with a minimum of 1,000 followers, an average of 10,000 views per video over the last 30 days, and an account in good standing with no community guideline violations.',
      },
      {
        text: 'Applications will open on July 1, 2026 via the TikTok Creator Marketplace portal. Creators will be notified of their eligibility within 5 business days of applying.',
      },
      {
        heading: 'What Trendupp creators need to know',
        text: 'For creators on Trendupp, this fund is separate from campaign earnings. Brand campaigns on Trendupp remain the highest-paying opportunity per post, but the TikTok fund provides a reliable monthly baseline income for creators who maintain consistent output.',
      },
      {
        heading: "Platform's statement",
        text: "'Nigeria represents one of our fastest-growing creator markets globally,' said TikTok's West Africa Country Manager. 'This fund is our commitment to building a sustainable creator economy that rewards quality and consistency.'",
      },
    ],
    tags: ['TikTok', 'Creator Fund', 'Nigeria', 'Monetization'],
    fullStoryUrl: 'https://trendupp.com/blog/tiktok-nigeria-creator-fund',
    howItWorks: true,
  },
  {
    id: 2,
    title: 'Instagram Collab posts now monetisable in Nigeria — what you need to know',
    brand: 'Trendupp Updates',
    brandAvatar: 'TU',
    publishedAt: '5 hours ago',
    readTime: '3 min read',
    category: 'Platform Update',
    image: '/dashboard/bin.png',
    summary:
      'Meta has expanded its Instagram Collab post monetization features to eligible creators based in Nigeria, allowing shared revenue from advertising and brand deals directly inside the app.',
    content: [
      {
        text: 'The Collab feature allows two users to co-author a post or Reel, sharing likes, comments, and views. Now, creators can split revenues from overlays, stickers, and brand integrations directly, facilitating frictionless joint ventures.',
      },
      {
        heading: 'Setting Up Monetization',
        text: 'To access the revenue-sharing setup, both creators must have professional accounts and be approved for the partner monetization policies. The revenue split defaults to 50/50 but can be adjusted manually inside Meta Business Suite.',
      },
    ],
    tags: ['Instagram', 'Meta', 'Collab', 'Monetization'],
    fullStoryUrl: 'https://trendupp.com/blog/instagram-collab-monetization',
    howItWorks: false,
  },
  {
    id: 3,
    title: 'Top 10 Nigerian brands increasing influencer budgets in 2026',
    brand: 'Trendupp Tips',
    brandAvatar: 'TT',
    publishedAt: '1 day ago',
    readTime: '6 min read',
    category: 'Brands',
    image: '/dashboard/competed img.png',
    summary:
      'A new Trendupp market report highlights the top fast-moving consumer goods (FMCG) and fintech companies in Nigeria that are pivoting more ad spend into creator partnerships.',
    content: [
      {
        text: 'Leading fintech firms and consumer beverage companies are doubling down on localized influencer campaigns. The shift indicates a growing trust in micro-influencers over traditional billboard and television campaigns.',
      },
      {
        heading: 'Top Sectors Driving Spend',
        text: 'Financial Services, Beauty & Cosmetics, and EdTech are the leading sectors. Creators specializing in personal finance, lifestyle storytelling, and educational content are seeing high request volumes.',
      },
    ],
    tags: ['Brands', 'Budgets', 'Marketing', 'Fintech'],
    fullStoryUrl: 'https://trendupp.com/blog/brand-influencer-budgets-2026',
    howItWorks: false,
  },
  {
    id: 4,
    title: 'How Macro creators are 3x-ing their income with multi-platform syndication',
    brand: 'Trendupp Africa',
    brandAvatar: 'TA',
    publishedAt: '2 days ago',
    readTime: '5 min read',
    category: 'Tips',
    image: '/dashboard/tiktok.png',
    summary:
      'Re-purposing long-form content into vertical snippets is the highest-leverage strategy for content creators looking to maximize brand exposure and income streams.',
    content: [
      {
        text: 'Rather than producing separate content for YouTube, TikTok, and Instagram, top creators are recording high-quality horizontal videos and using AI tools to crop them into vertical clips with automated subtitles.',
      },
      {
        heading: 'Revenue Breakdown',
        text: 'By syndicating across platforms, creators can combine YouTube AdSense, TikTok Creator Rewards, and Instagram Reels Play bonuses with a single production cycle.',
      },
    ],
    tags: ['Tips', 'Syndication', 'Income', 'Strategy'],
    fullStoryUrl: 'https://trendupp.com/blog/multi-platform-creator-income',
    howItWorks: false,
  },
  {
    id: 5,
    title: 'A guide to optimizing your creator profile for maximum search visibility',
    brand: 'Trendupp Tips',
    brandAvatar: 'TT',
    publishedAt: '3 days ago',
    readTime: '4 min read',
    category: 'Tips',
    image: '/dashboard/bin.png',
    summary:
      'Brands search the Trendupp database using specific niche tags and metrics. Here is how to construct your profile bio and portfolio to show up first in search lists.',
    content: [
      {
        text: 'Using clear niche descriptors in your profile title and detailing past brand campaigns in your portfolio dramatically increases your discoverability when brands set up filters.',
      },
    ],
    tags: ['Profile Optimization', 'SEO', 'Trendupp Search'],
    fullStoryUrl: 'https://trendupp.com/blog/optimize-creator-profile',
    howItWorks: true,
  },
  {
    id: 6,
    title: 'Trendupp Creator Awards 2026: Nominations and categories announced',
    brand: 'Trendupp Africa',
    brandAvatar: 'TA',
    publishedAt: '4 days ago',
    readTime: '8 min read',
    category: 'Industry',
    image: '/dashboard/competed img.png',
    summary:
      "The annual Trendupp Awards celebrating creative excellence across Nigeria's online creator community is officially open for nominations across 15 distinct categories.",
    content: [
      {
        text: 'From educational content to comedic storytelling, the awards spotlight creators who have made the most significant positive impact on their audiences over the past year.',
      },
    ],
    tags: ['Trendupp Awards', 'Nominations', 'Nigeria Creator Scene'],
    fullStoryUrl: 'https://trendupp.com/blog/trendupp-awards-2026',
    howItWorks: false,
  },
];
