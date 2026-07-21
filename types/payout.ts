export interface NeedingFundingItem {
  id: string;
  title: string;
  category: string;
  lastEditedLabel: string;
  sectionsCompleted: number;
  sectionsTotal: number;
}

// ── Creator payout dashboard (GET /transactions/payouts) ──

export interface PayoutDashboardSummary {
  availableBalance: number;
  thirtyDayHold: number;
  totalEarned: number;
  totalFailed: number;
  currency: string;
}

export interface PayoutTransactionItem {
  id: string;
  campaignId: string;
  campaignTitle: string;
  brandName: string;
  amount: number;
  currency: string;
  status: string;
  statusDescription: string;
  releaseDate: string;
  createdAt: string;
  errorDetails: string | null;
}

export interface PayoutTransactionsPage {
  total: number;
  page: number;
  limit: number;
  pages: number;
  items: PayoutTransactionItem[];
}

export interface PayoutEscrowItem {
  id: string;
  campaignId: string;
  campaignTitle: string;
  brandName: string;
  amount: number;
  currency: string;
  releaseStatus: string;
  statusDescription: string;
  escrowStatus: string | null;
  releaseDate: string;
  daysRemaining: number;
  disputeStatus: string | null;
}

export interface PayoutEscrowSection {
  totalFundsYetToBeReleased: number;
  items: PayoutEscrowItem[];
}

export interface PayoutDashboardResponse {
  summary: PayoutDashboardSummary;
  transactions: PayoutTransactionsPage;
  escrow: PayoutEscrowSection;
}

export interface GetPayoutDashboardParams {
  page?: number;
  limit?: number;
}

// ── Brand payout dashboard (GET /transactions/manage-payments) ──

export interface BrandPayoutSummary {
  escrowBalance: number;
  thirtyDayHold: number;
  totalPayout: number;
  currency: string;
}

export type BrandTransactionType = 'creator_payout' | 'escrow_funded' | string;

export interface BrandTransactionItem {
  id: string;
  type: BrandTransactionType;
  table: string;
  campaignId: string;
  campaignTitle: string;
  amount: number;
  currency: string;
  date: string;
  status: string;
  statusDescription: string;
}

export interface BrandTransactionsPage {
  total: number;
  page: number;
  limit: number;
  pages: number;
  items: BrandTransactionItem[];
}

export interface BrandEscrowItem {
  campaignId: string;
  campaignTitle: string;
  amount: number;
  currency: string;
  escrowStatus: string;
  statusDescription: string;
  table: string;
  releaseDate: string;
  daysRemaining: number;
}

export interface BrandEscrowSection {
  totalActiveEscrow: number;
  items: BrandEscrowItem[];
}

export interface BrandPayoutDashboardResponse {
  summary: BrandPayoutSummary;
  transactions: BrandTransactionsPage;
  escrow: BrandEscrowSection;
}
