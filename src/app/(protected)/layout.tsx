// TODO: implement ProtectedLayout — Sidebar + nav shell for authenticated pages
// Connected to: components/layout/AppSidebar, Header, MobileBottomNav

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {/* TODO: AppSidebar + Header + MobileBottomNav shell */}
      <main>{children}</main>
    </div>
  );
}
