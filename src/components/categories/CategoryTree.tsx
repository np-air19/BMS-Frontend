'use client';

import { useState } from 'react';
import { ChevronRight, Pencil, Trash2, FolderOpen, Folder } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useDeleteCategory } from '@/hooks/useCategories';
import type { CategoryTree as CategoryTreeType } from '@/api/categories';
import type { Category } from '@/types';

interface NodeProps {
  node: CategoryTreeType;
  depth: number;
  onEdit: (category: Category) => void;
}

function CategoryNode({ node, depth, onEdit }: NodeProps) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children.length > 0;
  const deleteCategory = useDeleteCategory();

  return (
    <div>
      <div
        className={cn(
          'group flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-muted/60 transition-colors',
          depth > 0 && 'ml-6',
        )}
      >
        {/* Expand toggle */}
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className={cn(
            'w-5 h-5 flex items-center justify-center rounded text-muted-foreground transition-all shrink-0',
            !hasChildren && 'opacity-0 pointer-events-none',
          )}
        >
          <ChevronRight
            className={cn('w-3.5 h-3.5 transition-transform', expanded && 'rotate-90')}
          />
        </button>

        {/* Color dot + icon */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div
            className="w-3 h-3 rounded-full shrink-0 ring-2 ring-white ring-offset-1"
            style={{ backgroundColor: node.color }}
          />
          {hasChildren ? (
            <FolderOpen className="w-4 h-4 text-muted-foreground shrink-0" />
          ) : (
            <Folder className="w-4 h-4 text-muted-foreground shrink-0" />
          )}
          <span className="text-sm font-medium text-foreground truncate">{node.name}</span>
          {node.isDefault && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground font-medium shrink-0">
              default
            </span>
          )}
          {hasChildren && (
            <span className="text-xs text-muted-foreground shrink-0">
              {node.children.length}
            </span>
          )}
        </div>

        {/* Actions — shown on hover */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onEdit(node)}
          >
            <Pencil className="w-3.5 h-3.5" />
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete &ldquo;{node.name}&rdquo;?</AlertDialogTitle>
                <AlertDialogDescription>
                  {hasChildren
                    ? `This will also delete ${node.children.length} subcategorie${node.children.length > 1 ? 's' : ''} and remove all category assignments from bookmarks.`
                    : 'This will remove all category assignments from bookmarks.'}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteCategory.mutate(node.id)}
                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Children */}
      {hasChildren && expanded && (
        <div className="border-l border-border ml-[1.875rem]">
          {node.children.map((child) => (
            <CategoryNode key={child.id} node={child} depth={depth + 1} onEdit={onEdit} />
          ))}
        </div>
      )}
    </div>
  );
}

interface Props {
  tree: CategoryTreeType[];
  onEdit: (category: Category) => void;
}

export default function CategoryTree({ tree, onEdit }: Props) {
  if (tree.length === 0) return null;

  return (
    <div className="space-y-0.5">
      {tree.map((node) => (
        <CategoryNode key={node.id} node={node} depth={0} onEdit={onEdit} />
      ))}
    </div>
  );
}
