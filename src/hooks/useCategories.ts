'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { categoriesApi, type CategoryTree } from '@/api/categories';
import { queryKeys } from '@/lib/queryKeys';

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.all(),
    queryFn: async () => {
      const res = await categoriesApi.getTree();
      return res.data.data as CategoryTree[];
    },
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: categoriesApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.categories.all() });
      toast.success('Category created');
    },
    onError: () => toast.error('Failed to create category'),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof categoriesApi.update>[1] }) =>
      categoriesApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.categories.all() });
      toast.success('Category updated');
    },
    onError: () => toast.error('Failed to update category'),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categoriesApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.categories.all() });
      toast.success('Category deleted');
    },
    onError: () => toast.error('Failed to delete category'),
  });
}

export function useSeedDefaults() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: categoriesApi.seedDefaults,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.categories.all() });
      toast.success('Default categories created');
    },
    onError: () => toast.error('Failed to create defaults'),
  });
}
