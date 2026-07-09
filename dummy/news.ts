export type NewsCategory = 'industry' | 'platform_update' | 'brands';

export interface NewsArticle {
  id: string;
  title: string;
  imageUrl: string;
  sourceName: string;
  timeAgo: string;
  readTime: string;
  category: NewsCategory;
}

export const DUMMY_NEWS: NewsArticle[] = [
  {
    id: 'n1',
    title: 'TikTok Nigeria launches creator fund — ₦500M available for Q3',
    imageUrl:
      'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=600&q=80',
    sourceName: 'Trendupp Africa',
    timeAgo: '2 hours ago',
    readTime: '4min read',
    category: 'industry',
  },
  {
    id: 'n2',
    title: 'TikTok Nigeria launches creator fund — ₦500M available for Q3',
    imageUrl:
      'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=600&q=80',
    sourceName: 'Trendupp Africa',
    timeAgo: '2 hours ago',
    readTime: '4min read',
    category: 'platform_update',
  },
  {
    id: 'n3',
    title: 'TikTok Nigeria launches creator fund — ₦500M available for Q3',
    imageUrl:
      'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80',
    sourceName: 'Trendupp Africa',
    timeAgo: '2 hours ago',
    readTime: '4min read',
    category: 'brands',
  },
  {
    id: 'n4',
    title: 'TikTok Nigeria launches creator fund — ₦500M available for Q3',
    imageUrl:
      'https://images.unsplash.com/photo-1571935441005-15c4e4a4e3f1?auto=format&fit=crop&w=600&q=80',
    sourceName: 'Trendupp Africa',
    timeAgo: '2 hours ago',
    readTime: '4min read',
    category: 'industry',
  },
  {
    id: 'n5',
    title: 'TikTok Nigeria launches creator fund — ₦500M available for Q3',
    imageUrl:
      'https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=600&q=80',
    sourceName: 'Trendupp Africa',
    timeAgo: '2 hours ago',
    readTime: '4min read',
    category: 'platform_update',
  },
  {
    id: 'n6',
    title: 'TikTok Nigeria launches creator fund — ₦500M available for Q3',
    imageUrl:
      'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=600&q=80',
    sourceName: 'Trendupp Africa',
    timeAgo: '2 hours ago',
    readTime: '4min read',
    category: 'brands',
  },
];
