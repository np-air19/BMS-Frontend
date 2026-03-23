'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useCreateReminder, useUpdateReminder } from '@/hooks/useReminders';
import { useAuthStore } from '@/store/authStore';
import type { Reminder } from '@/types';

// ── Schema ─────────────────────────────────────────────────────────────────
const schema = z.object({
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  message: z.string().max(1000).optional(),
});

type FormValues = z.infer<typeof schema>;

function toLocalDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function toLocalTimeString(date: Date): string {
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${min}`;
}

interface Props {
  open: boolean;
  onClose: () => void;
  reminder?: Reminder | null;
  bookmarkId?: string;
}

export default function ReminderDialog({ open, onClose, reminder, bookmarkId }: Props) {
  const isEdit = !!reminder;
  const defaultTime = useAuthStore((s) => s.user?.preferences?.defaultReminderTime ?? '09:00');
  const createMutation = useCreateReminder();
  const updateMutation = useUpdateReminder();

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (!open) return;
    if (reminder) {
      const d = new Date(reminder.remindAt);
      reset({
        date: toLocalDateString(d),
        time: toLocalTimeString(d),
        message: reminder.message ?? '',
      });
    } else {
      reset({
        date: toLocalDateString(tomorrow),
        time: defaultTime,
        message: '',
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, reminder]);

  const onSubmit = async (values: FormValues) => {
    const remindAt = new Date(`${values.date}T${values.time}`).toISOString();

    if (isEdit) {
      await updateMutation.mutateAsync({
        id: reminder!.id,
        data: { remindAt, message: values.message || undefined },
      });
    } else {
      await createMutation.mutateAsync({
        remindAt,
        message: values.message || undefined,
        bookmarkId: bookmarkId ?? undefined,
      });
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit reminder' : 'Set reminder'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
          {/* Date + Time row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="rm-date">Date</Label>
              <input
                id="rm-date"
                type="date"
                className="w-full h-9 px-3 rounded-md border bg-background text-sm outline-none focus:ring-2 focus:ring-ring transition-all"
                {...register('date')}
              />
              {errors.date && (
                <p className="text-xs text-destructive">{errors.date.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="rm-time">Time</Label>
              <input
                id="rm-time"
                type="time"
                className="w-full h-9 px-3 rounded-md border bg-background text-sm outline-none focus:ring-2 focus:ring-ring transition-all"
                {...register('time')}
              />
              {errors.time && (
                <p className="text-xs text-destructive">{errors.time.message}</p>
              )}
            </div>
          </div>

          {/* Message */}
          <div className="space-y-1.5">
            <Label htmlFor="rm-msg">
              Message{' '}
              <span className="font-normal text-muted-foreground">(optional)</span>
            </Label>
            <textarea
              id="rm-msg"
              rows={3}
              placeholder="What should this remind you about?"
              className="w-full px-3 py-2 rounded-md border bg-background text-sm outline-none focus:ring-2 focus:ring-ring transition-all resize-none"
              {...register('message')}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isEdit ? 'Save changes' : 'Set reminder'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
