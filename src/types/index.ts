// ─── Enums ────────────────────────────────────────────

export type LearningStatus = 'not_started' | 'in_progress' | 'completed';
export type Priority = 'high' | 'medium' | 'low';
export type Theme = 'light' | 'dark' | 'system';
export type SessionDuration = '1d' | '7d' | '30d' | 'never';
export type DefaultReminderTime = '06:00' | '09:00' | '12:00' | '18:00' | '21:00';

// ─── User ─────────────────────────────────────────────

export interface UserPreferences {
  theme: Theme;
  defaultReminderTime: DefaultReminderTime;
  sessionDuration: SessionDuration;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  isVerified: boolean;
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

// ─── Category ─────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  color: string;
  isDefault: boolean;
  parentId?: string | null;
  parent?: Category | null;
  children?: Category[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Bookmark ─────────────────────────────────────────

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  favicon?: string | null;
  purpose?: string | null;
  categories?: Category[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Note ─────────────────────────────────────────────

export interface Note {
  id: string;
  title: string;
  content: string;
  tags?: string[];
  bookmark?: Pick<Bookmark, 'id' | 'title' | 'url'> | null;
  bookmarkId?: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Video ────────────────────────────────────────────

export interface Video {
  id: string;
  youtubeId: string;
  youtubeUrl: string;
  title: string;
  customTitle?: string | null;
  thumbnailUrl?: string | null;
  duration?: string | null;
  channelName?: string | null;
  notes?: string | null;
  learningStatus: LearningStatus;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Todo ─────────────────────────────────────────────

export interface Todo {
  id: string;
  title: string;
  description?: string | null;
  isCompleted: boolean;
  priority: Priority;
  dueDate?: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Screenshot ───────────────────────────────────────

export interface Screenshot {
  id: string;
  title: string;
  imageUrl: string;
  description?: string | null;
  mimeType?: string | null;
  fileSize?: number | null;
  bookmark?: Pick<Bookmark, 'id' | 'title' | 'url'> | null;
  bookmarkId?: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Reminder ─────────────────────────────────────────

export interface Reminder {
  id: string;
  message?: string | null;
  remindAt: string;
  isCompleted: boolean;
  isNotified: boolean;
  bookmark?: Pick<Bookmark, 'id' | 'title' | 'url'> | null;
  bookmarkId?: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Dashboard ────────────────────────────────────────

export interface DashboardStats {
  totalBookmarks: number;
  totalNotes: number;
  totalVideos: number;
  totalTodos: number;
  totalScreenshots: number;
  totalReminders: number;
  completedTodos: number;
  pendingReminders: number;
  overdueReminders: number;
  bookmarksThisWeek: number;
  notesThisWeek: number;
}

export interface RecentActivity {
  id: string;
  type: 'bookmark' | 'note' | 'video';
  title: string;
  createdAt: string;
}

// ─── API Response Wrappers ────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
