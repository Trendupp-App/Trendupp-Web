import type { Campaign } from '@/types/campaign';
import type { Step1Input, Step2Values } from '@/lib/validations/createCampaignSchemas';

function toFieldArray(values?: string[]): { value: string }[] {
  if (!values || values.length === 0) return [{ value: '' }];
  return values.map((v) => ({ value: v }));
}

export function mapCampaignToStep1(campaign: Campaign): Step1Input {
  return {
    title: campaign.title,
    goal: campaign.goal,
    budget: String(campaign.totalBudget),
    creatorTierIds:
      campaign.creatorCategoryIds ??
      (campaign.creatorCategoryId ? [campaign.creatorCategoryId] : []),
    creatorNicheIds:
      campaign.creatorNicheIds ?? (campaign.creatorNicheId ? [campaign.creatorNicheId] : []),
    platforms: campaign.preferredPlatformIds ?? campaign.preferredPlatforms?.map((p) => p.id) ?? [],
    coverImage: campaign.coverImage,
  };
}

export function mapCampaignToStep2(campaign: Campaign): Step2Values {
  return {
    brief: campaign.campaignBrief ?? '',
    deliverables: toFieldArray(campaign.deliverables),
    contentDirection: toFieldArray(campaign.contentDirection),
    dos: toFieldArray(campaign.contentGuidelines?.dos),
    donts: toFieldArray(campaign.contentGuidelines?.donts),
  };
}
