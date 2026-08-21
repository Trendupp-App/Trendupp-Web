import type { CampaignApplication } from '@/types/application';

export const DUMMY_APPLICATIONS: CampaignApplication[] = [
  {
    id: 'app-1',
    creator: {
      id: 'cr-1',
      name: 'Adaeze Obi',
      handle: '@adaeze_eats',
      avatarUrl: '/dummy/avatars/adaeze.jpg',
      rating: 4.9,
      location: 'Lagos, Nigeria',
      followers: '180K',
      engagement: '5.2%',
      tier: 'Micro',
    },
    status: 'applied',
    feeRequest: 120000,
    contentIdea:
      "I'll create a warm iftar unboxing video featuring KFC's new sharing bucket — opening it with family just as the adhan sounds.",
    platforms: ['Instagram', 'TikTok'],
    portfolioUrl: 'https://instagram.com/adaeze_eats',
  },
  {
    id: 'app-2',
    creator: {
      id: 'cr-2',
      name: 'Chisom Nwosu',
      handle: '@chisom.ng',
      avatarUrl: '/dummy/avatars/chisom.jpg',
      rating: 4.9,
      location: 'Abuja, Nigeria',
      followers: '180K',
      engagement: '5.2%',
      tier: 'Micro',
    },
    status: 'applied',
    feeRequest: 120000,
    contentIdea:
      "A 'day in my Ramadan' vlog that features KFC as the iftar meal of choice — authentic, personal, low-key.",
    platforms: ['Instagram'],
    portfolioUrl: 'https://instagram.com/chisom.ng',
  },
  {
    id: 'app-3',
    creator: {
      id: 'cr-3',
      name: 'Emeka Chukwu',
      handle: '@chef_emeka',
      avatarUrl: '/dummy/avatars/emeka.jpg',
      rating: 4.9,
      badge: 'Impact Advocate',
      location: 'Lagos, Nigeria',
      followers: '180K',
      engagement: '5.2%',
      tier: 'Micro',
    },
    status: 'applied',
    feeRequest: 120000,
    contentIdea:
      "I'll create a warm iftar unboxing video featuring KFC's new sharing bucket — opening it with family just as the adhan sounds.",
    platforms: ['Instagram', 'TikTok'],
    portfolioUrl: 'https://instagram.com/chef_emeka',
  },
  {
    id: 'app-4',
    creator: {
      id: 'cr-4',
      name: 'Teni Olu',
      handle: '@teniolu',
      avatarUrl: '/dummy/avatars/teni.jpg',
      rating: 4.9,
      badge: 'Impact Advocate',
      location: 'Lagos, Nigeria',
      followers: '180K',
      engagement: '5.2%',
      tier: 'Micro',
    },
    status: 'applied',
    feeRequest: 120000,
    contentIdea:
      'A 60-second reel showcasing the collection in everyday Lagos street style, blending high fashion with local culture and authentic storytelling.',
    platforms: ['Instagram', 'TikTok'],
    portfolioUrl: 'https://instagram.com/teniolu',
    comment:
      "leaned into the 'summer breeze' aesthetic as requested in the brief. The second option is my personal favorite.",
  },
];
