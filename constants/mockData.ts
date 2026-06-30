export interface Campaign {
  id: number;
  title: string;
  brand: string;
  budget: string;
  budgetMin?: number;
  budgetMax?: number;
  daysLeft: string;
  daysLeftNumber?: number;
  tier: string;
  appliedCount: number;
  status: 'live' | 'past';
  isSocialImpact: boolean;
  image: string;
  platforms?: string[];
  niches?: string[];
  goal?: 'Content Creation' | 'Amplification';
  createdAt?: string;
}

export interface Brand {
  id: number;
  name: string;
  category: string;
  campaignCount: number;
  followerCount: string;
  image: string;
  website?: string;
  location?: string;
  bio?: string;
  industries?: string[];
  platforms?: {
    name: string;
    handle: string;
    followers: string;
    icon: 'instagram' | 'tiktok' | 'youtube' | 'twitter';
    engRate?: string;
    totalLikes?: string;
    avgReach?: string;
  }[];
  completedCampaigns?: { id: number; image: string; brandName: string; creatorAvatar?: string }[];
}

export interface CreatorReview {
  id: number;
  brandName: string;
  logoText: string;
  logoBg: string;
  date: string;
  rating: number;
  text: string;
}

export interface Creator {
  id: number;
  name: string;
  handle: string;
  category: string;
  displayCategory?: string;
  tier: 'Micro' | 'Nano' | 'Macro' | 'Mega';
  rating: number;
  campaignCount: number;
  image: string;
  location?: string;
  bio?: string;
  badge?: string;
  reach?: string;
  earned?: string;
  niches?: string[];
  platforms?: {
    name: string;
    handle: string;
    followers: string;
    icon: 'instagram' | 'tiktok' | 'youtube' | 'twitter';
  }[];
  portfolio?: { id: number; image: string; brandName: string }[];
  reviews?: CreatorReview[];
  followers?: string;
  engagement?: string;
}

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: 1,
    title: 'Summer Style Collection 2025',
    brand: 'Zara Africa',
    budget: '₦150,000 - ₦300,000',
    budgetMin: 150000,
    budgetMax: 300000,
    daysLeft: '1d 14h left',
    daysLeftNumber: 38,
    tier: 'Micro',
    appliedCount: 47,
    status: 'live',
    isSocialImpact: false,
    image:
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    platforms: ['Instagram', 'TikTok'],
    niches: ['Fashion', 'Lifestyle'],
    goal: 'Content Creation',
    createdAt: '2026-06-24T12:00:00Z',
  },
  {
    id: 2,
    title: 'TECNO SPARK 20 Launch',
    brand: 'Tecno Mobile',
    budget: '₦200,000 - ₦500,000',
    budgetMin: 200000,
    budgetMax: 500000,
    daysLeft: '3d 0h left',
    daysLeftNumber: 72,
    tier: 'Macro',
    appliedCount: 89,
    status: 'live',
    isSocialImpact: false,
    image:
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
    platforms: ['Instagram', 'YouTube'],
    niches: ['Tech'],
    goal: 'Amplification',
    createdAt: '2026-06-23T10:00:00Z',
  },
  {
    id: 3,
    title: 'Healthy Living Challenge',
    brand: 'Nestlé Nigeria',
    budget: '₦80,000 - ₦180,000',
    budgetMin: 80000,
    budgetMax: 180000,
    daysLeft: '8h left',
    daysLeftNumber: 8,
    tier: 'Nano',
    appliedCount: 23,
    status: 'live',
    isSocialImpact: false,
    image:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    platforms: ['TikTok'],
    niches: ['Food', 'Lifestyle'],
    goal: 'Content Creation',
    createdAt: '2026-06-22T08:00:00Z',
  },
  {
    id: 4,
    title: 'Music Streaming Campaign',
    brand: 'Audiomack Africa',
    budget: '₦250,000 - ₦600,000',
    budgetMin: 250000,
    budgetMax: 600000,
    daysLeft: '4d 0h left',
    daysLeftNumber: 96,
    tier: 'Macro',
    appliedCount: 134,
    status: 'live',
    isSocialImpact: false,
    image:
      'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=800&q=80',
    platforms: ['YouTube', 'X (Twitter)'],
    niches: ['Music', 'Lifestyle'],
    goal: 'Amplification',
    createdAt: '2026-06-21T09:00:00Z',
  },
  {
    id: 5,
    title: 'Beauty Routine Takeover',
    brand: 'House of Tara',
    budget: '₦120,000 - ₦280,000',
    budgetMin: 120000,
    budgetMax: 280000,
    daysLeft: '1d 20h left',
    daysLeftNumber: 44,
    tier: 'Micro',
    appliedCount: 58,
    status: 'live',
    isSocialImpact: true,
    image:
      'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=800&q=80',
    platforms: ['Instagram', 'TikTok'],
    niches: ['Beauty', 'Fashion'],
    goal: 'Content Creation',
    createdAt: '2026-06-20T14:00:00Z',
  },
  {
    id: 6,
    title: 'Sports Energy Drive',
    brand: 'Monster Energy NG',
    budget: '₦300,000 - ₦700,000',
    budgetMin: 300000,
    budgetMax: 700000,
    daysLeft: 'Closed',
    daysLeftNumber: 999999,
    tier: 'Macro',
    appliedCount: 71,
    status: 'past',
    isSocialImpact: false,
    image:
      'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=80',
    platforms: ['Instagram', 'TikTok', 'YouTube'],
    niches: ['Sport', 'Lifestyle'],
    goal: 'Amplification',
    createdAt: '2026-06-15T11:00:00Z',
  },
  {
    id: 7,
    title: 'Summer Style Collection 2025',
    brand: 'Zara Africa',
    budget: '₦150,000 - ₦300,000',
    budgetMin: 150000,
    budgetMax: 300000,
    daysLeft: 'Closed',
    daysLeftNumber: 999999,
    tier: 'Micro',
    appliedCount: 47,
    status: 'past',
    isSocialImpact: false,
    image:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80',
    platforms: ['Instagram'],
    niches: ['Fashion'],
    goal: 'Content Creation',
    createdAt: '2026-06-14T09:00:00Z',
  },
  {
    id: 8,
    title: 'TECNO SPARK 20 Launch',
    brand: 'Tecno Mobile',
    budget: '₦200,000 - ₦500,000',
    budgetMin: 200000,
    budgetMax: 500000,
    daysLeft: 'Closed',
    daysLeftNumber: 999999,
    tier: 'Macro',
    appliedCount: 89,
    status: 'past',
    isSocialImpact: false,
    image:
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
    platforms: ['YouTube'],
    niches: ['Tech'],
    goal: 'Amplification',
    createdAt: '2026-06-13T10:00:00Z',
  },
];

export const MOCK_BRANDS: Brand[] = [
  {
    id: 1,
    name: 'Zara Africa',
    category: 'Fashion',
    campaignCount: 5,
    followerCount: '2.1M',
    image:
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=300&q=80',
    website: 'pepsinigeria.com',
    location: 'Lagos, Nigeria',
    bio: 'Zara Africa stands at the intersection of heritage and high fashion. We are dedicated to curating and showcasing the finest African fashion and beauty narratives.',
    industries: ['Fashion', 'Lifestyle', 'Beauty'],
    platforms: [
      {
        name: 'Instagram',
        handle: 'teni.creates',
        followers: '72.4K',
        icon: 'instagram',
        engRate: '7.2%',
        totalLikes: '140K',
        avgReach: '140K',
      },
      {
        name: 'TikTok',
        handle: 'teni.creates',
        followers: '72.4K',
        icon: 'tiktok',
        engRate: '7.2%',
        totalLikes: '140K',
        avgReach: '140K',
      },
    ],
    completedCampaigns: [
      {
        id: 1,
        image:
          'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
        brandName: 'Zara',
      },
      {
        id: 2,
        image:
          'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
        brandName: 'Zara',
      },
      {
        id: 3,
        image:
          'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
        brandName: 'Zara',
      },
      {
        id: 4,
        image:
          'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=400&q=80',
        brandName: 'Zara',
      },
      {
        id: 5,
        image:
          'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=400&q=80',
        brandName: 'Zara',
      },
      {
        id: 6,
        image:
          'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=400&q=80',
        brandName: 'Zara',
      },
      {
        id: 7,
        image:
          'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=400&q=80',
        brandName: 'Zara',
      },
      {
        id: 8,
        image:
          'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=400&q=80',
        brandName: 'Zara',
      },
      {
        id: 9,
        image:
          'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=400&q=80',
        brandName: 'Zara',
      },
    ],
  },
  {
    id: 2,
    name: 'Tecno Mobile',
    category: 'Technology',
    campaignCount: 5,
    followerCount: '2.1M',
    image:
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=80',
    website: 'tecno-mobile.com',
    location: 'Lagos, Nigeria',
    bio: 'TECNO Mobile is a premium mobile phone brand dedicated to providing the latest technology to emerging markets across Africa and beyond.',
    industries: ['Tech', 'Mobile', 'Innovation'],
    platforms: [
      { name: 'Instagram', handle: 'tecnomobileng', followers: '210K', icon: 'instagram' },
      { name: 'TikTok', handle: 'tecnomobile', followers: '88K', icon: 'tiktok' },
    ],
    completedCampaigns: [
      {
        id: 1,
        image:
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80',
        brandName: 'Tecno',
      },
      {
        id: 2,
        image:
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80',
        brandName: 'Tecno',
      },
      {
        id: 3,
        image:
          'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=400&q=80',
        brandName: 'Tecno',
      },
    ],
  },
  {
    id: 3,
    name: 'Audiomack Africa',
    category: 'Music',
    campaignCount: 5,
    followerCount: '2.1M',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80',
    website: 'audiomack.com',
    location: 'Accra, Ghana',
    bio: 'Audiomack is the leading music streaming and discovery platform for African artists and music fans worldwide.',
    industries: ['Music', 'Entertainment', 'Streaming'],
    platforms: [
      { name: 'Instagram', handle: 'audiomack', followers: '450K', icon: 'instagram' },
      { name: 'TikTok', handle: 'audiomack', followers: '180K', icon: 'tiktok' },
    ],
    completedCampaigns: [
      {
        id: 1,
        image:
          'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=400&q=80',
        brandName: 'Audiomack',
      },
      {
        id: 2,
        image:
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
        brandName: 'Audiomack',
      },
      {
        id: 3,
        image:
          'https://images.unsplash.com/photo-1484755560695-a4c748918c29?auto=format&fit=crop&w=400&q=80',
        brandName: 'Audiomack',
      },
    ],
  },
  {
    id: 4,
    name: 'Audiomack Africa',
    category: 'Music',
    campaignCount: 5,
    followerCount: '2.1M',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80',
    website: 'audiomack.com',
    location: 'Accra, Ghana',
    bio: 'Audiomack is the leading music streaming and discovery platform for African artists and music fans worldwide.',
    industries: ['Music', 'Entertainment', 'Streaming'],
    platforms: [
      { name: 'Instagram', handle: 'audiomack', followers: '450K', icon: 'instagram' },
      { name: 'TikTok', handle: 'audiomack', followers: '180K', icon: 'tiktok' },
    ],
    completedCampaigns: [
      {
        id: 1,
        image:
          'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=400&q=80',
        brandName: 'Audiomack',
      },
      {
        id: 2,
        image:
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
        brandName: 'Audiomack',
      },
      {
        id: 3,
        image:
          'https://images.unsplash.com/photo-1484755560695-a4c748918c29?auto=format&fit=crop&w=400&q=80',
        brandName: 'Audiomack',
      },
    ],
  },
  {
    id: 5,
    name: 'Zara Africa',
    category: 'Fashion',
    campaignCount: 5,
    followerCount: '2.1M',
    image:
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=300&q=80',
    website: 'zaraafrica.com',
    location: 'Lagos, Nigeria',
    bio: 'Fashion & lifestyle creator based in Lagos 🌟 | Helping brands tell authentic stories through style........ See more',
    industries: ['Fashion', 'Lifestyle', 'Beauty'],
    platforms: [
      { name: 'Instagram', handle: 'teniolu', followers: '128K', icon: 'instagram' },
      { name: 'TikTok', handle: 'teniolu', followers: '45K', icon: 'tiktok' },
    ],
    completedCampaigns: [
      {
        id: 1,
        image:
          'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=400&q=80',
        brandName: 'Zara',
      },
      {
        id: 2,
        image:
          'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=400&q=80',
        brandName: 'Zara',
      },
      {
        id: 3,
        image:
          'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=400&q=80',
        brandName: 'Zara',
      },
      {
        id: 4,
        image:
          'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=400&q=80',
        brandName: 'Zara',
      },
      {
        id: 5,
        image:
          'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=400&q=80',
        brandName: 'Zara',
      },
      {
        id: 6,
        image:
          'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=400&q=80',
        brandName: 'Zara',
      },
    ],
  },
  {
    id: 6,
    name: 'Nestlé Nigeria',
    category: 'Food & Beverage',
    campaignCount: 5,
    followerCount: '2.1M',
    image:
      'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=300&q=80',
    website: 'nestle-nigeria.com',
    location: 'Lagos, Nigeria',
    bio: 'Nestlé Nigeria is committed to enhancing quality of life and contributing to a healthier future for Nigerians across the nation.',
    industries: ['Food', 'Nutrition', 'Wellness'],
    platforms: [
      { name: 'Instagram', handle: 'nestlenigeria', followers: '95K', icon: 'instagram' },
      { name: 'TikTok', handle: 'nestleng', followers: '22K', icon: 'tiktok' },
    ],
    completedCampaigns: [
      {
        id: 1,
        image:
          'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80',
        brandName: 'Nestlé',
      },
      {
        id: 2,
        image:
          'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=400&q=80',
        brandName: 'Nestlé',
      },
    ],
  },
  {
    id: 7,
    name: 'Monster Energy NG',
    category: 'Sport',
    campaignCount: 5,
    followerCount: '2.1M',
    image:
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=300&q=80',
    website: 'monsterenergy.com',
    location: 'Lagos, Nigeria',
    bio: 'Monster Energy fuels athletes, musicians, and go-getters who push the limits. Big, bold, and loud – that is the Monster way.',
    industries: ['Sport', 'Energy', 'Lifestyle'],
    platforms: [
      { name: 'Instagram', handle: 'monsterenergyng', followers: '72K', icon: 'instagram' },
      { name: 'TikTok', handle: 'monsterng', followers: '18K', icon: 'tiktok' },
    ],
    completedCampaigns: [
      {
        id: 1,
        image:
          'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=400&q=80',
        brandName: 'Monster',
      },
      {
        id: 2,
        image:
          'https://images.unsplash.com/photo-1607962837359-5e7e89f86776?auto=format&fit=crop&w=400&q=80',
        brandName: 'Monster',
      },
    ],
  },
  {
    id: 8,
    name: 'GTBank',
    category: 'Finance',
    campaignCount: 5,
    followerCount: '2.1M',
    image:
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=300&q=80',
    website: 'gtbank.com',
    location: 'Lagos, Nigeria',
    bio: "Guaranty Trust Bank is one of Africa's most respected financial institutions, known for innovation, strong corporate governance and social responsibility.",
    industries: ['Finance', 'Banking', 'Digital'],
    platforms: [
      { name: 'Instagram', handle: 'gtbank', followers: '820K', icon: 'instagram' },
      { name: 'TikTok', handle: 'gtbank', followers: '260K', icon: 'tiktok' },
    ],
    completedCampaigns: [
      {
        id: 1,
        image:
          'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80',
        brandName: 'GTBank',
      },
      {
        id: 2,
        image:
          'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=400&q=80',
        brandName: 'GTBank',
      },
      {
        id: 3,
        image:
          'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=400&q=80',
        brandName: 'GTBank',
      },
    ],
  },
];

export const MOCK_CREATORS: Creator[] = [
  {
    id: 1,
    name: 'Teni Olu',
    handle: 'teniolu',
    category: 'Fashion',
    tier: 'Micro',
    rating: 4.9,
    campaignCount: 19,
    image:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    location: 'Lagos, Nigeria',
    reach: '128K',
    earned: '1.2M',
    followers: '284K',
    engagement: '7.2%',
    bio: 'Fashion & lifestyle creator based in Lagos 🌟 | Helping brands tell authentic stories through content.',
    badge: 'Impact Advocate',
    niches: ['Fashion', 'Lifestyle', 'Beauty'],
    platforms: [
      { name: 'Instagram', handle: 'teniolu', followers: '72k', icon: 'instagram' },
      { name: 'TikTok', handle: 'teniolu', followers: '72k', icon: 'tiktok' },
    ],
    portfolio: [
      {
        id: 1,
        image:
          'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
        brandName: 'Zara',
      },
      {
        id: 2,
        image:
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80',
        brandName: 'Techno',
      },
      {
        id: 3,
        image:
          'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=400&q=80',
        brandName: 'Zara',
      },
      {
        id: 4,
        image:
          'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=400&q=80',
        brandName: 'Tara',
      },
      {
        id: 5,
        image:
          'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=400&q=80',
        brandName: 'Monster',
      },
      {
        id: 6,
        image:
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
        brandName: 'Audiomack',
      },
    ],
  },
  {
    id: 2,
    name: 'Chidi Nwosu',
    handle: 'chidiplays',
    category: 'Lifestyle',
    tier: 'Micro',
    rating: 4.7,
    campaignCount: 5,
    image:
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=300&q=80',
    location: 'Lagos, Nigeria',
    reach: '1.2M',
    earned: '₦980K',
    followers: '284K',
    engagement: '7.2%',
    bio: 'Lifestyle and fashion creator sharing everyday stories.',
    niches: ['Lifestyle', 'Fashion', 'Style'],
    platforms: [{ name: 'Instagram', handle: 'chidiplays', followers: '284K', icon: 'instagram' }],
    portfolio: [
      {
        id: 1,
        image:
          'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&q=80',
        brandName: 'Zara',
      },
    ],
  },
  {
    id: 3,
    name: 'Tolu Fashola',
    handle: 'tolufashola',
    category: 'Fashion',
    tier: 'Mega',
    rating: 4.5,
    campaignCount: 12,
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    location: 'Lagos, Nigeria',
    reach: '1.2M',
    earned: '₦12.5M',
    followers: '284K',
    engagement: '7.2%',
    bio: 'High fashion content and lookbooks.',
    niches: ['Fashion', 'Lifestyle'],
    platforms: [{ name: 'Instagram', handle: 'tolufashola', followers: '284K', icon: 'instagram' }],
    portfolio: [
      {
        id: 1,
        image:
          'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=400&q=80',
        brandName: 'Zara',
      },
    ],
  },
  {
    id: 4,
    name: 'Ngozi Eze',
    handle: 'ngozibeauty',
    category: 'Beauty',
    tier: 'Micro',
    rating: 4.9,
    campaignCount: 8,
    image:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    location: 'Lagos, Nigeria',
    reach: '1.2M',
    earned: '₦1.8M',
    followers: '284K',
    engagement: '7.2%',
    bio: 'Beauty tips, makeup tutorials and wellness hacks.',
    niches: ['Beauty', 'Skincare'],
    platforms: [{ name: 'Instagram', handle: 'ngozibeauty', followers: '284K', icon: 'instagram' }],
    portfolio: [
      {
        id: 1,
        image:
          'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=400&q=80',
        brandName: 'Tara',
      },
    ],
  },
  {
    id: 5,
    name: 'Emeka Dev',
    handle: 'emekadev',
    category: 'Tech',
    tier: 'Nano',
    rating: 4.6,
    campaignCount: 4,
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    location: 'Lagos, Nigeria',
    reach: '1.2M',
    earned: '₦480K',
    followers: '284K',
    engagement: '7.2%',
    bio: 'Tech enthusiast sharing gadget reviews and coding tips.',
    niches: ['Tech', 'Gadgets'],
    platforms: [{ name: 'Instagram', handle: 'emekadev', followers: '284K', icon: 'instagram' }],
    portfolio: [
      {
        id: 1,
        image:
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80',
        brandName: 'Tecno',
      },
    ],
  },
];
