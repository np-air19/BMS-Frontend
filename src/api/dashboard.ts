import api from '@/lib/axios';
import type { ApiResponse } from '@/types';

export interface DashboardStats {
  bookmarks: number;
  notes: number;
  activeTodos: number;
  pendingReminders: number;
  overdueReminders: number;
  videos: number;
}

export interface ActivityItem {
  id: string;
  type: 'bookmark' | 'note' | 'video';
  title: string;
  url: string | null;
  createdAt: string;
}

export const dashboardApi = {
  getStats: () => api.get<ApiResponse<DashboardStats>>('/dashboard/stats'),
  getActivity: () => api.get<ApiResponse<ActivityItem[]>>('/dashboard/activity'),
};
