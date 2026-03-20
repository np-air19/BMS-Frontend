import api from '@/lib/axios';
import type { ApiResponse, User } from '@/types';

export const authApi = {
  sendOtp: (email: string) =>
    api.post<ApiResponse<null>>('/auth/send-otp', { email }),

  verifyOtp: (email: string, otp: string) =>
    api.post<ApiResponse<{ user: User; token: string }>>('/auth/verify-otp', { email, otp }),

  me: () =>
    api.get<ApiResponse<User>>('/auth/me'),

  logout: () =>
    api.post<ApiResponse<null>>('/auth/logout'),
};
