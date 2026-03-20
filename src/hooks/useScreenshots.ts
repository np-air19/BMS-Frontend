'use client';

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  screenshotsApi,
  type ScreenshotParams,
  type UpdateScreenshotPayload,
} from '@/api/screenshots';
import { queryKeys } from '@/lib/queryKeys';
import { toast } from 'sonner';

export function useScreenshots(params?: ScreenshotParams) {
  return useQuery({
    queryKey: queryKeys.screenshots.all(params as Record<string, unknown>),
    queryFn: async () => {
      const res = await screenshotsApi.getAll(params);
      return res.data;
    },
    placeholderData: keepPreviousData,
  });
}

export function useCreateScreenshot() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => screenshotsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['screenshots'] });
      toast.success('Screenshot saved');
    },
    onError: () => toast.error('Failed to upload screenshot'),
  });
}

export function useUpdateScreenshot() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateScreenshotPayload }) =>
      screenshotsApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['screenshots'] });
      toast.success('Screenshot updated');
    },
    onError: () => toast.error('Failed to update screenshot'),
  });
}

export function useDeleteScreenshot() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => screenshotsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['screenshots'] });
      toast.success('Screenshot deleted');
    },
    onError: () => toast.error('Failed to delete screenshot'),
  });
}
