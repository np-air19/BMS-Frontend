// Types — All TypeScript interfaces matching backend entities

// ─── Enums ────────────────────────────────────────────

export type LearningStatus = 'not_started' | 'in_progress' | 'completed';
export type Priority = 'high' | 'medium' | 'low';

// ─── Core Entities ────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  parentId?: string;
  userId: string;
  children?: Category[];
  createdAt: string;
  updatedAt: string;
}

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  description?: string;
  favicon?: string;
  learningStatus: LearningStatus;
  categories?: Category[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  bookmarkId?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Video {
  id: string;
  title: string;
  url: string;
  thumbnailUrl?: string;
  duration?: string;
  learningStatus: LearningStatus;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Todo {
  id: string;
  title: string;
  isCompleted: boolean;
  priority: Priority;
  dueDate?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Screenshot {
  id: string;
  title: string;
  imageUrl: string;
  bookmarkId?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  remindAt: string;
  isCompleted: boolean;
  bookmarkId?: string;
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
  };
}

// ─── DTOs ─────────────────────────────────────────────

export interface CreateBookmarkDto {
  title: string;
  url: string;
  description?: string;
  learningStatus?: LearningStatus;
  categoryIds?: string[];
}

export interface UpdateBookmarkDto extends Partial<CreateBookmarkDto> {}

export interface CreateNoteDto {
  title: string;
  content: string;
  bookmarkId?: string;
}

export interface UpdateNoteDto extends Partial<CreateNoteDto> {}

export interface CreateVideoDto {
  title: string;
  url: string;
  learningStatus?: LearningStatus;
}

export interface UpdateVideoDto extends Partial<CreateVideoDto> {}

export interface CreateTodoDto {
  title: string;
  priority?: Priority;
  dueDate?: string;
}

export interface UpdateTodoDto extends Partial<CreateTodoDto> {
  isCompleted?: boolean;
}

export interface CreateReminderDto {
  title: string;
  description?: string;
  remindAt: string;
  bookmarkId?: string;
}

export interface UpdateReminderDto extends Partial<CreateReminderDto> {
  isCompleted?: boolean;
}

export interface CreateCategoryDto {
  name: string;
  parentId?: string;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {}

export interface CreateScreenshotDto {
  title: string;
  bookmarkId?: string;
  // file is handled via FormData
}
