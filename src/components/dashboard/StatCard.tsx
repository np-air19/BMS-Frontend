'use client';

import { type LucideIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface StatCardProps {
  label: string;
  value: number | undefined;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  subtitle?: string;
  isLoading: boolean;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  iconColor,
  iconBg,
  subtitle,
  isLoading,
}: StatCardProps) {
  return (
    <div className="rounded-xl border bg-card p-5 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground font-medium">{label}</span>
        <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
      </div>

      {isLoading ? (
        <>
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-24" />
        </>
      ) : (
        <>
          <p className="text-3xl font-bold tracking-tight">{value ?? 0}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </>
      )}
    </div>
  );
}
