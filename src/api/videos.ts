import api from '@/lib/axios';
import type { ApiResponse, PaginatedResponse, Video, LearningStatus } from '@/types';

export interface VideoParams {
  search?: string;
  learningStatus?: LearningStatus;
  page?: number;
  limit?: number;
}

export interface CreateVideoPayload {
  url: string;
  customTitle?: string;
  notes?: string;
  learningStatus?: LearningStatus;
}

export interface UpdateVideoPayload {
  customTitle?: string;
  notes?: string;
  learningStatus?: LearningStatus;
}

export const videosApi = {
  getAll: (params?: VideoParams) =>
    api.get<PaginatedResponse<Video>>('/videos', { params }),

  create: (data: CreateVideoPayload) =>
    api.post<ApiResponse<Video>>('/videos', data),

  update: (id: string, data: UpdateVideoPayload) =>
    api.patch<ApiResponse<Video>>(`/videos/${id}`, data),

  delete: (id: string) =>
    api.delete<ApiResponse<null>>(`/videos/${id}`),
};
