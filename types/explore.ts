import { Campaign } from './campaign';

export interface ExploreCreator {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  avatarUrl: string | null;
  bio: string | null;
  city: string | null;
  followersCount: number;
  niches: { id: string; name: string }[];
  assignedTier: string | null;
  avgRating: number | null;
  totalReviews: number;
}

export interface ExploreBrand {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  avatarUrl: string | null;
  bio: string | null;
  city: string | null;
  followersCount: number;
  industries: { id: string; name: string }[];
  totalCampaigns: number;
}

export interface ExploreCategory {
  id: string;
  name: string;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface ExploreSearchResponse {
  campaigns: PaginatedResult<Campaign>;
  creators: PaginatedResult<ExploreCreator>;
  brands: PaginatedResult<ExploreBrand>;
}
