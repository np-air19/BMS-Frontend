import api from '@/lib/axios';
import type { ApiResponse, PaginatedResponse, Bookmark } from '@/types';

export interface BookmarkParams {
  search?: string;
  categoryId?: string;
  page?: number;
  limit?: number;
}

export interface CreateBookmarkPayload {
  title: string;
  url: string;
  purpose?: string;
  categoryIds?: string[];
}

export interface UpdateBookmarkPayload {
  title?: string;
  url?: string;
  purpose?: string;
  categoryIds?: string[];
}

export const bookmarksApi = {
  getAll: (params?: BookmarkParams) =>
    api.get<PaginatedResponse<Bookmark>>('/bookmarks', { params }),

  create: (data: CreateBookmarkPayload) =>
    api.post<ApiResponse<Bookmark>>('/bookmarks', data),

  update: (id: string, data: UpdateBookmarkPayload) =>
    api.patch<ApiResponse<Bookmark>>(`/bookmarks/${id}`, data),

  delete: (id: string) =>
    api.delete<ApiResponse<null>>(`/bookmarks/${id}`),
};
