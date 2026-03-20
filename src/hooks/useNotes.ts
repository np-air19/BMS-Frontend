'use client';

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  notesApi,
  type NoteParams,
  type CreateNotePayload,
  type UpdateNotePayload,
} from '@/api/notes';
import { queryKeys } from '@/lib/queryKeys';
import { toast } from 'sonner';

export function useNotes(params?: NoteParams) {
  return useQuery({
    queryKey: queryKeys.notes.all(params as Record<string, unknown>),
    queryFn: async () => {
      const res = await notesApi.getAll(params);
      return res.data;
    },
    placeholderData: keepPreviousData,
  });
}

export function useNote(id: string) {
  return useQuery({
    queryKey: queryKeys.notes.detail(id),
    queryFn: async () => {
      const res = await notesApi.getById(id);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useCreateNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateNotePayload) => notesApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note saved');
    },
    onError: () => toast.error('Failed to save note'),
  });
}

export function useUpdateNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateNotePayload }) =>
      notesApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note updated');
    },
    onError: () => toast.error('Failed to update note'),
  });
}

export function useDeleteNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notesApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note deleted');
    },
    onError: () => toast.error('Failed to delete note'),
  });
}
