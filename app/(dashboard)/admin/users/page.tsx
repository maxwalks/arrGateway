import Link from "next/link";
import { UserPlus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Profile } from "@/types/supabase";
import Topbar from "@/components/layout/Topbar";
import Button from "@/components/ui/Button";
import UserTable from "@/components/admin/UserTable";

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const admin = createAdminClient();
  const { data: profiles } = await admin
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: true }) as { data: Profile[] | null; error: unknown };

  return (
    <>
      <Topbar
        title="Users"
        actions={
          <Link href="/admin/invite">
            <Button variant="primary" className="gap-1.5">
              <UserPlus size={14} />
              Add user
            </Button>
          </Link>
        }
      />
      <div className="p-6 max-w-4xl">
        <UserTable users={profiles ?? []} currentUserId={user.id} />
      </div>
    </>
  );
}
