import { queryClient } from '@/lib/queryClient';
import { useAuthStore } from '@/store/authStore';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1';

export async function logoutUser(): Promise<void> {
  queryClient.clear();

  useAuthStore.getState().logout();

  try {
    await Promise.race([
      fetch(`${BASE_URL}/auth/logout`, { method: 'POST', credentials: 'include' }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000)),
    ]);
  } catch {
  }

  window.location.href = '/signin';
}
