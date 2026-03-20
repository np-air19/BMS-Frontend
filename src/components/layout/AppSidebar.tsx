'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Bookmark,
  PlayCircle,
  FileText,
  CheckSquare,
  Image,
  Bell,
  Tag,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';
import { useUiStore } from '@/store/uiStore';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const NAV_ITEMS = [
  { label: 'Dashboard', href: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: 'Bookmarks', href: ROUTES.BOOKMARKS, icon: Bookmark },
  { label: 'Videos', href: ROUTES.VIDEOS, icon: PlayCircle },
  { label: 'Notes', href: ROUTES.NOTES, icon: FileText },
  { label: 'Todos', href: ROUTES.TODOS, icon: CheckSquare },
  { label: 'Screenshots', href: ROUTES.SCREENSHOTS, icon: Image },
  { label: 'Reminders', href: ROUTES.REMINDERS, icon: Bell },
  { label: 'Categories', href: ROUTES.CATEGORIES, icon: Tag },
];

function NavLink({
  href,
  icon: Icon,
  label,
  collapsed,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  collapsed: boolean;
}) {
  const pathname = usePathname();
  const isActive = href === '/dashboard' ? pathname === href : pathname.startsWith(href);

  const link = (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 rounded-md py-2 text-sm font-medium transition-colors',
        collapsed ? 'justify-center px-2' : 'px-3',
        isActive
          ? 'bg-sidebar-primary text-sidebar-primary-foreground'
          : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
      )}
    >
      <Icon className="w-4 h-4 shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    );
  }

  return link;
}

export default function AppSidebar() {
  const { sidebarOpen, toggleSidebar } = useUiStore();
  const collapsed = !sidebarOpen;

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'hidden md:flex flex-col fixed left-0 top-0 h-screen z-40',
          'border-r bg-sidebar border-sidebar-border transition-all duration-300 ease-in-out',
          collapsed ? 'w-16' : 'w-60',
        )}
      >
        {/* Logo */}
        <div
          className={cn(
            'flex items-center h-16 border-b border-sidebar-border px-4 shrink-0',
            collapsed ? 'justify-center' : 'gap-3',
          )}
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground font-bold text-sm shrink-0">
            B
          </div>
          {!collapsed && (
            <span className="font-semibold text-sidebar-foreground tracking-tight">BMS</span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.href} {...item} collapsed={collapsed} />
          ))}
        </nav>

        {/* Bottom: Settings + Toggle */}
        <div className="border-t border-sidebar-border p-2 space-y-0.5">
          <NavLink
            href={ROUTES.SETTINGS}
            icon={Settings}
            label="Settings"
            collapsed={collapsed}
          />

          <button
            onClick={toggleSidebar}
            className={cn(
              'flex items-center gap-3 rounded-md py-2 text-sm font-medium w-full transition-colors',
              'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
              collapsed ? 'justify-center px-2' : 'px-3',
            )}
          >
            {collapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <PanelLeftOpen className="w-4 h-4" />
                </TooltipTrigger>
                <TooltipContent side="right">Expand sidebar</TooltipContent>
              </Tooltip>
            ) : (
              <>
                <PanelLeftClose className="w-4 h-4 shrink-0" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </TooltipProvider>
  );
}
