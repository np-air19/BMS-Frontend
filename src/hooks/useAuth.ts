'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { authApi } from '@/api/auth';
import { queryKeys } from '@/lib/queryKeys';
import { useAuthStore } from '@/store/authStore';

export function useAuth() {
  const { user, setUser, logout } = useAuthStore();

  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: async () => {
      const res = await authApi.me();
      return res.data.data;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (data) setUser(data);
  }, [data, setUser]);

  // On any auth error (expired token, invalid session) clear store and redirect
  useEffect(() => {
    if (isError) {
      logout();
      if (typeof window !== 'undefined') {
        window.location.href = '/signin';
      }
    }
  }, [isError, logout]);

  return { user: data ?? user, isAuthenticated: Boolean(data ?? user), isLoading };
}
