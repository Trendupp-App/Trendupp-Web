export type BannerAdType = 'Banner' | 'Sponsored' | 'Announcement';
export type BannerAdStatus = 'draft' | 'active' | 'scheduled' | 'paused';

export interface BannerAd {
  id: string;
  title: string;
  adType: BannerAdType;
  targetAudience: string[];
  placement: string[];
  adImageUrl: string;
  linkUrl: string | null;
  startDate: string | null;
  endDate: string | null;
  status: BannerAdStatus;
}

export interface AdClickResponse {
  linkUrl: string;
}
