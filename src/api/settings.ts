import api from '@/lib/axios';
import type { ApiResponse, User, UserPreferences } from '@/types';

export interface SettingsStats {
  bookmarks: number;
  notes: number;
  videos: number;
  todos: number;
  screenshots: number;
  reminders: number;
  categories: number;
  completedTodos: number;
}

export interface ImportResult {
  imported: number;
}

export const settingsApi = {
  getProfile: () => api.get<ApiResponse<User>>('/settings/profile'),

  updateProfile: (name: string) =>
    api.patch<ApiResponse<User>>('/settings/profile', { name }),

  updatePreferences: (prefs: Partial<UserPreferences>) =>
    api.patch<ApiResponse<User>>('/settings/preferences', prefs),

  getStats: () => api.get<ApiResponse<SettingsStats>>('/settings/stats'),

  exportJson: () =>
    api.get('/settings/export', { params: { format: 'json' }, responseType: 'blob' }),

  exportCsv: () =>
    api.get('/settings/export', { params: { format: 'csv' }, responseType: 'blob' }),

  importData: (fileType: 'json' | 'html', content: string) =>
    api.post<ApiResponse<ImportResult>>('/settings/import', { fileType, content }),

  uploadAvatar: (file: File) => {
    const form = new FormData();
    form.append('avatar', file);
    return api.post<ApiResponse<User>>('/settings/avatar', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  removeAvatar: () => api.delete<ApiResponse<User>>('/settings/avatar'),

  deleteAccount: () => api.delete<ApiResponse<null>>('/settings/account'),
};
