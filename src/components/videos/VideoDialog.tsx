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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateVideo, useUpdateVideo } from '@/hooks/useVideos';
import { applyServerErrors } from '@/lib/formErrors';
import type { Video, LearningStatus } from '@/types';

// ── Schema ─────────────────────────────────────────────────────────────────
const createSchema = z.object({
  url: z.url('Please enter a valid YouTube URL'),
  customTitle: z.string().max(255).optional(),
  notes: z.string().optional(),
  learningStatus: z.enum(['not_started', 'in_progress', 'completed']),
});

const editSchema = z.object({
  customTitle: z.string().max(255).optional(),
  notes: z.string().optional(),
  learningStatus: z.enum(['not_started', 'in_progress', 'completed']),
});

type CreateValues = z.infer<typeof createSchema>;
type EditValues = z.infer<typeof editSchema>;

const STATUS_OPTIONS: { value: LearningStatus; label: string }[] = [
  { value: 'not_started', label: 'Not Started' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

// ── Props ──────────────────────────────────────────────────────────────────
interface Props {
  open: boolean;
  onClose: () => void;
  video?: Video | null;
}

export default function VideoDialog({ open, onClose, video }: Props) {
  const isEdit = !!video;
  const createMutation = useCreateVideo();
  const updateMutation = useUpdateVideo();

  const createForm = useForm<CreateValues>({
    resolver: zodResolver(createSchema),
    defaultValues: { url: '', customTitle: '', notes: '', learningStatus: 'not_started' },
  });

  const editForm = useForm<EditValues>({
    resolver: zodResolver(editSchema),
    defaultValues: { customTitle: '', notes: '', learningStatus: 'not_started' },
  });

  const { setError: setCreateError } = createForm;
  const { setError: setEditError } = editForm;

  const activeForm = isEdit ? editForm : createForm;
  const { formState } = activeForm;

  useEffect(() => {
    if (!open) return;
    if (video) {
      editForm.reset({
        customTitle: video.customTitle ?? '',
        notes: video.notes ?? '',
        learningStatus: video.learningStatus,
      });
    } else {
      createForm.reset({ url: '', customTitle: '', notes: '', learningStatus: 'not_started' });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, video]);

  const onSubmitCreate = async (values: CreateValues) => {
    try {
      await createMutation.mutateAsync({
        url: values.url,
        customTitle: values.customTitle || undefined,
        notes: values.notes || undefined,
        learningStatus: values.learningStatus,
      });
      onClose();
    } catch (err) {
      applyServerErrors(err, setCreateError, 'url');
    }
  };

  const onSubmitEdit = async (values: EditValues) => {
    try {
      await updateMutation.mutateAsync({
        id: video!.id,
        data: {
          customTitle: values.customTitle || undefined,
          notes: values.notes || undefined,
          learningStatus: values.learningStatus,
        },
      });
      onClose();
    } catch (err) {
      applyServerErrors(err, setEditError);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit video' : 'Add YouTube video'}</DialogTitle>
        </DialogHeader>

        {/* Create form */}
        {!isEdit && (
          <form onSubmit={createForm.handleSubmit(onSubmitCreate)} className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <Label htmlFor="vid-url">YouTube URL</Label>
              <Input
                id="vid-url"
                type="url"
                placeholder="https://youtube.com/watch?v=..."
                {...createForm.register('url')}
              />
              {createForm.formState.errors.url && (
                <p className="text-xs text-destructive">
                  {createForm.formState.errors.url.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Title and thumbnail will be fetched automatically.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="vid-ct">
                Custom title{' '}
                <span className="font-normal text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="vid-ct"
                placeholder="Override the YouTube title"
                {...createForm.register('customTitle')}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="vid-status">Learning status</Label>
              <Select
                value={createForm.watch('learningStatus')}
                onValueChange={(v) => createForm.setValue('learningStatus', v as LearningStatus)}
              >
                <SelectTrigger id="vid-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="vid-notes">
                Notes{' '}
                <span className="font-normal text-muted-foreground">(optional)</span>
              </Label>
              <Textarea
                id="vid-notes"
                rows={3}
                placeholder="Key takeaways, timestamps, thoughts…"
                className="resize-none"
                {...createForm.register('notes')}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={formState.isSubmitting}>
                {formState.isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save video
              </Button>
            </DialogFooter>
          </form>
        )}

        {/* Edit form */}
        {isEdit && (
          <form onSubmit={editForm.handleSubmit(onSubmitEdit)} className="space-y-4 pt-1">
            <div className="rounded-lg bg-muted/50 px-3 py-2 text-sm">
              <p className="text-xs text-muted-foreground mb-0.5">YouTube title</p>
              <p className="font-medium line-clamp-2">{video!.title}</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="vid-edit-ct">
                Custom title{' '}
                <span className="font-normal text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="vid-edit-ct"
                placeholder="Override the YouTube title"
                {...editForm.register('customTitle')}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="vid-edit-status">Learning status</Label>
              <Select
                value={editForm.watch('learningStatus')}
                onValueChange={(v) => editForm.setValue('learningStatus', v as LearningStatus)}
              >
                <SelectTrigger id="vid-edit-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="vid-edit-notes">
                Notes{' '}
                <span className="font-normal text-muted-foreground">(optional)</span>
              </Label>
              <Textarea
                id="vid-edit-notes"
                rows={3}
                placeholder="Key takeaways, timestamps, thoughts…"
                className="resize-none"
                {...editForm.register('notes')}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={formState.isSubmitting}>
                {formState.isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save changes
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
