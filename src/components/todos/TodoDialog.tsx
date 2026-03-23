'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useCreateTodo, useUpdateTodo } from '@/hooks/useTodos';
import { cn } from '@/lib/utils';
import type { Todo } from '@/types';

interface Props {
  open: boolean;
  onClose: () => void;
  todo?: Todo | null;
}

const PRIORITIES = [
  { value: 'high', label: 'High', cls: 'border-red-300 text-red-700 bg-red-50', active: 'border-red-500 bg-red-500 text-white' },
  { value: 'medium', label: 'Medium', cls: 'border-amber-300 text-amber-700 bg-amber-50', active: 'border-amber-500 bg-amber-500 text-white' },
  { value: 'low', label: 'Low', cls: 'border-emerald-300 text-emerald-700 bg-emerald-50', active: 'border-emerald-500 bg-emerald-500 text-white' },
] as const;

export default function TodoDialog({ open, onClose, todo }: Props) {
  const isEdit = !!todo;
  const createMutation = useCreateTodo();
  const updateMutation = useUpdateTodo();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [dueDate, setDueDate] = useState('');
  const [titleError, setTitleError] = useState('');

  useEffect(() => {
    if (!open) return;
    if (todo) {
      setTitle(todo.title);
      setDescription(todo.description ?? '');
      setPriority(todo.priority);
      setDueDate(todo.dueDate ? new Date(todo.dueDate).toISOString().slice(0, 10) : '');
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
    }
    setTitleError('');
  }, [open, todo]);

  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async () => {
    if (!title.trim()) {
      setTitleError('Title is required');
      return;
    }
    setTitleError('');

    const payload = {
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      dueDate: dueDate || undefined,
    };

    if (isEdit) {
      await updateMutation.mutateAsync({ id: todo!.id, data: { ...payload, dueDate: dueDate || null } });
    } else {
      await createMutation.mutateAsync(payload);
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit todo' : 'New todo'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="todo-title">Title</Label>
            <Input
              id="todo-title"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setTitleError(''); }}
              placeholder="What needs to be done?"
            />
            {titleError && <p className="text-xs text-destructive">{titleError}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="todo-desc">
              Description <span className="font-normal text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="todo-desc"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more detail…"
              className="resize-none"
            />
          </div>

          {/* Priority */}
          <div className="space-y-1.5">
            <Label>Priority</Label>
            <div className="flex gap-2">
              {PRIORITIES.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPriority(p.value)}
                  className={cn(
                    'flex-1 h-8 rounded-md border text-xs font-semibold transition-colors',
                    priority === p.value ? p.active : p.cls,
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Due date */}
          <div className="space-y-1.5">
            <Label htmlFor="todo-due">
              Due date <span className="font-normal text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="todo-due"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isEdit ? 'Save changes' : 'Create todo'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
