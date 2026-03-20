'use client';

import { useUiStore } from '@/store/uiStore';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import AppSidebar from '@/components/layout/AppSidebar';
import Header from '@/components/layout/Header';
import MobileBottomNav from '@/components/layout/MobileBottomNav';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  useAuth(); // bootstraps user from /auth/me on every protected page load
  const { sidebarOpen } = useUiStore();

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <AppSidebar />

      {/* Main content area — shifts with sidebar */}
      <div
        className={cn(
          'flex flex-col min-h-screen transition-all duration-300 ease-in-out',
          'md:ml-16',
          sidebarOpen && 'md:ml-60',
        )}
      >
        <Header />

        <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileBottomNav />
    </div>
  );
}
