import type { Campaign } from '@/types/campaign';

const BASE: Omit<Campaign, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'deletedAt'> = {
  title: 'Summer Style Collection',
  goal: 'Create Content',
  totalBudget: 150000,
  creatorCategoryId: 'cr-cat-1',
  preferredPlatformIds: ['p1'],
  currentStep: 5,
  coverImage:
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
  campaignBrief: 'Showcase our summer collection in an authentic way.',
  deliverables: ['1x Instagram Reel', '3x Instagram Stories'],
  contentDirection: ['Show the outfit in natural lighting'],
  contentGuidelines: {
    dos: ['Use natural lighting'],
    donts: ['No competitor brands'],
  },
  usageRights: 'Brand may repost content for 30 days.',
  successLooksLike: 'Authentic content that resonates with our target audience.',
  paymentStatus: 'paid',
  acceptedTerms: true,
  brandId: 'brand-1',
  brand: {
    id: 'brand-1',
    firstName: 'Zara',
    lastName: 'Africa',
    email: 'brand@zara.com',
    username: 'Zara Africa',
  },
  creatorCategory: {
    id: 'cr-cat-1',
    name: 'Micro',
    minFollowers: 10000,
    maxFollowers: 99999,
  },
  preferredPlatforms: [{ id: 'p1', name: 'Instagram' }],
};

function make(id: string, status: Campaign['status'], overrides: Partial<Campaign> = {}): Campaign {
  return {
    ...BASE,
    id,
    status,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null,
    ...overrides,
  };
}

export const DUMMY_ACTIVE_CAMPAIGNS: Campaign[] = [
  make('act-1', 'active', {
    title: 'Lagos Tech Week Coverage',
    subStatus: 'in_progress',
    coverImage:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80',
  }),
  make('act-2', 'active', {
    title: 'Summer Style Collection',
    subStatus: 'content_review',
    coverImage:
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
  }),
  make('act-3', 'active', {
    title: 'Healthy Living Challenge',
    subStatus: 'revision',
    coverImage:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
  }),
  make('act-4', 'active', {
    title: 'TECNO SPARK 20 Launch',
    subStatus: 'live_content',
    coverImage:
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
  }),
  make('act-5', 'active', {
    title: 'Eco Fashion Campaign',
    subStatus: 'in_progress',
    coverImage:
      'https://images.unsplash.com/photo-1540206276907-fbd77a942aa9?auto=format&fit=crop&w=600&q=80',
  }),
  make('act-6', 'active', {
    title: 'Nestlé Healthy Kids',
    subStatus: 'content_review',
    coverImage:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80',
  }),
];

export const DUMMY_COMPLETED_CAMPAIGNS: Campaign[] = [
  make('comp-1', 'completed', {
    title: 'Ramadan Moments',
    coverImage:
      'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80',
  }),
  make('comp-2', 'completed', {
    title: 'New Year Launch',
    coverImage:
      'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=600&q=80',
  }),
  make('comp-3', 'completed', {
    title: 'Back to School Drive',
    coverImage:
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80',
  }),
];
