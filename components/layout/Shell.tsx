import Sidebar from "./Sidebar";
import type { Profile } from "@/types/supabase";

interface ShellProps {
  profile: Profile;
  children: React.ReactNode;
}

export default function Shell({ profile, children }: ShellProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar profile={profile} />
      <main className="flex-1 ml-56 min-h-screen overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
