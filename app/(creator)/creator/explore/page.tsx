'use client';

import { useState } from 'react';
import CampaignCard from '@/components/dashboard/CampaignCard';
import BrandCard from '@/components/dashboard/BrandCard';
import BrandProfileDrawer from '@/components/dashboard/BrandProfileDrawer';
import CreatorCard from '@/components/dashboard/CreatorCard';
import CreatorProfileDrawer from '@/components/dashboard/CreatorProfileDrawer';
import CampaignDetailsDrawer from '@/components/dashboard/CampaignDetailsDrawer';
import CampaignFilterModal, { FilterState } from '@/components/dashboard/CampaignFilterModal';
import { cn } from '@/lib/utils';

type MainTab = 'campaigns' | 'brands' | 'creators' | 'news';
type CampaignFilter = 'all' | 'live' | 'past' | 'social impact';

interface Campaign {
  id: number;
  title: string;
  brand: string;
  budget: string;
  budgetMin?: number; // for sorting
  budgetMax?: number; // for sorting
  daysLeft: string;
  daysLeftNumber?: number; // for sorting (hours)
  tier: string;
  appliedCount: number;
  status: 'live' | 'past';
  isSocialImpact: boolean;
  image: string;
  platforms?: string[];
  niches?: string[];
  goal?: 'Content Creation' | 'Amplification';
  createdAt?: string; // ISO date string for sorting
}

const MOCK_CAMPAIGNS: Campaign[] = [
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

interface Brand {
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
  }[];
  completedCampaigns?: { id: number; image: string; brandName: string; creatorAvatar?: string }[];
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

interface CreatorReview {
  id: number;
  brandName: string;
  logoText: string;
  logoBg: string;
  date: string;
  rating: number;
  text: string;
}

interface Creator {
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
}

const MOCK_CREATORS: Creator[] = [
  {
    id: 1,
    name: 'Teni Olu',
    handle: 'sadefoods',
    category: 'Food & Beverage',
    displayCategory: 'Food',
    tier: 'Micro',
    rating: 4.9,
    campaignCount: 7,
    image:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    location: 'Lagos, Nigeria',
    reach: '128K',
    earned: '₦1.2M',
    bio: 'Food and lifestyle content creator based in Lagos. Telling authentic culinary stories.',
    niches: ['Food', 'Lifestyle', 'Cooking'],
    platforms: [
      { name: 'Instagram', handle: 'sadefoods', followers: '128K', icon: 'instagram' },
      { name: 'TikTok', handle: 'sadefoods.creates', followers: '45K', icon: 'tiktok' },
    ],
    portfolio: [
      {
        id: 1,
        image:
          'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80',
        brandName: 'Zara',
      },
      {
        id: 2,
        image:
          'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80',
        brandName: 'Nestle',
      },
    ],
  },
  {
    id: 2,
    name: 'Emeka Dev',
    handle: 'sadefoods',
    category: 'Food & Beverage',
    displayCategory: 'Food',
    tier: 'Nano',
    rating: 4.9,
    campaignCount: 7,
    image:
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=300&q=80',
    location: 'Abuja, Nigeria',
    reach: '55K',
    earned: '₦480K',
    bio: 'Tech enthusiast who loves reviewing food tech and quick kitchen hacks.',
    niches: ['Food', 'Tech', 'Kitchen Hacks'],
    platforms: [{ name: 'Instagram', handle: 'sadefoods', followers: '55K', icon: 'instagram' }],
    portfolio: [
      {
        id: 1,
        image:
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80',
        brandName: 'Techno',
      },
    ],
  },
  {
    id: 3,
    name: 'Sade Foods',
    handle: 'sadefoods',
    category: 'Food & Beverage',
    displayCategory: 'Food',
    tier: 'Nano',
    rating: 4.9,
    campaignCount: 7,
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    location: 'Port Harcourt, Nigeria',
    reach: '32K',
    earned: '₦210K',
    bio: 'Healthy recipes and restaurant reviews. Food is life.',
    niches: ['Food', 'Recipes', 'Wellness'],
    platforms: [{ name: 'Instagram', handle: 'sadefoods', followers: '32K', icon: 'instagram' }],
    portfolio: [
      {
        id: 1,
        image:
          'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80',
        brandName: 'Nestle',
      },
    ],
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
    location: 'Accra, Ghana',
    reach: '310K',
    earned: '₦3.8M',
    bio: 'Skincare, makeup tutorials, and beauty brand collaborations.',
    niches: ['Beauty', 'Skincare', 'Makeup'],
    platforms: [{ name: 'Instagram', handle: 'amaraosei', followers: '310K', icon: 'instagram' }],
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
    name: 'Bayo Speaks',
    handle: 'bayospeaks',
    category: 'Finance',
    tier: 'Mega',
    rating: 4.9,
    campaignCount: 7,
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    location: 'Lagos, Nigeria',
    reach: '890K',
    earned: '₦12.5M',
    bio: 'Personal finance tips, investment guides, and money discussions.',
    niches: ['Finance', 'Business', 'Investment'],
    platforms: [{ name: 'Instagram', handle: 'bayospeaks', followers: '890K', icon: 'instagram' }],
    portfolio: [
      {
        id: 1,
        image:
          'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80',
        brandName: 'GTBank',
      },
    ],
  },
  {
    id: 6,
    name: 'Chidi Style',
    handle: 'chidistyle',
    category: 'Fashion',
    displayCategory: 'Lifestyle',
    tier: 'Nano',
    rating: 4.9,
    campaignCount: 7,
    image:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
    location: 'Enugu, Nigeria',
    reach: '44K',
    earned: '₦390K',
    bio: 'Lifestyle and fashion vlogger based in Enugu. Showcasing modern style trends.',
    niches: ['Lifestyle', 'Fashion', 'Style'],
    platforms: [{ name: 'Instagram', handle: 'chidistyle', followers: '44K', icon: 'instagram' }],
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
    id: 7,
    name: 'Amara Osei',
    handle: 'amaraosei',
    category: 'Beauty',
    tier: 'Nano',
    rating: 4.9,
    campaignCount: 7,
    image:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    location: 'Lagos, Nigeria',
    reach: '38K',
    earned: '₦295K',
    bio: 'Beauty routine, cosmetics testing, and tutorials for daily styling.',
    niches: ['Beauty', 'Skincare', 'Fashion'],
    platforms: [{ name: 'Instagram', handle: 'amaraosei', followers: '38K', icon: 'instagram' }],
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
    id: 8,
    name: 'Amara Osei',
    handle: 'amaraosei',
    category: 'Beauty',
    tier: 'Nano',
    rating: 4.9,
    campaignCount: 7,
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    location: 'Lagos, Nigeria',
    reach: '45K',
    earned: '₦320K',
    bio: 'Creating everyday lookbooks and beauty tips for young adults.',
    niches: ['Beauty', 'Lifestyle', 'Self-Care'],
    platforms: [{ name: 'Instagram', handle: 'amaraosei', followers: '45K', icon: 'instagram' }],
    portfolio: [
      {
        id: 1,
        image:
          'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=400&q=80',
        brandName: 'Zara',
      },
    ],
  },
];

const MAIN_TABS = [
  { id: 'campaigns', label: 'Campaigns' },
  { id: 'brands', label: 'Brands' },
  { id: 'creators', label: 'Creators' },
  { id: 'news', label: 'News update' },
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

    // Platform filter
    if (campaignFilters.platforms.length > 0) {
      const hasMatchingPlatform = campaign.platforms?.some((p) =>
        campaignFilters.platforms.includes(p),
      );
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
      </div>

      {/* ── Main Tabs: Campaigns | Brands | Creators | News update ── */}
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
                  ? 'bg-[#d7176f] text-white border-[#d7176f] shadow-sm'
                  : 'bg-white text-[#7a7a9a] border-[#e8e6f0]/70 hover:border-[#d7176f]/20',
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
                  ? 'bg-[#d7176f] text-white border-[#d7176f] shadow-sm'
                  : 'bg-white text-[#7a7a9a] border-[#e8e6f0]/70 hover:border-[#d7176f]/20',
              )}
            >
              {filter}
            </button>
          ))}
        </div>
      )}

      {/* ── Count label ── */}
      {activeTab !== 'news' && (
        <p className="text-xs font-light text-[#9a99b0] mb-3 shrink-0">{countLabel}</p>
      )}

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

      {/* ── News update List ── */}
      {activeTab === 'news' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl overflow-hidden shadow-sm flex flex-col">
            <div className="relative aspect-video bg-zinc-100">
              <img
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80"
                alt="TikTok Creator Fund"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-5 flex flex-col gap-2.5">
              <span className="text-[11px] font-bold text-brand-pink tracking-wider uppercase">
                Platform News
              </span>
              <h3 className="text-base font-bold text-[#1a1a2e] leading-snug hover:text-brand-pink transition-colors cursor-pointer">
                TikTok launches N200M Creator Fund for Nigerian Creators
              </h3>
              <p className="text-xs text-[#7a7a9a] font-light line-clamp-2 leading-relaxed">
                Nigerian content creators can now apply to earn money directly from TikTok based on
                video views, engagement, and reach...
              </p>
              <span className="text-[10px] text-[#9a99b0] font-light mt-1">June 18, 2026</span>
            </div>
          </div>
          <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl overflow-hidden shadow-sm flex flex-col">
            <div className="relative aspect-video bg-zinc-100">
              <img
                src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80"
                alt="Trendupp Awards"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-5 flex flex-col gap-2.5">
              <span className="text-[11px] font-bold text-brand-pink tracking-wider uppercase">
                Awards
              </span>
              <h3 className="text-base font-bold text-[#1a1a2e] leading-snug hover:text-brand-pink transition-colors cursor-pointer">
                Trendupp Awards 2025: Nominations officially open next week
              </h3>
              <p className="text-xs text-[#7a7a9a] font-light line-clamp-2 leading-relaxed">
                The annual celebration of creativity, influence, and impact on social platforms in
                Nigeria returns for its 5th edition...
              </p>
              <span className="text-[10px] text-[#9a99b0] font-light mt-1">June 15, 2026</span>
            </div>
          </div>
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
