import apiClient from '@/lib/apiClient';
import type {
  GetNewsParams,
  GetNewsResponse,
  NewsArticle,
  CreateNewsPayload,
  UpdateNewsPayload,
} from '@/types/news';

function appendIfDefined(form: FormData, key: string, value: unknown) {
  if (value === undefined || value === null || value === '') return;
  if (typeof value === 'boolean') {
    form.append(key, String(value));
    return;
  }
  form.append(key, value as string | Blob);
}

function buildNewsFormData(payload: CreateNewsPayload | UpdateNewsPayload) {
  const fd = new FormData();
  appendIfDefined(fd, 'title', payload.title);
  appendIfDefined(fd, 'summary', payload.summary);
  appendIfDefined(fd, 'content', payload.content);
  appendIfDefined(fd, 'category', payload.category);
  appendIfDefined(fd, 'status', payload.status);
  appendIfDefined(fd, 'isPlatformUpdate', payload.isPlatformUpdate);
  appendIfDefined(fd, 'isTopNews', payload.isTopNews);
  appendIfDefined(fd, 'industryId', payload.industryId);
  if (payload.coverImage instanceof File) {
    fd.append('coverImage', payload.coverImage);
  }
  return fd;
}

export const newsApi = {
  getNews: (params?: GetNewsParams) => apiClient.get<GetNewsResponse>('/news', { params }),

  getNewsById: (id: string) => apiClient.get<NewsArticle>(`/news/${id}`),

  createNews: (payload: CreateNewsPayload) =>
    apiClient.post<NewsArticle>('/admin/news', buildNewsFormData(payload), {
      headers: { 'Content-Type': undefined },
    }),

  updateNews: (id: string, payload: UpdateNewsPayload) =>
    apiClient.patch<NewsArticle>(`/admin/news/${id}`, buildNewsFormData(payload), {
      headers: { 'Content-Type': undefined },
    }),

  deleteNews: (id: string) => apiClient.delete<{ message?: string }>(`/admin/news/${id}`),
};
