'use client';

import { useState } from 'react';
import { Plus, Sparkles, Tag, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import CategoryTreeComponent from '@/components/categories/CategoryTree';
import CategoryDialog from '@/components/categories/CategoryDialog';
import { useCategories, useSeedDefaults } from '@/hooks/useCategories';
import type { Category } from '@/types';

export default function CategoriesPage() {
  const { data: tree, isLoading } = useCategories();
  const seedDefaults = useSeedDefaults();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);

  const totalCount = tree
    ? tree.reduce((acc, c) => acc + 1 + c.children.length, 0)
    : 0;
  const isEmpty = !isLoading && totalCount === 0;

  const openCreate = () => { setEditing(null); setDialogOpen(true); };
  const openEdit = (cat: Category) => { setEditing(cat); setDialogOpen(true); };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Organize your bookmarks into a hierarchy
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {isEmpty && (
            <Button
              variant="outline"
              onClick={() => seedDefaults.mutate()}
              disabled={seedDefaults.isPending}
              className="gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Create defaults
            </Button>
          )}
          <Button onClick={openCreate} className="gap-2">
            <Plus className="w-4 h-4" />
            Add category
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="rounded-xl border bg-card">
        {/* Stats bar */}
        {!isLoading && tree && tree.length > 0 && (
          <div className="flex items-center gap-4 px-4 py-3 border-b text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <FolderOpen className="w-4 h-4" />
              <span>{tree.length} root {tree.length === 1 ? 'category' : 'categories'}</span>
            </div>
            {totalCount > tree.length && (
              <div className="flex items-center gap-1.5">
                <Tag className="w-4 h-4" />
                <span>{totalCount - tree.length} subcategories</span>
              </div>
            )}
          </div>
        )}

        <div className="p-3">
          {/* Loading */}
          {isLoading && (
            <div className="space-y-2 p-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2">
                  <Skeleton className="w-5 h-5 rounded-full" />
                  <Skeleton className="w-3 h-3 rounded-full" />
                  <Skeleton className="h-4" style={{ width: `${120 + i * 20}px` }} />
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {isEmpty && (
            <div className="flex flex-col items-center justify-center py-14 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                <FolderOpen className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-sm">No categories yet</p>
                <p className="text-muted-foreground text-sm mt-0.5">
                  Create your own or start with the 6 defaults
                </p>
              </div>
              <div className="flex gap-2 pt-1">
                <Button variant="outline" size="sm" onClick={() => seedDefaults.mutate()} disabled={seedDefaults.isPending} className="gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Create defaults
                </Button>
                <Button size="sm" onClick={openCreate} className="gap-1.5">
                  <Plus className="w-3.5 h-3.5" />
                  Add category
                </Button>
              </div>
            </div>
          )}

          {/* Tree */}
          {!isLoading && tree && tree.length > 0 && (
            <CategoryTreeComponent tree={tree} onEdit={openEdit} />
          )}
        </div>
      </div>

      {/* Dialog */}
      <CategoryDialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); setEditing(null); }}
        editing={editing}
        roots={tree ?? []}
      />
    </div>
  );
}
