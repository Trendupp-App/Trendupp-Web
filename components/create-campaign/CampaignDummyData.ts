// ── Dummy data for campaign tabs ──────────────────────────────────────────────

export type DraftCampaign = {
  id: string;
  title: string;
  niche: string;
  lastEdited: string;
  sectionsCompleted: number;
  totalSections: number;
  coverImage?: string;
};

export type LiveCampaign = {
  id: string;
  title: string;
  niche: string;
  tier: string;
  budget: number;
  applicants: number;
  daysLeft: number;
  coverImage?: string;
};

export type ActiveCampaign = {
  id: string;
  title: string;
  niche: string;
  tier: string;
  budget: number;
  liveLink: string;
  brief: string;
  daysLeft: number;
  status: 'in_progress' | 'content_review' | 'revision' | 'live_content';
  coverImage?: string;
};

export type CompletedCampaign = {
  id: string;
  title: string;
  niche: string;
  tier: string;
  budget: number;
  coverImage?: string;
};

export const DRAFT_CAMPAIGNS: DraftCampaign[] = [
  {
    id: 'd1',
    title: 'Jollof Cook-off Promo',
    niche: 'Food & Lifestyle',
    lastEdited: '20 min ago',
    sectionsCompleted: 3,
    totalSections: 5,
  },
  {
    id: 'd2',
    title: 'Summer Style Collection',
    niche: 'Lifestyle',
    lastEdited: '2 hours ago',
    sectionsCompleted: 2,
    totalSections: 5,
  },
  {
    id: 'd3',
    title: 'New Year Skincare Push',
    niche: 'Beauty',
    lastEdited: '1 hour ago',
    sectionsCompleted: 1,
    totalSections: 5,
  },
];

export const LIVE_CAMPAIGNS: LiveCampaign[] = [
  {
    id: 'l1',
    title: 'Summer Style Collection',
    niche: 'Sport',
    tier: 'Micro',
    budget: 150000,
    applicants: 47,
    daysLeft: 4,
  },
  {
    id: 'l2',
    title: 'Lagos Tech Week Coverage',
    niche: 'Sport',
    tier: 'Micro',
    budget: 150000,
    applicants: 47,
    daysLeft: 4,
  },
  {
    id: 'l3',
    title: 'Lagos Tech Week Coverage',
    niche: 'Sport',
    tier: 'Micro',
    budget: 150000,
    applicants: 47,
    daysLeft: 4,
  },
  {
    id: 'l4',
    title: 'Summer Style Collection',
    niche: 'Fashion',
    tier: 'Micro',
    budget: 150000,
    applicants: 47,
    daysLeft: 4,
  },
  {
    id: 'l5',
    title: 'Lagos Tech Week Coverage',
    niche: 'Sport',
    tier: 'Micro',
    budget: 150000,
    applicants: 47,
    daysLeft: 4,
  },
  {
    id: 'l6',
    title: 'Lagos Tech Week Coverage',
    niche: 'Sport',
    tier: 'Micro',
    budget: 150000,
    applicants: 47,
    daysLeft: 4,
  },
];

export const ACTIVE_CAMPAIGNS: ActiveCampaign[] = [
  {
    id: 'a1',
    title: 'Lagos Tech Week Coverage',
    niche: 'Sport',
    tier: 'Micro',
    budget: 150000,
    liveLink: 'https://instagram.com/p/example1',
    brief: 'Shot at Lekki beach during golden hour. Used trending audio...',
    daysLeft: 31,
    status: 'content_review',
  },
  {
    id: 'a2',
    title: 'E-commerce Flash Sale',
    niche: 'Sport',
    tier: 'Micro',
    budget: 150000,
    liveLink: 'https://instagram.com/p/example1',
    brief: 'Shot at Lekki beach during golden hour. Used trending audio...',
    daysLeft: 31,
    status: 'content_review',
  },
  {
    id: 'a3',
    title: 'Lagos Tech Week Coverage',
    niche: 'Sport',
    tier: 'Micro',
    budget: 150000,
    liveLink: 'https://instagram.com/p/example1',
    brief: 'Shot at Lekki beach during golden hour. Used trending audio...',
    daysLeft: 31,
    status: 'content_review',
  },
  {
    id: 'a4',
    title: 'Lagos Tech Week Coverage',
    niche: 'Technology',
    tier: 'Micro',
    budget: 150000,
    liveLink: 'https://instagram.com/p/example1',
    brief: 'Shot at Lekki beach during golden hour. Used trending audio...',
    daysLeft: 31,
    status: 'in_progress',
  },
  {
    id: 'a5',
    title: 'E-commerce Flash Sale',
    niche: 'Marketing',
    tier: 'Micro',
    budget: 150000,
    liveLink: 'https://instagram.com/p/example1',
    brief: 'Shot at Lekki beach during golden hour. Used trending audio...',
    daysLeft: 31,
    status: 'revision',
  },
  {
    id: 'a6',
    title: 'Lagos Tech Week Coverage',
    niche: 'Technology',
    tier: 'Micro',
    budget: 150000,
    liveLink: 'https://instagram.com/p/example1',
    brief: 'Shot at Lekki beach during golden hour. Used trending audio...',
    daysLeft: 31,
    status: 'live_content',
  },
];

export const COMPLETED_CAMPAIGNS: CompletedCampaign[] = [
  { id: 'c1', title: 'Brand Launch 2024', niche: 'Fashion', tier: 'Macro', budget: 500000 },
  { id: 'c2', title: 'Holiday Gift Guide', niche: 'Lifestyle', tier: 'Micro', budget: 200000 },
  { id: 'c3', title: 'Fitness February', niche: 'Sport', tier: 'Nano', budget: 80000 },
];
