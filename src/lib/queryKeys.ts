export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  bookmarks: {
    all: (params?: Record<string, unknown>) => ['bookmarks', params] as const,
    detail: (id: string) => ['bookmarks', id] as const,
  },
  notes: {
    all: (params?: Record<string, unknown>) => ['notes', params] as const,
    detail: (id: string) => ['notes', id] as const,
  },
  videos: {
    all: (params?: Record<string, unknown>) => ['videos', params] as const,
    detail: (id: string) => ['videos', id] as const,
  },
  todos: {
    all: (params?: Record<string, unknown>) => ['todos', params] as const,
    detail: (id: string) => ['todos', id] as const,
  },
  screenshots: {
    all: (params?: Record<string, unknown>) => ['screenshots', params] as const,
    detail: (id: string) => ['screenshots', id] as const,
  },
  reminders: {
    all: (params?: Record<string, unknown>) => ['reminders', params] as const,
    detail: (id: string) => ['reminders', id] as const,
  },
  categories: {
    all: () => ['categories'] as const,
    detail: (id: string) => ['categories', id] as const,
    tree: () => ['categories', 'tree'] as const,
  },
  dashboard: {
    stats: () => ['dashboard', 'stats'] as const,
    activity: () => ['dashboard', 'activity'] as const,
  },
  search: {
    results: (query: string) => ['search', query] as const,
  },
  settings: {
    profile: () => ['settings', 'profile'] as const,
    stats: () => ['settings', 'stats'] as const,
  },
} as const;
