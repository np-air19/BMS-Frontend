'use client';

import { useState } from 'react';
import { Pencil, Trash2, MoreHorizontal, CalendarClock } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { useToggleTodo, useDeleteTodo } from '@/hooks/useTodos';
import { cn } from '@/lib/utils';
import type { Todo } from '@/types';

const PRIORITY_STYLES = {
  high: 'bg-red-50 text-red-700 border-red-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const PRIORITY_LABELS = { high: '↑ High', medium: 'Medium', low: '↓ Low' };

function formatDue(date: string | Date | null): string | null {
  if (!date) return null;
  const d = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(d);
  due.setHours(0, 0, 0, 0);
  const diff = Math.round((due.getTime() - today.getTime()) / 86400000);
  if (diff < 0) return `${Math.abs(diff)}d overdue`;
  if (diff === 0) return 'Due today';
  if (diff === 1) return 'Due tomorrow';
  return `Due ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
}

interface Props {
  todo: Todo;
  onEdit: (todo: Todo) => void;
}

export default function TodoCard({ todo, onEdit }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const toggleMutation = useToggleTodo();
  const deleteMutation = useDeleteTodo();

  const dueLabel = formatDue(todo.dueDate ?? null);
  const isOverdue = !todo.isCompleted && !!todo.dueDate && new Date(todo.dueDate) < new Date();

  return (
    <>
      <div
        className={cn(
          'group flex items-start gap-3 rounded-xl border bg-card p-4 transition-all duration-200 hover:shadow-sm',
          todo.isCompleted && 'opacity-60',
        )}
      >
        {/* Checkbox */}
        <button
          type="button"
          onClick={() => toggleMutation.mutate(todo.id)}
          disabled={toggleMutation.isPending}
          className={cn(
            'mt-0.5 w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors',
            todo.isCompleted
              ? 'border-primary bg-primary'
              : 'border-muted-foreground/40 hover:border-primary',
          )}
        >
          {todo.isCompleted && (
            <svg className="w-3 h-3 text-primary-foreground" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-1">
          <p
            className={cn(
              'text-sm font-medium leading-snug',
              todo.isCompleted && 'line-through text-muted-foreground',
            )}
          >
            {todo.title}
          </p>

          {todo.description && (
            <p className={cn('text-xs text-muted-foreground line-clamp-2', todo.isCompleted && 'line-through')}>
              {todo.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            {todo.priority !== 'medium' && (
              <span className={cn('inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-bold border', PRIORITY_STYLES[todo.priority])}>
                {PRIORITY_LABELS[todo.priority]}
              </span>
            )}
            {dueLabel && (
              <span className={cn('inline-flex items-center gap-1 text-[10px]', isOverdue ? 'text-destructive font-medium' : 'text-muted-foreground')}>
                <CalendarClock className="w-3 h-3" />
                {dueLabel}
              </span>
            )}
          </div>
        </div>

        {/* Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="opacity-0 group-hover:opacity-100 -mt-0.5 -mr-1 p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-all">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem onClick={() => onEdit(todo)}>
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setConfirmDelete(true)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete todo?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{todo.title}&rdquo; will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteMutation.mutate(todo.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
