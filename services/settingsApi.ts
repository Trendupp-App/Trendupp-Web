import apiClient from '@/lib/apiClient';
import type { ContactInfo, ExternalLinks, Faq } from '@/types/settings';

export const settingsApi = {
  getContactInfo: () => apiClient.get<ContactInfo>('/settings/contact-info'),

  getExternalLinks: () => apiClient.get<ExternalLinks>('/settings/external-links'),

  getFaqs: () => apiClient.get<Faq[]>('/faqs'),
};
