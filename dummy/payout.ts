import type {
  PayoutTransaction,
  EscrowItem,
  NeedingFundingItem,
  PayoutSummary,
} from '@/types/payout';

export const DUMMY_PAYOUT_SUMMARY: PayoutSummary = {
  availableBalance: 397.0,
  totalEarned: 750.0,
  totalWithdrawn: 750.0,
};

export const DUMMY_TRANSACTIONS: PayoutTransaction[] = [
  {
    id: 't1',
    title: 'Music Promo Campaign',
    subtitle: 'Audiomack · May 15, 2025',
    amount: 180000,
    direction: 'credit',
    status: 'on_hold',
  },
  {
    id: 't2',
    title: 'Withdrawal',
    subtitle: 'GTBank ****4521 · May 20, 2025',
    amount: 250000,
    direction: 'debit',
    status: 'completed',
  },
  {
    id: 't3',
    title: 'TECNO SPARK Launch',
    subtitle: 'Tecno Mobile · May 22, 2025',
    amount: 180000,
    direction: 'credit',
    status: 'available',
  },
  {
    id: 't4',
    title: 'Summer Style Collection',
    subtitle: 'Zara Africa · May 28, 2025',
    amount: 180000,
    direction: 'credit',
    status: 'available',
  },
  {
    id: 't5',
    title: 'Music Promo Campaign',
    subtitle: 'Audiomack · May 15, 2025',
    amount: 180000,
    direction: 'credit',
    status: 'on_hold',
  },
  {
    id: 't6',
    title: 'Withdrawal',
    subtitle: 'GTBank ****4521 · May 20, 2025',
    amount: 250000,
    direction: 'debit',
    status: 'completed',
  },
  {
    id: 't7',
    title: 'TECNO SPARK Launch',
    subtitle: 'Tecno Mobile · May 22, 2025',
    amount: 180000,
    direction: 'credit',
    status: 'available',
  },
  {
    id: 't8',
    title: 'Summer Style Collection',
    subtitle: 'Zara Africa · May 28, 2025',
    amount: 180000,
    direction: 'credit',
    status: 'available',
  },
];

export const DUMMY_ESCROWS: EscrowItem[] = [
  {
    id: 'e1',
    title: 'Music Streaming Promo',
    brandName: 'Audiomack',
    amount: 250000,
    progressPercent: 15,
    daysRemaining: 20,
    withdrawableFrom: 'June 20, 2025',
  },
  {
    id: 'e2',
    title: 'Music Streaming Promo',
    brandName: 'Audiomack',
    amount: 250000,
    progressPercent: 15,
    daysRemaining: 20,
    withdrawableFrom: 'June 20, 2025',
  },
  {
    id: 'e3',
    title: 'Music Streaming Promo',
    brandName: 'Audiomack',
    amount: 250000,
    progressPercent: 30,
    daysRemaining: 20,
    withdrawableFrom: 'June 20, 2025',
  },
];

export const DUMMY_NEEDING_FUNDING: NeedingFundingItem[] = [
  {
    id: 'n1',
    title: 'Jollof Cook-off Promo',
    category: 'Food & Lifestyle',
    lastEditedLabel: '20 min ago',
    sectionsCompleted: 3,
    sectionsTotal: 5,
  },
  {
    id: 'n2',
    title: 'Jollof Cook-off Promo',
    category: 'Food & Lifestyle',
    lastEditedLabel: '20 min ago',
    sectionsCompleted: 3,
    sectionsTotal: 5,
  },
];
