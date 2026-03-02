import { createClient } from "@/lib/supabase/server";
import { hasPermission } from "@/lib/permissions";
import Topbar from "@/components/layout/Topbar";
import DownloadList from "@/components/downloads/DownloadList";

export default async function DownloadsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  if (!profile || !hasPermission(profile, "view_downloads")) {
    return (
      <>
        <Topbar title="Downloads" />
        <div className="p-6 text-text-muted text-sm">
          You don&apos;t have permission to view downloads.
        </div>
      </>
    );
  }

  return (
    <>
      <Topbar title="Downloads" />
      <div className="p-6">
        <DownloadList />
      </div>
    </>
  );
}
