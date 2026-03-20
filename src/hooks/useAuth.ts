'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { authApi } from '@/api/auth';
import { queryKeys } from '@/lib/queryKeys';
import { useAuthStore } from '@/store/authStore';

export function useAuth() {
  const { user, isAuthenticated, setUser, logout } = useAuthStore();

  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: async () => {
      const res = await authApi.me();
      return res.data.data;
    },
    retry: false,
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (data) setUser(data);
  }, [data, setUser]);

  useEffect(() => {
    if (error) logout();
  }, [error, logout]);

  return { user, isAuthenticated, isLoading };
}
