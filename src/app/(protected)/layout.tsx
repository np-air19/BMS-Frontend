'use client';

import { useUiStore } from '@/store/uiStore';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import AppSidebar from '@/components/layout/AppSidebar';
import Header from '@/components/layout/Header';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import { Loader2 } from 'lucide-react';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuth();
  const { user } = useAuthStore();

  if (isLoading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <>{children}</>;
}

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { sidebarOpen } = useUiStore();

  return (
    <AuthGuard>
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
    </AuthGuard>
  );
}
