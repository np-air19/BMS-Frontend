export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    // Force light theme for auth pages — no class overrides needed, colors are hardcoded in page
    <div className="min-h-screen flex bg-white">
      {children}
    </div>
  );
}
