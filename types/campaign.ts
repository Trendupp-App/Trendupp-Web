interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CampaignsPagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// ── Reference data ────────────────────────────────────────────────────────────

export interface CampaignPlatform extends BaseEntity {
  name: string;
}

export interface CreatorCategory extends BaseEntity {
  name: string;
  minFollowers: number;
  maxFollowers: number | null;
  minCostCreateNaira: number;
  minCostCreateUsd: number;
  minCostAmplifyNaira: number;
  minCostAmplifyUsd: number;
  rewardTokens: number;
}

// ── Enums (validated by API)

export const CAMPAIGN_GOALS = ['Create Content', 'Amplify Content'] as const;
export type CampaignGoal = (typeof CAMPAIGN_GOALS)[number];

export const CONTENT_TYPES = ['Video', 'Carousel', 'Reel', 'Tweet', 'Image'] as const;
export type ContentType = (typeof CONTENT_TYPES)[number];

//  Campaign

export interface CampaignTimelineStage {
  goal: string;
  status: 'completed' | 'in_progress' | 'pending' | string;
  endedDate: string | null;
  intendedFor: string | null;
  startedDate: string | null;
}

// Keys are e.g. "stage0_escrow", "stage1_application_window" — see
// lib/campaignTimelineStage.ts for how these are ordered/interpreted.
export type CampaignTimeline = Record<string, CampaignTimelineStage | null>;

export type CampaignStatus =
  | 'draft'
  | 'submitted'
  | 'pending_payment'
  | 'live'
  | 'active'
  | 'completed';

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
  creatorCategoryIds?: string[];
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
  creatorCategory?: CreatorCategory;
  creatorCategories?: CreatorCategory[];
  preferredPlatforms?: {
    id: string;
    name: string;
  }[];
  creatorNicheId?: string;
  timeline?: CampaignTimeline;
  approvedAt?: string | null;
  urlIsLive?: boolean | null;
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
  applications?: CampaignApplicationDto[];
  subStatus?: CampaignSubStatus;
  currency?: string;
  creatorNicheIds?: string[];
  amplificationAsset?: string | null;
  type?: string;
  tokenReward?: number | null;
}

export interface Platform {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  name: string;
}

export interface Creator {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  avatarUrl: string | null;
  assignedTier: string;
  instagramUsername: string | null;
  instagramFollowers: number;
  tiktokUsername: string | null;
  tiktokFollowers: number;
  youtubeUsername: string | null;
  youtubeFollowers: number;
  twitterUsername: string | null;
  twitterFollowers: number;
}

export interface CampaignCommentParticipant {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  avatarUrl: string | null;
}

// A creator's question/comment on a campaign, and the brand's reply (if any) —
// distinct from CampaignApplicationDto.comments, which is the optional note
// submitted alongside the application itself.
export interface CampaignComment {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  campaignId: string;
  creatorId: string;
  brandId: string;
  comment: string;
  response: string | null;
  creator: CampaignCommentParticipant;
  brand: CampaignCommentParticipant;
}

export interface CampaignApplicationDto {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  campaignId: string;
  creatorId: string;
  contentIdea: string;
  pastWorkLink: string[];
  primaryPlatformId: string;
  secondaryPlatformId: string;
  feeRequest: number;
  comments: string;
  status: 'pending' | 'accepted' | 'rejected';
  primary_platform_id: string;
  secondary_platform_id: string;
  creator: Creator;
  primaryPlatform: Platform;
  secondaryPlatform: Platform;
  campaign?: Campaign;
  submissions?: unknown[];
  campaignComment?: CampaignComment | null;
}

// ── Payloads ──────────────────────────────────────────────────────────────────

export interface CreateCampaignPayload {
  title: string;
  goal: CampaignGoal;
  totalBudget: number;
  creatorCategoryIds: string[];
  creatorNicheIds: string[];
  preferredPlatformIds: string[];
  campaignBrief?: string;
  contentGuidelines?: ContentGuidelines;
  coverImage?: File;
  amplificationAsset?: string;
}

export interface PatchCampaignStep1Payload {
  currentStep: 1;
  title: string;
  goal: CampaignGoal;
  totalBudget: number;
  creatorCategoryIds: string[];
  creatorNicheIds: string[];
  preferredPlatformIds: string[];
  coverImage?: File;
  amplificationAsset?: string;
}

export interface PatchCampaignStep2Payload {
  currentStep: 2;
  campaignBrief: string;
  deliverables: string[];
  contentDirection: string[];
  contentGuidelines: ContentGuidelines;
}

export interface PatchCampaignStep4Payload {
  currentStep: 4;
  [key: string]: unknown;
}

export type PatchCampaignPayload =
  | PatchCampaignStep1Payload
  | PatchCampaignStep2Payload
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
    id: string;
    campaignId: string;
    amount: number;
    totalAmount: number;
    paymentStatus: 'pending';
    paymentReference: string;
    escrowId: string;
    paymentUrl: string;
    transactionRef: string;
    provider: string;
    escrowStatus: string;
  };
}

export interface VerifyPaymentResponse {
  message?: string;
}

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

export interface ApplyCampaignPayload {
  contentIdea: string;
  pastWorkLink?: string[];
  primaryPlatformId: string;
  secondaryPlatformId?: string;
  feeRequest: number;
  comments?: string;
}

export interface ApplyCampaignResponse {
  message?: string;
  application?: CampaignApplicationDto;
}
export type CampaignSubStatus = 'in_progress' | 'content_review' | 'revision' | 'live_content';

export interface SubmitContentDraftPayload {
  draftLink: string;
}

export interface SubmitContentDraftResponse {
  message?: string;
  application?: unknown;
}

export interface SubmitLiveLinkPayload {
  liveLink: Record<string, string>;
}

export interface SubmitLiveLinkResponse {
  message?: string;
  submission?: unknown;
}

export type CampaignActivityActorType = 'Brand' | 'Creator' | 'System' | 'Admin' | (string & {});

export interface CampaignActivityEvent {
  id: string;
  actorType: CampaignActivityActorType;
  timestamp: string;
  formattedTime: string;
  description: string;
}

export interface CampaignActivityTimeline {
  campaignId: string;
  totalEvents: number;
  activities: CampaignActivityEvent[];
}

export interface SocialImpactSubmission {
  id: string;
  campaignId: string;
  applicationId: string;
  creatorId: string;
  liveLink: { link: string } | null;
  status: string;
  draftLink: string | null;
  brandFeedback: string | null;
  urlIsLive: boolean | null;
  urlCheckedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface SubmitSocialImpactLiveLinkResponse {
  message: string;
  submission: SocialImpactSubmission;
  tokensAwarded: number;
}

export interface ValidateSelectionResult {
  isValid: boolean;
  amountAvailable: number;
  selectedTotal: number;
  shortfall: number;
  currency: string;
  message: string;
}
