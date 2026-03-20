'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/api/dashboard';
import { queryKeys } from '@/lib/queryKeys';

export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.dashboard.stats(),
    queryFn: async () => {
      const res = await dashboardApi.getStats();
      return res.data.data;
    },
  });
}

export function useDashboardActivity() {
  return useQuery({
    queryKey: queryKeys.dashboard.activity(),
    queryFn: async () => {
      const res = await dashboardApi.getActivity();
      return res.data.data;
    },
  });
}
