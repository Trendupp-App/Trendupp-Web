import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { newsApi } from '@/services/newsApi';
import type { GetNewsParams, CreateNewsPayload, UpdateNewsPayload } from '@/types/news';

type ApiError = AxiosError<{ message?: string }>;

export function useNewsList(params: GetNewsParams) {
  return useQuery({
    queryKey: ['news', params],
    queryFn: () => newsApi.getNews(params).then((r) => r.data),
    staleTime: 1000 * 30,
  });
}

export function useNewsDetail(id: string | null) {
  return useQuery({
    queryKey: ['news', id],
    queryFn: () => newsApi.getNewsById(id!).then((r) => r.data),
    enabled: !!id,
    staleTime: 1000 * 30,
  });
}

export function useCreateNews() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateNewsPayload) => newsApi.createNews(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      toast.success('News article created successfully');
    },
    onError: (err: ApiError) => {
      toast.error(err?.response?.data?.message ?? 'Could not create news article');
    },
  });
}

export function useUpdateNews() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateNewsPayload }) =>
      newsApi.updateNews(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      toast.success('News article updated successfully');
    },
    onError: (err: ApiError) => {
      toast.error(err?.response?.data?.message ?? 'Could not update news article');
    },
  });
}

export function useDeleteNews() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => newsApi.deleteNews(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      toast.success('News article deleted successfully');
    },
    onError: (err: ApiError) => {
      toast.error(err?.response?.data?.message ?? 'Could not delete news article');
    },
  });
}
