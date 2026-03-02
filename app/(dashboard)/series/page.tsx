import { createClient } from "@/lib/supabase/server";
import { getSeries } from "@/lib/api/sonarr";
import { hasPermission } from "@/lib/permissions";
import SeriesGrid from "@/components/series/SeriesGrid";
import Topbar from "@/components/layout/Topbar";

export default async function SeriesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  if (!profile || !hasPermission(profile, "view_series")) {
    return (
      <>
        <Topbar title="Series" />
        <div className="p-6 text-text-muted text-sm">
          You don&apos;t have permission to view series.
        </div>
      </>
    );
  }

  const series = await getSeries().catch(() => []);

  const sorted = [...series].sort((a, b) => {
    const aComplete = a.statistics.percentOfEpisodes === 100;
    const bComplete = b.statistics.percentOfEpisodes === 100;
    if (aComplete !== bComplete) return aComplete ? -1 : 1;
    return a.title.localeCompare(b.title);
  });

  return (
    <>
      <Topbar
        title="Series"
        actions={
          <span className="text-xs text-text-muted">{series.length} titles</span>
        }
      />
      <div className="p-6">
        <SeriesGrid series={sorted} />
      </div>
    </>
  );
}
