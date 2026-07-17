import type { CampaignSubmission } from '@/types/submission';

export const DUMMY_SUBMISSIONS: Record<string, CampaignSubmission[]> = {
  'act-1': [
    {
      id: 'sub-act-1',
      creator: {
        id: 'cr-2',
        name: 'Chisom Nwosu',
        handle: '@chisom.ng',
        avatarUrl: '/dummy/avatars/chisom.jpg',
        rating: 4.9,
      },
      platform: 'Instagram reels',
      submittedAt: new Date().toISOString(),
      status: 'in_progress',
    },
  ],
  'act-2': [
    {
      id: 'sub-act-2',
      creator: {
        id: 'cr-1',
        name: 'Adaeze Obi',
        handle: '@adaeze_eats',
        avatarUrl: '/dummy/avatars/adaeze.jpg',
      },
      platform: 'Instagram reels',
      submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      status: 'awaiting_review',
      contentLink: 'https://instagram.com/p/example1',
      caption:
        'Shot at Lekki beach during golden hour. Used trending audio. Caption ideas included in the doc.',
    },
  ],
  'act-3': [
    {
      id: 'sub-act-3',
      creator: {
        id: 'cr-1',
        name: 'Adaeze Obi',
        handle: '@adaeze_eats',
        avatarUrl: '/dummy/avatars/adaeze.jpg',
      },
      platform: 'Instagram reels',
      submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      status: 'revision_requested',
      contentLink: 'https://instagram.com/p/example1',
      revisionFeedback:
        'Great take overall! Please add the Audiomack app UI briefly — it was missing from this submission. Also, the hashtag #AudiomackAfrobeats needs to be in the caption.',
    },
  ],
  'act-4': [
    {
      id: 'sub-act-4',
      creator: {
        id: 'cr-3',
        name: 'Emeka Chukwu',
        handle: '@chef_emeka',
        avatarUrl: '/dummy/avatars/emeka.jpg',
      },
      platform: 'Instagram reels',
      submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      status: 'live',
      contentLink: 'https://instagram.com/p/example-live',
    },
  ],
};
