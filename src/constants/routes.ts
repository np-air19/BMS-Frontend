export const ROUTES = {
  HOME: '/',
  SIGN_IN: '/signin',
  DASHBOARD: '/dashboard',
  BOOKMARKS: '/bookmarks',
  NOTES: '/notes',
  VIDEOS: '/videos',
  TODOS: '/todos',
  SCREENSHOTS: '/screenshots',
  REMINDERS: '/reminders',
  CATEGORIES: '/categories',
  SETTINGS: '/settings',
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
