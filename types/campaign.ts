interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

// ── Reference data ────────────────────────────────────────────────────────────

export interface CampaignPlatform extends BaseEntity {
  name: string;
}

export interface CreatorCategory extends BaseEntity {
  name: string;
  minFollowers: number;
  maxFollowers: number | null;
}

// ── Enums (validated by API)

export const CAMPAIGN_GOALS = ['Create Content', 'Amplify Content'] as const;
export type CampaignGoal = (typeof CAMPAIGN_GOALS)[number];

export const CONTENT_TYPES = ['Video', 'Carousel', 'Reel', 'Tweet', 'Image'] as const;
export type ContentType = (typeof CONTENT_TYPES)[number];

//  Campaign

export type CampaignStatus = 'draft' | 'submitted' | 'live' | 'active' | 'completed';

export interface ContentGuidelines {
  dos: string[];
  donts: string[];
}

export interface Campaign extends BaseEntity {
  title: string;
  goal: CampaignGoal;
  totalBudget: number;
  paymentPerCreator?: string;
  contentType?: ContentType;
  duration?: number;
  creatorCategoryId: string;
  preferredPlatformIds: string[];
  currentStep: number;
  status: CampaignStatus;
  coverImage?: string;
  // Step 2
  campaignBrief?: string;
  deliverables?: string[];
  contentDirection?: string[];
  contentGuidelines?: ContentGuidelines;
  // Step 3
  usageRights?: string;
  successLooksLike?: string;
  paymentStatus?: 'unpaid' | 'paid';
  acceptedTerms?: boolean;
  brandId?: string;

  brand?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
  };
  creatorCategory?: {
    id: string;
    name: string;
    minFollowers: number;
    maxFollowers: number | null;
  };
  preferredPlatforms?: {
    id: string;
    name: string;
  }[];
  creatorNicheId?: string;
  timeline?: string;

  creatorNiche?: {
    id?: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;
    name?: string;
    order?: number;
  };
  paymentBreakdown?: PaymentBreakdown & {
    breakdownItems: { name: string; type: string; value: number; amount: number }[];
  };
  applicationsCount?: { total: number };

  subStatus?: CampaignSubStatus;
}

// ── Payloads ──────────────────────────────────────────────────────────────────

export interface CreateCampaignPayload {
  title: string;
  goal: CampaignGoal;
  totalBudget: number;
  creatorCategoryId: string;
  creatorNicheId: string;
  timeline: string;
  preferredPlatformIds: string[];
  campaignBrief?: string;
  contentGuidelines?: ContentGuidelines;
  coverImage?: File;
}

export interface PatchCampaignStep2Payload {
  currentStep: 2;
  campaignBrief: string;
  deliverables: string[];
  contentDirection: string[];
  contentGuidelines: ContentGuidelines;
}

export interface PatchCampaignStep3Payload {
  currentStep: 3;
  usageRights: string;
  successLooksLike: string;
}

export interface PatchCampaignStep4Payload {
  currentStep: 4;
  [key: string]: unknown;
}

export type PatchCampaignPayload =
  | PatchCampaignStep2Payload
  | PatchCampaignStep3Payload
  | PatchCampaignStep4Payload;

// ── Responses ─────────────────────────────────────────────────────────────────

export interface CreateCampaignResponse {
  message: string;
  campaign: Campaign;
}

export interface PatchCampaignResponse {
  message: string;
  campaign: Campaign;
}

export interface PaymentBreakdown {
  campaignBudget: number;
  trenduppFee: number;
  vat: number;
  totalToPay: number;
}

export interface SubmitCampaignResponse {
  message: string;
  campaign: {
    id: string;
    status: 'submitted';
    currentStep: 5;
    paymentBreakdown: PaymentBreakdown;
  };
  payment: {
    campaignId: string;
    amount: number;
    paymentStatus: 'unpaid';
  };
}

// export interface SubmitCampaignResponse {
//   message: string;
//   campaign: {
//     id: string;
//     title: string;
//     totalBudget: number;
//     status: 'submitted';
//     currentStep: 5;
//   };
//   payment: {
//     campaignId: string;
//     amount: number;
//     paymentStatus: 'unpaid';
//   };
// }

export interface PayCampaignPayload {
  paymentReference: string;
}

export interface PayCampaignResponse {
  message?: string;
  campaign: {
    id: string;
    title?: string;
    status: 'live';
    paymentStatus: 'paid';
  };
  payment: {
    id: string;
    paymentReference: string;
    paymentStatus: 'paid';
  };
}

export type CampaignSubStatus = 'in_progress' | 'content_review' | 'revision' | 'live_content';
