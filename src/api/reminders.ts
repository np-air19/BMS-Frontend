import api from '@/lib/axios';
import type { ApiResponse, Reminder } from '@/types';

export interface CreateReminderPayload {
  remindAt: string; // ISO string
  message?: string;
  bookmarkId?: string;
}

export interface UpdateReminderPayload {
  remindAt?: string;
  message?: string;
}

export const remindersApi = {
  getAll: () => api.get<ApiResponse<Reminder[]>>('/reminders'),

  create: (data: CreateReminderPayload) =>
    api.post<ApiResponse<Reminder>>('/reminders', data),

  update: (id: string, data: UpdateReminderPayload) =>
    api.patch<ApiResponse<Reminder>>(`/reminders/${id}`, data),

  toggleComplete: (id: string) =>
    api.patch<ApiResponse<Reminder>>(`/reminders/${id}/complete`),

  delete: (id: string) =>
    api.delete<ApiResponse<null>>(`/reminders/${id}`),
};
