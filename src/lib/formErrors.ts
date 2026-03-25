import axios from 'axios';
import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';

export function applyServerErrors<T extends FieldValues>(
  err: unknown,
  setError: UseFormSetError<T>,
  fallbackField?: Path<T>,
): boolean {
  if (!axios.isAxiosError(err)) return false;
  const data = err.response?.data as { errors?: Record<string, string[]>; message?: string };

  if (data?.errors && Object.keys(data.errors).length > 0) {
    for (const [field, messages] of Object.entries(data.errors)) {
      setError(field as Path<T>, { type: 'server', message: messages[0] });
    }
    return true;
  }

  if (fallbackField && data?.message) {
    setError(fallbackField, { type: 'server', message: data.message });
    return true;
  }

  return false;
}
