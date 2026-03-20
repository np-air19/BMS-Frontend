'use client';

import { useState } from 'react';
import { Plus, Bell, ExternalLink, Pencil, Trash2, Check } from 'lucide-react';
import { format, isPast, isToday, isTomorrow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useReminders, useToggleComplete, useDeleteReminder } from '@/hooks/useReminders';
import ReminderDialog from '@/components/reminders/ReminderDialog';
import type { Reminder } from '@/types';
import { cn } from '@/lib/utils';

type ReminderStatus = 'scheduled' | 'overdue' | 'completed';

function getStatus(r: Reminder): ReminderStatus {
  if (r.isCompleted) return 'completed';
  if (isPast(new Date(r.remindAt))) return 'overdue';
  return 'scheduled';
}

const STATUS_CONFIG = {
  scheduled: {
    label: 'Scheduled',
    className: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-500',
  },
  overdue: {
    label: 'Overdue',
    className: 'bg-red-50 text-red-700 border-red-200',
    dot: 'bg-red-500',
  },
  completed: {
    label: 'Done',
    className: 'bg-green-50 text-green-700 border-green-200',
    dot: 'bg-green-500',
  },
} as const;

function formatReminderDate(dateStr: string): string {
  const d = new Date(dateStr);
  const timeStr = format(d, 'h:mm a');
  if (isToday(d)) return `Today at ${timeStr}`;
  if (isTomorrow(d)) return `Tomorrow at ${timeStr}`;
  return format(d, 'MMM d, yyyy') + ` at ${timeStr}`;
}

function ReminderRow({
  reminder,
  onEdit,
}: {
  reminder: Reminder;
  onEdit: (r: Reminder) => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const toggleMutation = useToggleComplete();
  const deleteMutation = useDeleteReminder();
  const status = getStatus(reminder);
  const cfg = STATUS_CONFIG[status];

  return (
    <>
      <div
        className={cn(
          'group flex items-start gap-4 rounded-xl border bg-card p-4 transition-all hover:shadow-sm',
          status === 'completed' && 'opacity-60',
        )}
      >
        <button
          onClick={() => toggleMutation.mutate(reminder.id)}
          disabled={toggleMutation.isPending}
          className={cn(
            'mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors',
            reminder.isCompleted
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-muted-foreground/30 hover:border-green-400',
          )}
        >
          {reminder.isCompleted && <Check className="w-3 h-3" />}
        </button>

        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-foreground">
              {formatReminderDate(reminder.remindAt)}
            </span>
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold border',
                cfg.className,
              )}
            >
              <span className={cn('w-1.5 h-1.5 rounded-full', cfg.dot)} />
              {cfg.label}
            </span>
          </div>

          {reminder.message && (
            <p
              className={cn(
                'text-sm text-muted-foreground leading-relaxed',
                reminder.isCompleted && 'line-through',
              )}
            >
              {reminder.message}
            </p>
          )}

          {reminder.bookmark && (
            <a
              href={reminder.bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
            >
              <ExternalLink className="w-3 h-3" />
              {reminder.bookmark.title}
            </a>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          {!reminder.isCompleted && (
            <button
              onClick={() => onEdit(reminder)}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={() => setConfirmDelete(true)}
            className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete reminder?</AlertDialogTitle>
            <AlertDialogDescription>
              This reminder will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteMutation.mutate(reminder.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default function RemindersPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [filter, setFilter] = useState<'all' | ReminderStatus>('all');

  const { data: reminders = [], isLoading } = useReminders();

  const filtered =
    filter === 'all' ? reminders : reminders.filter((r) => getStatus(r) === filter);

  const counts = {
    all: reminders.length,
    scheduled: reminders.filter((r) => getStatus(r) === 'scheduled').length,
    overdue: reminders.filter((r) => getStatus(r) === 'overdue').length,
    completed: reminders.filter((r) => getStatus(r) === 'completed').length,
  };

  const handleEdit = (r: Reminder) => {
    setEditingReminder(r);
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEditingReminder(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reminders</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {counts.overdue > 0
              ? `${counts.overdue} overdue · ${counts.scheduled} upcoming`
              : `${counts.scheduled} upcoming`}
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingReminder(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add reminder
        </Button>
      </div>

      <div className="flex items-center gap-1 border-b">
        {(
          [
            { key: 'all', label: 'All' },
            { key: 'scheduled', label: 'Scheduled' },
            { key: 'overdue', label: 'Overdue' },
            { key: 'completed', label: 'Done' },
          ] as const
        ).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={cn(
              'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
              filter === key
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            {label}
            {counts[key] > 0 && (
              <span
                className={cn(
                  'ml-1.5 inline-flex items-center justify-center rounded-full text-[10px] font-semibold w-4 h-4',
                  filter === key ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
                )}
              >
                {counts[key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <Bell className="w-7 h-7 text-primary" />
          </div>
          <h3 className="font-semibold mb-1">
            {filter === 'all' ? 'No reminders yet' : `No ${filter} reminders`}
          </h3>
          <p className="text-sm text-muted-foreground mb-5 max-w-xs">
            {filter === 'all'
              ? 'Set reminders for saved bookmarks and get email notifications when they are due'
              : 'Nothing here right now'}
          </p>
          {filter === 'all' && (
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add your first reminder
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <ReminderRow key={r.id} reminder={r} onEdit={handleEdit} />
          ))}
        </div>
      )}

      <ReminderDialog open={dialogOpen} onClose={handleClose} reminder={editingReminder} />
    </div>
  );
}
