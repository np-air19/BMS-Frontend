'use client';

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  todosApi,
  type TodoParams,
  type CreateTodoPayload,
  type UpdateTodoPayload,
} from '@/api/todos';
import { queryKeys } from '@/lib/queryKeys';
import { toast } from 'sonner';

export function useTodos(params?: TodoParams) {
  return useQuery({
    queryKey: queryKeys.todos.all(params as Record<string, unknown>),
    queryFn: async () => {
      const res = await todosApi.getAll(params);
      return res.data;
    },
    placeholderData: keepPreviousData,
  });
}

export function useCreateTodo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTodoPayload) => todosApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['todos'] });
      toast.success('Todo created');
    },
    onError: () => toast.error('Failed to create todo'),
  });
}

export function useUpdateTodo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTodoPayload }) =>
      todosApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['todos'] });
      toast.success('Todo updated');
    },
    onError: () => toast.error('Failed to update todo'),
  });
}

export function useToggleTodo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => todosApi.toggle(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['todos'] });
    },
    onError: () => toast.error('Failed to update todo'),
  });
}

export function useDeleteTodo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => todosApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['todos'] });
      toast.success('Todo deleted');
    },
    onError: () => toast.error('Failed to delete todo'),
  });
}
