'use client';

import { useState, useRef } from 'react';
import { useTheme } from 'next-themes';
import {
  User,
  Sliders,
  Database,
  BarChart3,
  Upload,
  Download,
  Trash2,
  Save,
  Sun,
  Moon,
  Monitor,
  Clock,
  Shield,
  Bookmark,
  FileText,
  PlaySquare,
  CheckSquare,
  Image,
  FolderOpen,
  Bell,
  AlertTriangle,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import {
  useUpdateProfile,
  useUpdatePreferences,
  useSettingsStats,
  useExportData,
  useImportData,
  useDeleteAccount,
} from '@/hooks/useSettings';
import { AvatarUpload } from '@/components/settings/AvatarUpload';
import type { UserPreferences, DefaultReminderTime, SessionDuration, Theme } from '@/types';

function ProfileTab() {
  const user = useAuthStore((s) => s.user);
  const [name, setName] = useState(user?.name ?? '');
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const handleSave = () => {
    if (!name.trim() || name.trim() === user?.name) return;
    updateProfile(name.trim());
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Display Name</CardTitle>
          <CardDescription>Update the name shown across the app.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <AvatarUpload currentAvatar={user?.avatar} initials={initials} />

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your display name"
              maxLength={100}
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={isPending || !name.trim() || name.trim() === user?.name}
            size="sm"
            className="gap-2"
          >
            <Save className="w-3.5 h-3.5" />
            {isPending ? 'Saving…' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Account Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium">{user?.email}</span>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Status</span>
            <Badge
              variant="secondary"
              className="text-emerald-600 bg-emerald-50 dark:bg-emerald-950"
            >
              Verified
            </Badge>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Member since</span>
            <span className="font-medium">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : '—'}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

type ThemeOption = { value: Theme; label: string; Icon: React.ElementType };

const THEME_OPTIONS: ThemeOption[] = [
  { value: 'light', label: 'Light', Icon: Sun },
  { value: 'dark', label: 'Dark', Icon: Moon },
  { value: 'system', label: 'System', Icon: Monitor },
];

const REMINDER_OPTIONS: { value: DefaultReminderTime; label: string }[] = [
  { value: '06:00', label: '6:00 AM' },
  { value: '09:00', label: '9:00 AM' },
  { value: '12:00', label: '12:00 PM' },
  { value: '18:00', label: '6:00 PM' },
  { value: '21:00', label: '9:00 PM' },
];

const SESSION_OPTIONS: { value: SessionDuration; label: string; description: string }[] = [
  { value: '1d', label: '1 Day', description: 'Re-login every day' },
  { value: '7d', label: '7 Days', description: 'Stay logged in for a week' },
  { value: '30d', label: '30 Days', description: 'Stay logged in for a month' },
  { value: 'never', label: 'Never expire', description: 'Stay logged in indefinitely' },
];

function PreferencesTab() {
  const user = useAuthStore((s) => s.user);
  const { setTheme } = useTheme();
  const { mutate: updatePreferences, isPending } = useUpdatePreferences();

  const [prefs, setPrefs] = useState<UserPreferences>({
    theme: user?.preferences?.theme ?? 'system',
    defaultReminderTime: user?.preferences?.defaultReminderTime ?? '09:00',
    sessionDuration: user?.preferences?.sessionDuration ?? '7d',
  });

  const handleTheme = (theme: Theme) => {
    setPrefs((p) => ({ ...p, theme }));
    setTheme(theme);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Theme */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sun className="w-4 h-4" /> Theme
            </CardTitle>
            <CardDescription>Choose how the app looks.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {THEME_OPTIONS.map(({ value, label, Icon }) => (
                <button
                  key={value}
                  onClick={() => handleTheme(value)}
                  className={cn(
                    'flex flex-col items-center gap-2 p-3 rounded-lg border-2 text-sm font-medium transition-colors',
                    prefs.theme === value
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border hover:border-muted-foreground/40',
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="w-4 h-4" /> Default Reminder Time
            </CardTitle>
            <CardDescription>Pre-fill when creating new reminders.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {REMINDER_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setPrefs((p) => ({ ...p, defaultReminderTime: value }))}
                  className={cn(
                    'px-3 py-1.5 rounded-full border text-sm font-medium transition-colors',
                    prefs.defaultReminderTime === value
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border hover:border-muted-foreground/40',
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="w-4 h-4" /> Session Duration
          </CardTitle>
          <CardDescription>How long you stay logged in.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {SESSION_OPTIONS.map(({ value, label, description }) => (
              <button
                key={value}
                onClick={() => setPrefs((p) => ({ ...p, sessionDuration: value }))}
                className={cn(
                  'flex flex-col gap-1 px-4 py-3 rounded-lg border-2 text-left transition-colors',
                  prefs.sessionDuration === value
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-muted-foreground/40',
                )}
              >
                <p
                  className={cn(
                    'text-sm font-medium',
                    prefs.sessionDuration === value && 'text-primary',
                  )}
                >
                  {label}
                </p>
                <p className="text-xs text-muted-foreground">{description}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button onClick={() => updatePreferences(prefs)} disabled={isPending} className="gap-2">
        <Save className="w-3.5 h-3.5" />
        {isPending ? 'Saving…' : 'Save Preferences'}
      </Button>
    </div>
  );
}

interface StatItem {
  label: string;
  value: number;
  Icon: React.ElementType;
  color: string;
  bg: string;
}

function StatisticsTab() {
  const { data: stats, isLoading } = useSettingsStats();

  const items: StatItem[] = stats
    ? [
        { label: 'Bookmarks', value: stats.bookmarks, Icon: Bookmark, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-950' },
        { label: 'Notes', value: stats.notes, Icon: FileText, color: 'text-violet-600', bg: 'bg-violet-50 dark:bg-violet-950' },
        { label: 'Videos', value: stats.videos, Icon: PlaySquare, color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-950' },
        { label: 'Todos', value: stats.todos, Icon: CheckSquare, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950' },
        { label: 'Screenshots', value: stats.screenshots, Icon: Image, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950' },
        { label: 'Reminders', value: stats.reminders, Icon: Bell, color: 'text-sky-600', bg: 'bg-sky-50 dark:bg-sky-950' },
        { label: 'Categories', value: stats.categories, Icon: FolderOpen, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-950' },
        { label: 'Completed Todos', value: stats.completedTodos, Icon: Shield, color: 'text-teal-600', bg: 'bg-teal-50 dark:bg-teal-950' },
      ]
    : [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="w-4 h-4" /> Your Data Overview
          </CardTitle>
          <CardDescription>A summary of all items across your account.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {items.map(({ label, value, Icon, color, bg }) => (
                <div key={label} className="flex flex-col gap-3 p-4 rounded-lg border bg-card">
                  <div className={cn('w-8 h-8 rounded-md flex items-center justify-center', bg)}>
                    <Icon className={cn('w-4 h-4', color)} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{value.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Todo Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Completed</span>
              <span className="font-medium">
                {stats.completedTodos} / {stats.todos}
              </span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{
                  width:
                    stats.todos > 0
                      ? `${Math.round((stats.completedTodos / stats.todos) * 100)}%`
                      : '0%',
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.todos > 0
                ? `${Math.round((stats.completedTodos / stats.todos) * 100)}% completion rate`
                : 'No todos yet'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function DataTab() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: exportData, isPending: isExporting } = useExportData();
  const { mutate: importData, isPending: isImporting } = useImportData();
  const { mutate: deleteAccount, isPending: isDeleting } = useDeleteAccount();
  const [confirmText, setConfirmText] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split('.').pop()?.toLowerCase();
    const fileType: 'json' | 'html' = ext === 'html' || ext === 'htm' ? 'html' : 'json';
    const content = await file.text();
    importData({ fileType, content });
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Export */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Download className="w-4 h-4" /> Export Data
          </CardTitle>
          <CardDescription>Download a copy of your data.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-lg border p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-600" />
                <p className="text-sm font-medium">Full Export (JSON)</p>
              </div>
              <p className="text-xs text-muted-foreground">
                All bookmarks, notes, videos, todos, and screenshots in JSON format.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 w-full"
                onClick={() => exportData('json')}
                disabled={isExporting}
              >
                <Download className="w-3.5 h-3.5" />
                Download JSON
              </Button>
            </div>

            <div className="rounded-lg border p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-emerald-600" />
                <p className="text-sm font-medium">Bookmarks CSV</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Bookmarks only, in CSV format — compatible with spreadsheets.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 w-full"
                onClick={() => exportData('csv')}
                disabled={isExporting}
              >
                <Download className="w-3.5 h-3.5" />
                Download CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Import */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Upload className="w-4 h-4" /> Import Data
          </CardTitle>
          <CardDescription>
            Import bookmarks from a BMS JSON export or a browser HTML bookmarks file.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,.html,.htm"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="rounded-lg border-2 border-dashed p-10 flex flex-col items-center gap-3 text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">Drop a file or click to browse</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Supports .json and .html bookmark files
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
            >
              <Upload className="w-3.5 h-3.5" />
              {isImporting ? 'Importing…' : 'Choose File'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-4 h-4" /> Danger Zone
          </CardTitle>
          <CardDescription>
            Permanently delete your account and all associated data. This cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="gap-2">
                <Trash2 className="w-3.5 h-3.5" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all your bookmarks, notes, videos, todos,
                  screenshots, reminders, and your account. This action{' '}
                  <strong>cannot be undone</strong>.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="space-y-2 py-2">
                <Label htmlFor="confirm-delete" className="text-sm">
                  Type <span className="font-mono font-semibold">DELETE</span> to confirm
                </Label>
                <Input
                  id="confirm-delete"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="DELETE"
                  className="font-mono"
                />
              </div>

              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setConfirmText('')}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteAccount()}
                  disabled={confirmText !== 'DELETE' || isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? 'Deleting…' : 'Delete Account'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}

const TABS = [
  { value: 'profile', label: 'Profile', Icon: User },
  { value: 'preferences', label: 'Preferences', Icon: Sliders },
  { value: 'statistics', label: 'Statistics', Icon: BarChart3 },
  { value: 'data', label: 'Data', Icon: Database },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-0.5 text-sm">
          Manage your profile, preferences, and account data.
        </p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          {TABS.map(({ value, label, Icon }) => (
            <TabsTrigger key={value} value={value} className="gap-1.5 text-xs sm:text-sm">
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{label.slice(0, 4)}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mt-6">
          <TabsContent value="profile">
            <ProfileTab />
          </TabsContent>
          <TabsContent value="preferences">
            <PreferencesTab />
          </TabsContent>
          <TabsContent value="statistics">
            <StatisticsTab />
          </TabsContent>
          <TabsContent value="data">
            <DataTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
