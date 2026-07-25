export type NewsStatus = 'draft' | 'published';

export interface NewsArticle {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  title: string;
  summary: string | null;
  content: string;
  coverImage: string | null;
  category: string;
  status: NewsStatus;
  isPlatformUpdate: boolean;
  isTopNews: boolean;
  industryId: string | null;
  authorId: string;
  publishedAt: string | null;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
  industry: {
    id: string;
    name: string;
  } | null;
}

export interface GetNewsParams {
  search?: string;
  category?: string;
  status?: NewsStatus;
  industryId?: string;
  isPlatformUpdate?: boolean;
  isTopNews?: boolean;
  page?: number;
  limit?: number;
}

export interface GetNewsResponse {
  data: NewsArticle[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateNewsPayload {
  title: string;
  summary?: string;
  content: string;
  coverImage?: File;
  category: string;
  status?: NewsStatus;
  isPlatformUpdate?: boolean;
  isTopNews?: boolean;
  industryId?: string;
}

export type UpdateNewsPayload = Partial<CreateNewsPayload>;
