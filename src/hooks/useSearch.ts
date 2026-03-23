'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchApi } from '@/api/search';
import { queryKeys } from '@/lib/queryKeys';

function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export function useSearch(query: string) {
  const debouncedQuery = useDebounce(query, 300);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: queryKeys.search.results(debouncedQuery),
    queryFn: async () => {
      const res = await searchApi.search(debouncedQuery);
      return res.data.data;
    },
    enabled: debouncedQuery.trim().length >= 2,
    staleTime: 30 * 1000,
    placeholderData: (prev) => prev,
  });

  return {
    results: data,
    isLoading: isLoading && debouncedQuery.trim().length >= 2,
    isFetching,
    debouncedQuery,
  };
}
