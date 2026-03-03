import { Film } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-8 py-6">
        <div className="flex items-center gap-2">
          <Film size={16} className="text-text-primary" />
          <span className="text-text-primary font-semibold text-sm tracking-tight">
            arrgateway
          </span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        {children}
      </main>

      <footer className="px-8 py-6 text-center">
        <p className="text-xs text-text-muted">© 2026 arrgateway</p>
      </footer>
    </div>
  );
}
