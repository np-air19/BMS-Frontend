import axios from 'axios';
import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';

export function applyServerErrors<T extends FieldValues>(
  err: unknown,
  setError: UseFormSetError<T>,
): boolean {
  if (!axios.isAxiosError(err)) return false;
  const errors = (err.response?.data as { errors?: Record<string, string[]> })?.errors;
  if (!errors || Object.keys(errors).length === 0) return false;

  for (const [field, messages] of Object.entries(errors)) {
    setError(field as Path<T>, { type: 'server', message: messages[0] });
  }
  return true;
}
