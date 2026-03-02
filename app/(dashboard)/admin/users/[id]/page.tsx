import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Profile } from "@/types/supabase";
import Topbar from "@/components/layout/Topbar";
import UserPermissionsForm from "@/components/admin/UserPermissionsForm";

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const admin = createAdminClient();

  const { data: profile } = await admin
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single() as { data: Profile | null; error: unknown };

  if (!profile) notFound();

  return (
    <>
      <Topbar
        title={`Edit — ${profile.display_name}`}
        actions={
          <Link
            href="/admin/users"
            className="flex items-center gap-1 text-sm text-text-muted hover:text-text-primary transition-colors"
          >
            <ChevronLeft size={16} />
            Back
          </Link>
        }
      />
      <div className="p-6">
        <UserPermissionsForm user={profile} />
      </div>
    </>
  );
}
