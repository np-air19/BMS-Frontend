import api from '@/lib/axios';
import type { ApiResponse, PaginatedResponse, Note } from '@/types';

export interface NoteParams {
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tags?: string[];
  bookmarkId?: string;
}

export interface UpdateNotePayload {
  title?: string;
  content?: string;
  tags?: string[];
  bookmarkId?: string | null;
}

export const notesApi = {
  getAll: (params?: NoteParams) =>
    api.get<PaginatedResponse<Note>>('/notes', { params }),

  getById: (id: string) =>
    api.get<ApiResponse<Note>>(`/notes/${id}`),

  create: (data: CreateNotePayload) =>
    api.post<ApiResponse<Note>>('/notes', data),

  update: (id: string, data: UpdateNotePayload) =>
    api.patch<ApiResponse<Note>>(`/notes/${id}`, data),

  delete: (id: string) =>
    api.delete<ApiResponse<null>>(`/notes/${id}`),
};
