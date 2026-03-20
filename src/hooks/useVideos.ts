'use client';

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  videosApi,
  type VideoParams,
  type CreateVideoPayload,
  type UpdateVideoPayload,
} from '@/api/videos';
import { queryKeys } from '@/lib/queryKeys';
import { toast } from 'sonner';

export function useVideos(params?: VideoParams) {
  return useQuery({
    queryKey: queryKeys.videos.all(params as Record<string, unknown>),
    queryFn: async () => {
      const res = await videosApi.getAll(params);
      return res.data;
    },
    placeholderData: keepPreviousData,
  });
}

export function useCreateVideo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateVideoPayload) => videosApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['videos'] });
      toast.success('Video saved');
    },
    onError: () => toast.error('Failed to save video'),
  });
}

export function useUpdateVideo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateVideoPayload }) =>
      videosApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['videos'] });
      toast.success('Video updated');
    },
    onError: () => toast.error('Failed to update video'),
  });
}

export function useDeleteVideo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => videosApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['videos'] });
      toast.success('Video removed');
    },
    onError: () => toast.error('Failed to delete video'),
  });
}
