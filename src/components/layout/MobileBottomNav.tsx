'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Bookmark,
  PlayCircle,
  FileText,
  MoreHorizontal,
  CheckSquare,
  Image,
  Bell,
  Tag,
  Settings,
  LogOut,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/api/auth';

const BOTTOM_TABS = [
  { label: 'Home', href: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: 'Bookmarks', href: ROUTES.BOOKMARKS, icon: Bookmark },
  { label: 'Videos', href: ROUTES.VIDEOS, icon: PlayCircle },
  { label: 'Notes', href: ROUTES.NOTES, icon: FileText },
];

const MORE_ITEMS = [
  { label: 'Todos', href: ROUTES.TODOS, icon: CheckSquare },
  { label: 'Screenshots', href: ROUTES.SCREENSHOTS, icon: Image },
  { label: 'Reminders', href: ROUTES.REMINDERS, icon: Bell },
  { label: 'Categories', href: ROUTES.CATEGORIES, icon: Tag },
  { label: 'Settings', href: ROUTES.SETTINGS, icon: Settings },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();
  const [moreOpen, setMoreOpen] = useState(false);

  const isMoreActive = MORE_ITEMS.some((item) => pathname === item.href);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore
    } finally {
      logout();
      router.push('/signin');
    }
  };

  return (
    <>
      {/* Bottom Nav Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 border-t bg-background flex items-center">
        {BOTTOM_TABS.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center justify-center gap-1 h-full transition-colors"
            >
              <Icon
                className={cn(
                  'w-5 h-5 transition-colors',
                  isActive ? 'text-primary' : 'text-muted-foreground',
                )}
              />
              <span
                className={cn(
                  'text-[10px] font-medium',
                  isActive ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}

        {/* More button */}
        <button
          onClick={() => setMoreOpen(true)}
          className="flex-1 flex flex-col items-center justify-center gap-1 h-full transition-colors"
        >
          <MoreHorizontal
            className={cn(
              'w-5 h-5 transition-colors',
              isMoreActive ? 'text-primary' : 'text-muted-foreground',
            )}
          />
          <span
            className={cn(
              'text-[10px] font-medium',
              isMoreActive ? 'text-primary' : 'text-muted-foreground',
            )}
          >
            More
          </span>
        </button>
      </nav>

      {/* More Sheet Overlay */}
      {moreOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 z-50 bg-black/50"
            onClick={() => setMoreOpen(false)}
          />

          {/* Sheet sliding up from bottom */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl bg-background border-t pb-safe">
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3">
              <span className="font-semibold text-base">More</span>
              <button
                onClick={() => setMoreOpen(false)}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Items */}
            <div className="px-4 pb-6 space-y-1">
              {MORE_ITEMS.map(({ label, href, icon: Icon }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMoreOpen(false)}
                    className={cn(
                      'flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground hover:bg-muted',
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {label}
                  </Link>
                );
              })}

              <div className="h-px bg-border my-2" />

              <button
                onClick={handleLogout}
                className="flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium w-full text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Sign out
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
