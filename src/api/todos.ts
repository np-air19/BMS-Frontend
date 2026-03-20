import api from '@/lib/axios';
import type { ApiResponse, PaginatedResponse, Todo } from '@/types';

export interface TodoParams {
  search?: string;
  status?: 'all' | 'active' | 'completed';
  priority?: 'high' | 'medium' | 'low';
  page?: number;
  limit?: number;
}

export interface CreateTodoPayload {
  title: string;
  description?: string;
  priority?: 'high' | 'medium' | 'low';
  dueDate?: string;
}

export interface UpdateTodoPayload {
  title?: string;
  description?: string;
  priority?: 'high' | 'medium' | 'low';
  dueDate?: string | null;
}

export const todosApi = {
  getAll: (params?: TodoParams) =>
    api.get<PaginatedResponse<Todo>>('/todos', { params }),

  create: (data: CreateTodoPayload) =>
    api.post<ApiResponse<Todo>>('/todos', data),

  update: (id: string, data: UpdateTodoPayload) =>
    api.patch<ApiResponse<Todo>>(`/todos/${id}`, data),

  toggle: (id: string) =>
    api.patch<ApiResponse<Todo>>(`/todos/${id}/toggle`),

  delete: (id: string) =>
    api.delete<ApiResponse<null>>(`/todos/${id}`),
};
