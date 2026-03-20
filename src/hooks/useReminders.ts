'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  remindersApi,
  type CreateReminderPayload,
  type UpdateReminderPayload,
} from '@/api/reminders';
import { queryKeys } from '@/lib/queryKeys';
import { toast } from 'sonner';

export function useReminders() {
  return useQuery({
    queryKey: queryKeys.reminders.all(),
    queryFn: async () => {
      const res = await remindersApi.getAll();
      return res.data.data;
    },
  });
}

export function useCreateReminder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateReminderPayload) => remindersApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reminders'] });
      toast.success('Reminder set');
    },
    onError: () => toast.error('Failed to create reminder'),
  });
}

export function useUpdateReminder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateReminderPayload }) =>
      remindersApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reminders'] });
      toast.success('Reminder updated');
    },
    onError: () => toast.error('Failed to update reminder'),
  });
}

export function useToggleComplete() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => remindersApi.toggleComplete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reminders'] });
    },
    onError: () => toast.error('Failed to update reminder'),
  });
}

export function useDeleteReminder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => remindersApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reminders'] });
      toast.success('Reminder deleted');
    },
    onError: () => toast.error('Failed to delete reminder'),
  });
}
