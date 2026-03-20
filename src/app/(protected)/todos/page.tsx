'use client';

import { useState, useRef } from 'react';
import { Plus, Search, CheckSquare, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useTodos } from '@/hooks/useTodos';
import TodoCard from '@/components/todos/TodoCard';
import TodoDialog from '@/components/todos/TodoDialog';
import type { Todo } from '@/types';
import { cn } from '@/lib/utils';

const STATUS_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
] as const;

const PRIORITY_FILTERS = [
  { value: undefined, label: 'Any priority' },
  { value: 'high', label: '↑ High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: '↓ Low' },
] as const;

type StatusFilter = 'all' | 'active' | 'completed';
type PriorityFilter = 'high' | 'medium' | 'low' | undefined;

export default function TodosPage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [priority, setPriority] = useState<PriorityFilter>(undefined);
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout>>();

  const handleSearch = (value: string) => {
    setSearch(value);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1);
    }, 400);
  };

  const { data, isLoading, isFetching } = useTodos({
    search: debouncedSearch || undefined,
    status,
    priority,
    page,
    limit: 20,
  });

  const todos = data?.data ?? [];
  const pagination = data?.pagination;

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEditingTodo(null);
  };

  const handleFilterChange = (newStatus: StatusFilter, newPriority: PriorityFilter) => {
    setStatus(newStatus);
    setPriority(newPriority);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Todos</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {pagination
              ? `${pagination.total} item${pagination.total !== 1 ? 's' : ''}`
              : ''}
          </p>
        </div>
        <Button onClick={() => { setEditingTodo(null); setDialogOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          New todo
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search todos…"
            className="w-full h-9 pl-9 pr-8 rounded-md border bg-background text-sm outline-none focus:ring-2 focus:ring-ring transition-all"
          />
          {isFetching && !isLoading && (
            <Loader2 className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground animate-spin" />
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {STATUS_FILTERS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => handleFilterChange(value, priority)}
              className={cn(
                'h-9 px-3 rounded-md text-sm font-medium border transition-colors',
                status === value
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-muted-foreground border-border hover:bg-accent',
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {PRIORITY_FILTERS.map(({ value, label }) => (
            <button
              key={String(value)}
              onClick={() => handleFilterChange(status, value as PriorityFilter)}
              className={cn(
                'h-9 px-3 rounded-md text-sm font-medium border transition-colors',
                priority === value
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-muted-foreground border-border hover:bg-accent',
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : todos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <CheckSquare className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium">
            {debouncedSearch || status !== 'all' || priority
              ? 'No todos match your filters'
              : 'No todos yet'}
          </p>
          {!debouncedSearch && status === 'all' && !priority && (
            <Button variant="outline" size="sm" onClick={() => setDialogOpen(true)}>
              Create your first todo
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {todos.map((todo) => (
            <TodoCard key={todo.id} todo={todo} onEdit={handleEdit} />
          ))}
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!pagination.hasPrevPage}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            {pagination.page} / {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={!pagination.hasNextPage}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}

      <TodoDialog open={dialogOpen} onClose={handleClose} todo={editingTodo} />
    </div>
  );
}
