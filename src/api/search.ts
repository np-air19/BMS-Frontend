import api from '@/lib/axios';
import type { ApiResponse } from '@/types';

export type SearchResultType = 'bookmark' | 'note' | 'video' | 'todo' | 'screenshot';

export interface SearchResultItem {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle: string | null;
  url: string | null;
}

export interface SearchResults {
  bookmarks: SearchResultItem[];
  notes: SearchResultItem[];
  videos: SearchResultItem[];
  todos: SearchResultItem[];
  screenshots: SearchResultItem[];
  total: number;
}

export const searchApi = {
  search: (q: string) =>
    api.get<ApiResponse<SearchResults>>('/search', { params: { q } }),
};
