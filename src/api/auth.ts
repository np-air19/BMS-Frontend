import api from '@/lib/axios';
import type { ApiResponse, User } from '@/types';
import type { SignInInput, VerifyOtpInput, RegisterInput } from '@/schemas';

export const authApi = {
  requestOtp: (data: SignInInput) =>
    api.post<ApiResponse<null>>('/auth/request-otp', data),

  verifyOtp: (data: VerifyOtpInput) =>
    api.post<ApiResponse<{ user: User; token: string }>>('/auth/verify-otp', data),

  register: (data: RegisterInput) =>
    api.post<ApiResponse<{ user: User }>>('/auth/register', data),

  me: () =>
    api.get<ApiResponse<User>>('/auth/me'),

  logout: () =>
    api.post<ApiResponse<null>>('/auth/logout'),
};
