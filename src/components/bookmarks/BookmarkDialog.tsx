'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Check, ChevronsUpDown, Loader2, Bell } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useCategories } from '@/hooks/useCategories';
import { useCreateBookmark, useUpdateBookmark } from '@/hooks/useBookmarks';
import { useCreateReminder } from '@/hooks/useReminders';
import { type CategoryTree } from '@/api/categories';
import type { Bookmark } from '@/types';
import { cn } from '@/lib/utils';

function defaultDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

function flattenTree(nodes: CategoryTree[], depth = 0): Array<CategoryTree & { depth: number }> {
  return nodes.flatMap((node) => [
    { ...node, depth },
    ...flattenTree(node.children ?? [], depth + 1),
  ]);
}

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  url: z.string().url('Please enter a valid URL'),
  purpose: z.string().max(500).optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  bookmark?: Bookmark | null;
}

export default function BookmarkDialog({ open, onClose, bookmark }: Props) {
  const isEdit = !!bookmark;
  const createMutation = useCreateBookmark();
  const updateMutation = useUpdateBookmark();
  const { data: catTree = [] } = useCategories();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [catOpen, setCatOpen] = useState(false);

  const [setReminder, setSetReminder] = useState(false);
  const [reminderDate, setReminderDate] = useState(defaultDate());
  const [reminderTime, setReminderTime] = useState('09:00');
  const [reminderMessage, setReminderMessage] = useState('');
  const createReminderMutation = useCreateReminder();

  const flatCats = flattenTree(catTree as CategoryTree[]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (!open) return;
    if (bookmark) {
      reset({ title: bookmark.title, url: bookmark.url, purpose: bookmark.purpose ?? '' });
      setSelectedIds(bookmark.categories?.map((c) => c.id) ?? []);
    } else {
      reset({ title: '', url: '', purpose: '' });
      setSelectedIds([]);
      setSetReminder(false);
      setReminderDate(defaultDate());
      setReminderTime('09:00');
      setReminderMessage('');
    }
  }, [open, bookmark, reset]);

  const toggle = (id: string) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const selectedLabels = flatCats
    .filter((c) => selectedIds.includes(c.id))
    .map((c) => c.name);

  const onSubmit = async (values: FormValues) => {
    const payload = {
      title: values.title,
      url: values.url,
      purpose: values.purpose || undefined,
      categoryIds: selectedIds,
    };

    if (isEdit) {
      await updateMutation.mutateAsync({ id: bookmark!.id, data: payload });
    } else {
      const res = await createMutation.mutateAsync(payload);
      if (setReminder && reminderDate && reminderTime) {
        await createReminderMutation.mutateAsync({
          remindAt: new Date(`${reminderDate}T${reminderTime}`).toISOString(),
          message: reminderMessage || undefined,
          bookmarkId: res.data.data.id,
        });
      }
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit bookmark' : 'Add bookmark'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="bm-title">Title</Label>
            <input
              id="bm-title"
              placeholder="My awesome resource"
              className="w-full h-9 px-3 rounded-md border bg-background text-sm outline-none focus:ring-2 focus:ring-ring transition-all"
              {...register('title')}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* URL */}
          <div className="space-y-1.5">
            <Label htmlFor="bm-url">URL</Label>
            <input
              id="bm-url"
              type="url"
              placeholder="https://example.com"
              className="w-full h-9 px-3 rounded-md border bg-background text-sm outline-none focus:ring-2 focus:ring-ring transition-all"
              {...register('url')}
            />
            {errors.url && (
              <p className="text-xs text-destructive">{errors.url.message}</p>
            )}
          </div>

          {/* Purpose */}
          <div className="space-y-1.5">
            <Label htmlFor="bm-purpose">
              Purpose{' '}
              <span className="font-normal text-muted-foreground">(optional)</span>
            </Label>
            <textarea
              id="bm-purpose"
              rows={2}
              placeholder="Why are you saving this?"
              className="w-full px-3 py-2 rounded-md border bg-background text-sm outline-none focus:ring-2 focus:ring-ring transition-all resize-none"
              {...register('purpose')}
            />
          </div>

          {/* Categories */}
          <div className="space-y-1.5">
            <Label>
              Categories{' '}
              <span className="font-normal text-muted-foreground">(optional)</span>
            </Label>
            <Popover open={catOpen} onOpenChange={setCatOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="w-full h-9 px-3 rounded-md border bg-background text-sm text-left flex items-center justify-between gap-2 outline-none focus:ring-2 focus:ring-ring transition-all"
                >
                  <span className="truncate text-muted-foreground">
                    {selectedLabels.length > 0
                      ? selectedLabels.join(', ')
                      : 'Select categories…'}
                  </span>
                  <ChevronsUpDown className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-[320px] p-1 max-h-52 overflow-y-auto">
                {flatCats.length === 0 ? (
                  <p className="text-xs text-muted-foreground px-2 py-1.5">No categories yet</p>
                ) : (
                  flatCats.map((cat) => {
                    const selected = selectedIds.includes(cat.id);
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => toggle(cat.id)}
                        className="w-full flex items-center gap-2 py-1.5 rounded text-sm hover:bg-accent text-left"
                        style={{ paddingLeft: `${8 + cat.depth * 16}px`, paddingRight: '8px' }}
                      >
                        <div
                          className={cn(
                            'w-4 h-4 rounded border flex items-center justify-center shrink-0',
                            selected ? 'bg-primary border-primary' : 'border-input',
                          )}
                        >
                          {selected && <Check className="w-3 h-3 text-primary-foreground" />}
                        </div>
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: cat.color }}
                        />
                        {cat.name}
                      </button>
                    );
                  })
                )}
              </PopoverContent>
            </Popover>

            {selectedLabels.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-0.5">
                {flatCats
                  .filter((c) => selectedIds.includes(c.id))
                  .map((c) => (
                    <Badge
                      key={c.id}
                      variant="secondary"
                      className="text-xs cursor-pointer gap-1"
                      onClick={() => toggle(c.id)}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: c.color }}
                      />
                      {c.name} ×
                    </Badge>
                  ))}
              </div>
            )}
          </div>

          {!isEdit && (
            <div className="space-y-3 pt-1">
              <div className="h-px bg-border" />

              <button
                type="button"
                onClick={() => setSetReminder((v) => !v)}
                className="flex items-center gap-2.5 w-full text-left"
              >
                <div
                  className={cn(
                    'w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors',
                    setReminder ? 'bg-primary border-primary' : 'border-input',
                  )}
                >
                  {setReminder && <Check className="w-3 h-3 text-primary-foreground" />}
                </div>
                <Bell className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-sm font-medium">Set reminder</span>
              </button>

              {setReminder && (
                <div className="space-y-3 pl-6">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="bm-rm-date">Reminder Date</Label>
                      <input
                        id="bm-rm-date"
                        type="date"
                        value={reminderDate}
                        onChange={(e) => setReminderDate(e.target.value)}
                        className="w-full h-9 px-3 rounded-md border bg-background text-sm outline-none focus:ring-2 focus:ring-ring transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="bm-rm-time">Time</Label>
                      <input
                        id="bm-rm-time"
                        type="time"
                        value={reminderTime}
                        onChange={(e) => setReminderTime(e.target.value)}
                        className="w-full h-9 px-3 rounded-md border bg-background text-sm outline-none focus:ring-2 focus:ring-ring transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="bm-rm-msg">
                      Reminder Message{' '}
                      <span className="font-normal text-muted-foreground">(optional)</span>
                    </Label>
                    <textarea
                      id="bm-rm-msg"
                      rows={2}
                      placeholder="Custom reminder message…"
                      value={reminderMessage}
                      onChange={(e) => setReminderMessage(e.target.value)}
                      className="w-full px-3 py-2 rounded-md border bg-background text-sm outline-none focus:ring-2 focus:ring-ring transition-all resize-none"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isEdit ? 'Save changes' : 'Add bookmark'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
