'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import dynamic from 'next/dynamic';
const TipTapEditor = dynamic(() => import('@/components/notes/TipTapEditor'), { ssr: false });
import TagsInput from '@/components/notes/TagsInput';
import BookmarkSelector from '@/components/notes/BookmarkSelector';
import { useNote, useUpdateNote } from '@/hooks/useNotes';

export default function EditNotePage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { data: note, isLoading } = useNote(id);
  const updateMutation = useUpdateNote();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [bookmarkId, setBookmarkId] = useState<string | undefined>();
  const [titleError, setTitleError] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (note && !ready) {
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags ?? []);
      setBookmarkId(note.bookmarkId ?? undefined);
      setReady(true);
    }
  }, [note, ready]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      setTitleError('Title is required');
      return;
    }
    setTitleError('');
    await updateMutation.mutateAsync({
      id,
      data: {
        title: title.trim(),
        content,
        tags: tags.length ? tags : [],
        bookmarkId: bookmarkId ?? null,
      },
    });
    router.push('/notes');
  };

  if (isLoading || !ready) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-80 w-full rounded-xl" />
        <Skeleton className="h-9 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-xl font-bold tracking-tight">Edit note</h1>
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
        <Button onClick={handleSubmit} disabled={updateMutation.isPending}>
          {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Save changes
        </Button>
      </div>
    </div>
  );
}
