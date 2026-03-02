"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Film,
  Tv2,
  Download,
  Users,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/supabase";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/movies", label: "Movies", icon: Film },
  { href: "/series", label: "Series", icon: Tv2 },
  { href: "/downloads", label: "Downloads", icon: Download },
];

interface SidebarProps {
  profile: Profile;
}

export default function Sidebar({ profile }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-56 bg-background border-r border-border-muted flex flex-col z-30">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border-muted">
        <span className="text-lg font-bold text-text-primary tracking-tight font-mono">
          arrgateway
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "text-text-primary bg-surface border-l-2 border-accent-lime pl-[10px]"
                  : "text-text-muted hover:text-text-primary hover:bg-surface"
              )}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}

        {profile.is_admin && (
          <>
            <div className="pt-4 pb-1 px-3">
              <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
                Admin
              </span>
            </div>
            <Link
              href="/admin/users"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                pathname.startsWith("/admin")
                  ? "text-text-primary bg-surface border-l-2 border-accent-lime pl-[10px]"
                  : "text-text-muted hover:text-text-primary hover:bg-surface"
              )}
            >
              <Users size={16} />
              Users
            </Link>
          </>
        )}
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t border-border-muted">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-accent-purple/20 border border-accent-purple/30 flex items-center justify-center text-accent-purple text-xs font-bold uppercase">
            {profile.display_name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">
              {profile.display_name}
            </p>
            <p className="text-xs text-text-muted truncate">{profile.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-xs text-text-muted hover:text-red-400 transition-colors w-full"
        >
          <LogOut size={13} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
