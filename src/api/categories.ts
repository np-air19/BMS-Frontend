import api from '@/lib/axios';
import type { ApiResponse, Category } from '@/types';

export interface CategoryTree extends Category {
  children: CategoryTree[];
}

export const categoriesApi = {
  getTree: () =>
    api.get<ApiResponse<CategoryTree[]>>('/categories'),

  create: (data: { name: string; color: string; parentId?: string }) =>
    api.post<ApiResponse<Category>>('/categories', data),

  update: (id: string, data: { name?: string; color?: string; parentId?: string | null }) =>
    api.patch<ApiResponse<Category>>(`/categories/${id}`, data),

  delete: (id: string) =>
    api.delete<ApiResponse<null>>(`/categories/${id}`),

  seedDefaults: () =>
    api.post<ApiResponse<Category[]>>('/categories/defaults'),
};
