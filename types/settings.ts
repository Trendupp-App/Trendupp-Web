export interface ContactInfo {
  businessAddress: string;
  supportEmail: string;
  supportPhone: string;
}

export interface ExternalLinks {
  websiteUrl: string;
  instagram: string;
  twitter: string;
  linkedin: string;
  youtube: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  category: string;
  status: 'published' | 'draft';
  sortOrder: number;
}
