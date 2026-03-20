import { Bookmark, Bell, CheckSquare, FileText } from 'lucide-react';

const STAT_CARDS = [
  { label: 'Total Bookmarks', icon: Bookmark, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { label: 'Pending Reminders', icon: Bell, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Active Todos', icon: CheckSquare, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Total Notes', icon: FileText, color: 'text-violet-600', bg: 'bg-violet-50' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-6xl">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-0.5 text-sm">
          Your personal knowledge hub at a glance.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map(({ label, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="rounded-xl border bg-card p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground font-medium">{label}</span>
              <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
            </div>
            {/* Skeleton number */}
            <div className="h-8 w-16 rounded-md bg-muted animate-pulse" />
            <div className="h-3 w-24 rounded bg-muted animate-pulse" />
          </div>
        ))}
      </div>

      {/* Two-column lower section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Recent Activity */}
        <div className="lg:col-span-2 rounded-xl border bg-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-sm">Recent Activity</h2>
            <div className="h-4 w-14 rounded bg-muted animate-pulse" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted animate-pulse shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 rounded bg-muted animate-pulse" style={{ width: `${55 + i * 8}%` }} />
                  <div className="h-2.5 w-20 rounded bg-muted animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border bg-card p-5 space-y-4">
          <h2 className="font-semibold text-sm">Quick Actions</h2>
          <div className="space-y-2">
            {['Add Bookmark', 'Add YouTube Video', 'Create Note', 'Add Todo'].map((action) => (
              <button
                key={action}
                disabled
                className="w-full text-left px-3 py-2.5 rounded-lg border border-dashed text-sm text-muted-foreground hover:bg-muted transition-colors cursor-not-allowed opacity-60"
              >
                + {action}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">Available in Phase 3</p>
        </div>
      </div>
    </div>
  );
}
