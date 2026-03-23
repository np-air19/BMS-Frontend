'use client';

import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApi } from '@/api/settings';
import { queryKeys } from '@/lib/queryKeys';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import type { UserPreferences } from '@/types';

function apiError(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    return (err.response?.data as { message?: string })?.message ?? fallback;
  }
  return fallback;
}

export function useSettingsProfile() {
  return useQuery({
    queryKey: queryKeys.settings.profile(),
    queryFn: async () => {
      const res = await settingsApi.getProfile();
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (name: string) => settingsApi.updateProfile(name),
    onSuccess: (res) => {
      const user = res.data.data;
      setUser(user);
      qc.invalidateQueries({ queryKey: queryKeys.settings.profile() });
      qc.invalidateQueries({ queryKey: queryKeys.auth.me });
      toast.success('Profile updated');
    },
    onError: (err) => toast.error(apiError(err, 'Failed to update profile')),
  });
}

export function useUpdatePreferences() {
  const qc = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (prefs: Partial<UserPreferences>) => settingsApi.updatePreferences(prefs),
    onSuccess: (res) => {
      const user = res.data.data;
      setUser(user);
      qc.invalidateQueries({ queryKey: queryKeys.settings.profile() });
      qc.invalidateQueries({ queryKey: queryKeys.auth.me });
      toast.success('Preferences saved');
    },
    onError: (err) => toast.error(apiError(err, 'Failed to save preferences')),
  });
}

export function useSettingsStats() {
  return useQuery({
    queryKey: queryKeys.settings.stats(),
    queryFn: async () => {
      const res = await settingsApi.getStats();
      return res.data.data;
    },
    staleTime: 60 * 1000,
  });
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function useExportData() {
  return useMutation({
    mutationFn: async (format: 'json' | 'csv') => {
      const res = format === 'csv' ? await settingsApi.exportCsv() : await settingsApi.exportJson();
      const filename = format === 'csv' ? 'bms-bookmarks.csv' : 'bms-export.json';
      triggerDownload(res.data as Blob, filename);
    },
    onSuccess: () => toast.success('Export downloaded'),
    onError: (err) => toast.error(apiError(err, 'Export failed')),
  });
}

export function useImportData() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ fileType, content }: { fileType: 'json' | 'html'; content: string }) =>
      settingsApi.importData(fileType, content),
    onSuccess: (res) => {
      const { imported } = res.data.data;
      qc.invalidateQueries({ queryKey: ['bookmarks'] });
      qc.invalidateQueries({ queryKey: queryKeys.settings.stats() });
      toast.success(`Imported ${imported} item${imported !== 1 ? 's' : ''} successfully`);
    },
    onError: (err) => toast.error(apiError(err, 'Import failed — check the file format')),
  });
}

export function useUploadAvatar() {
  const qc = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (file: File) => settingsApi.uploadAvatar(file),
    onSuccess: (res) => {
      const user = res.data.data;
      setUser(user);
      qc.invalidateQueries({ queryKey: queryKeys.settings.profile() });
      qc.invalidateQueries({ queryKey: queryKeys.auth.me });
      toast.success('Avatar updated');
    },
    onError: (err) => toast.error(apiError(err, 'Failed to upload avatar')),
  });
}

export function useRemoveAvatar() {
  const qc = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: () => settingsApi.removeAvatar(),
    onSuccess: (res) => {
      const user = res.data.data;
      setUser(user);
      qc.invalidateQueries({ queryKey: queryKeys.settings.profile() });
      qc.invalidateQueries({ queryKey: queryKeys.auth.me });
      toast.success('Avatar removed');
    },
    onError: (err) => toast.error(apiError(err, 'Failed to remove avatar')),
  });
}

export function useDeleteAccount() {
  return useMutation({
    mutationFn: () => settingsApi.deleteAccount(),
    onSuccess: () => {
      useAuthStore.getState().logout();
      window.location.href = '/signin';
    },
    onError: (err) => toast.error(apiError(err, 'Failed to delete account')),
  });
}
