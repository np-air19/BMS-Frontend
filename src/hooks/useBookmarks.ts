'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  bookmarksApi,
  type BookmarkParams,
  type CreateBookmarkPayload,
  type UpdateBookmarkPayload,
} from '@/api/bookmarks';
import { queryKeys } from '@/lib/queryKeys';
import { toast } from 'sonner';

export function useBookmarks(params?: BookmarkParams) {
  return useQuery({
    queryKey: queryKeys.bookmarks.all(params as Record<string, unknown>),
    queryFn: async () => {
      const res = await bookmarksApi.getAll(params);
      return res.data;
    },
  });
}

export function useCreateBookmark() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBookmarkPayload) => bookmarksApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookmarks'] });
      toast.success('Bookmark saved');
    },
    onError: () => toast.error('Failed to save bookmark'),
  });
}

export function useUpdateBookmark() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBookmarkPayload }) =>
      bookmarksApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookmarks'] });
      toast.success('Bookmark updated');
    },
    onError: () => toast.error('Failed to update bookmark'),
  });
}

export function useDeleteBookmark() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bookmarksApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookmarks'] });
      toast.success('Bookmark deleted');
    },
    onError: () => toast.error('Failed to delete bookmark'),
  });
}
