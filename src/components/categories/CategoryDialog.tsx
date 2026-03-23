'use client';

import { useEffect, useState } from 'react';
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
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateCategory, useUpdateCategory } from '@/hooks/useCategories';
import { applyServerErrors } from '@/lib/formErrors';
import type { CategoryTree } from '@/api/categories';
import type { Category } from '@/types';

const PRESET_COLORS = [
  '#3B82F6', '#22C55E', '#EAB308', '#EC4899',
  '#A855F7', '#06B6D4', '#F97316', '#EF4444',
  '#6366F1', '#14B8A6', '#8B5CF6', '#84CC16',
];

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  color: z.string().regex(/^#[A-Fa-f0-9]{6}$/, 'Invalid hex color'),
  parentId: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  editing?: Category | null;
  roots: CategoryTree[];
}

export default function CategoryDialog({ open, onClose, editing, roots }: Props) {
  const [customColor, setCustomColor] = useState('');
  const create = useCreateCategory();
  const update = useUpdateCategory();
  const isLoading = create.isPending || update.isPending;

  const { register, handleSubmit, setValue, watch, reset, setError, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', color: '#3B82F6', parentId: undefined },
  });

  const selectedColor = watch('color');

  // Populate form when editing
  useEffect(() => {
    if (editing) {
      reset({
        name: editing.name,
        color: editing.color,
        parentId: editing.parentId ?? undefined,
      });
      setCustomColor(editing.color);
    } else {
      reset({ name: '', color: '#3B82F6', parentId: undefined });
      setCustomColor('#3B82F6');
    }
  }, [editing, open, reset]);

  const onSubmit = async (values: FormValues) => {
    const payload = {
      name: values.name,
      color: values.color,
      parentId: values.parentId === 'none' ? undefined : values.parentId,
    };
    try {
      if (editing) {
        await update.mutateAsync({
          id: editing.id,
          data: { ...payload, parentId: payload.parentId ?? null },
        });
      } else {
        await create.mutateAsync(payload);
      }
      onClose();
    } catch (err) {
      applyServerErrors(err, setError);
    }
  };

  // Flat list of root categories for parent selector (exclude self when editing)
  const parentOptions = roots.filter((c) => c.id !== editing?.id);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editing ? 'Edit Category' : 'New Category'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-1">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="e.g. Work, Learning..."
              autoFocus
              {...register('name')}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          {/* Color */}
          <div className="space-y-2">
            <Label>Color</Label>

            {/* Preset swatches */}
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => { setValue('color', c); setCustomColor(c); }}
                  className="w-7 h-7 rounded-full border-2 transition-all"
                  style={{
                    backgroundColor: c,
                    borderColor: selectedColor === c ? '#0f172a' : 'transparent',
                    transform: selectedColor === c ? 'scale(1.15)' : 'scale(1)',
                  }}
                  title={c}
                />
              ))}
            </div>

            {/* Custom hex input */}
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-md border border-border shrink-0"
                style={{ backgroundColor: selectedColor }}
              />
              <Input
                placeholder="#3B82F6"
                value={customColor}
                onChange={(e) => {
                  const val = e.target.value;
                  setCustomColor(val);
                  if (/^#[A-Fa-f0-9]{6}$/.test(val)) setValue('color', val);
                }}
                className="font-mono text-sm"
                maxLength={7}
              />
            </div>
            {errors.color && <p className="text-xs text-destructive">{errors.color.message}</p>}
          </div>

          {/* Parent category */}
          <div className="space-y-1.5">
            <Label>Parent Category <span className="text-muted-foreground text-xs">(optional)</span></Label>
            <Select
              defaultValue={editing?.parentId ?? 'none'}
              onValueChange={(v) => setValue('parentId', v === 'none' ? undefined : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="None (root category)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None (root category)</SelectItem>
                {parentOptions.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                        style={{ backgroundColor: cat.color }}
                      />
                      {cat.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editing ? 'Save changes' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
