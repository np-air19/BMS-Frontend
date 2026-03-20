'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
const TipTapEditor = dynamic(() => import('@/components/notes/TipTapEditor'), {
  ssr: false,
  loading: () => <Skeleton className="h-80 w-full rounded-md" />,
});
import TagsInput from '@/components/notes/TagsInput';
import BookmarkSelector from '@/components/notes/BookmarkSelector';
import { useCreateNote } from '@/hooks/useNotes';

export default function NewNotePage() {
  const router = useRouter();
  const createMutation = useCreateNote();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [bookmarkId, setBookmarkId] = useState<string | undefined>();
  const [titleError, setTitleError] = useState('');

  const handleSubmit = async () => {
    if (!title.trim()) {
      setTitleError('Title is required');
      return;
    }
    setTitleError('');
    await createMutation.mutateAsync({
      title: title.trim(),
      content,
      tags: tags.length ? tags : undefined,
      bookmarkId,
    });
    router.push('/notes');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-xl font-bold tracking-tight">New note</h1>
      </div>

      {/* Title */}
      <div className="space-y-1.5">
        <Label htmlFor="note-title">Title</Label>
        <input
          id="note-title"
          value={title}
          onChange={(e) => { setTitle(e.target.value); setTitleError(''); }}
          placeholder="Note title…"
          className="w-full h-9 px-3 rounded-md border bg-background text-sm outline-none focus:ring-2 focus:ring-ring transition-all"
        />
        {titleError && <p className="text-xs text-destructive">{titleError}</p>}
      </div>

      {/* Editor */}
      <div className="space-y-1.5">
        <Label>Content</Label>
        <TipTapEditor
          content={content}
          onChange={setContent}
          placeholder="Write your note…"
        />
      </div>

      {/* Tags */}
      <div className="space-y-1.5">
        <Label>
          Tags{' '}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <TagsInput tags={tags} onChange={setTags} />
      </div>

      {/* Linked Bookmark */}
      <div className="space-y-1.5">
        <Label>
          Linked bookmark{' '}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <BookmarkSelector value={bookmarkId} onChange={setBookmarkId} />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={createMutation.isPending}>
          {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Save note
        </Button>
      </div>
    </div>
  );
}
