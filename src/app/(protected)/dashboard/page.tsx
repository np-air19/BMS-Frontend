'use client';

import { Bookmark, Bell, CheckSquare, FileText } from 'lucide-react';
import { useDashboardStats, useDashboardActivity } from '@/hooks/useDashboard';
import { StatCard } from '@/components/dashboard/StatCard';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { QuickActions } from '@/components/dashboard/QuickActions';

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: activity, isLoading: activityLoading } = useDashboardActivity();

  const overdueLabel =
    stats && stats.overdueReminders > 0
      ? `${stats.overdueReminders} overdue`
      : stats && stats.pendingReminders > 0
        ? 'All on schedule'
        : 'None pending';

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-0.5 text-sm">
          Your personal knowledge hub at a glance.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Bookmarks"
          value={stats?.bookmarks}
          icon={Bookmark}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50 dark:bg-indigo-950"
          subtitle={stats ? `${stats.videos} videos saved` : undefined}
          isLoading={statsLoading}
        />
        <StatCard
          label="Pending Reminders"
          value={stats?.pendingReminders}
          icon={Bell}
          iconColor="text-amber-600"
          iconBg="bg-amber-50 dark:bg-amber-950"
          subtitle={overdueLabel}
          isLoading={statsLoading}
        />
        <StatCard
          label="Active Todos"
          value={stats?.activeTodos}
          icon={CheckSquare}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50 dark:bg-emerald-950"
          subtitle="Not yet completed"
          isLoading={statsLoading}
        />
        <StatCard
          label="Total Notes"
          value={stats?.notes}
          icon={FileText}
          iconColor="text-violet-600"
          iconBg="bg-violet-50 dark:bg-violet-950"
          subtitle="Across all bookmarks"
          isLoading={statsLoading}
        />
      </div>

      {/* Lower section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ActivityFeed items={activity} isLoading={activityLoading} />
        </div>
        <QuickActions />
      </div>
    </div>
  );
}
