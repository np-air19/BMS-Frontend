// Schemas — All Zod form validation schemas
// Connected to: zod, types/index.ts

import { z } from 'zod';

// ─── Auth ─────────────────────────────────────────────

export const signInSchema = z.object({
  email: z.email('Invalid email address'),
});

export const verifyOtpSchema = z.object({
  email: z.email(),
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Invalid email address'),
});

// ─── Bookmarks ────────────────────────────────────────

export const createBookmarkSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  url: z.string().url('Invalid URL'),
  description: z.string().optional(),
  learningStatus: z.enum(['not_started', 'in_progress', 'completed']).optional(),
  categoryIds: z.array(z.string()).optional(),
});

export const updateBookmarkSchema = createBookmarkSchema.partial();

// ─── Notes ────────────────────────────────────────────

export const createNoteSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  bookmarkId: z.string().optional(),
});

export const updateNoteSchema = createNoteSchema.partial();

// ─── Videos ───────────────────────────────────────────

export const createVideoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  url: z.string().url('Invalid URL'),
  learningStatus: z.enum(['not_started', 'in_progress', 'completed']).optional(),
});

export const updateVideoSchema = createVideoSchema.partial();

// ─── Todos ────────────────────────────────────────────

export const createTodoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  priority: z.enum(['high', 'medium', 'low']).optional(),
  dueDate: z.string().optional(),
});

export const updateTodoSchema = createTodoSchema.partial().extend({
  isCompleted: z.boolean().optional(),
});

// ─── Reminders ────────────────────────────────────────

export const createReminderSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  remindAt: z.string().min(1, 'Reminder date is required'),
  bookmarkId: z.string().optional(),
});

export const updateReminderSchema = createReminderSchema.partial().extend({
  isCompleted: z.boolean().optional(),
});

// ─── Categories ───────────────────────────────────────

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  parentId: z.string().optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

// ─── Inferred Types ──────────────────────────────────

export type SignInInput = z.infer<typeof signInSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreateBookmarkInput = z.infer<typeof createBookmarkSchema>;
export type UpdateBookmarkInput = z.infer<typeof updateBookmarkSchema>;
export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
export type CreateVideoInput = z.infer<typeof createVideoSchema>;
export type UpdateVideoInput = z.infer<typeof updateVideoSchema>;
export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
export type CreateReminderInput = z.infer<typeof createReminderSchema>;
export type UpdateReminderInput = z.infer<typeof updateReminderSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
