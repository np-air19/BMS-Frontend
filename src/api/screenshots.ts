import api from '@/lib/axios';
import type { ApiResponse, PaginatedResponse, Screenshot } from '@/types';

export interface ScreenshotParams {
  search?: string;
  page?: number;
  limit?: number;
}

export interface UpdateScreenshotPayload {
  title?: string;
  description?: string;
}

export const screenshotsApi = {
  getAll: (params?: ScreenshotParams) =>
    api.get<PaginatedResponse<Screenshot>>('/screenshots', { params }),

  create: (data: FormData) =>
    api.post<ApiResponse<Screenshot>>('/screenshots', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  update: (id: string, data: UpdateScreenshotPayload) =>
    api.patch<ApiResponse<Screenshot>>(`/screenshots/${id}`, data),

  delete: (id: string) =>
    api.delete<ApiResponse<null>>(`/screenshots/${id}`),
};
