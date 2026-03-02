import { createClient } from "@/lib/supabase/server";
import { getMovies } from "@/lib/api/radarr";
import { hasPermission } from "@/lib/permissions";
import MovieGrid from "@/components/movies/MovieGrid";
import Topbar from "@/components/layout/Topbar";

export default async function MoviesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  if (!profile || !hasPermission(profile, "view_movies")) {
    return (
      <>
        <Topbar title="Movies" />
        <div className="p-6 text-text-muted text-sm">
          You don&apos;t have permission to view movies.
        </div>
      </>
    );
  }

  const movies = await getMovies().catch(() => []);

  const sorted = [...movies].sort((a, b) => {
    if (a.hasFile !== b.hasFile) return a.hasFile ? -1 : 1;
    return a.title.localeCompare(b.title);
  });

  return (
    <>
      <Topbar
        title="Movies"
        actions={
          <span className="text-xs text-text-muted">{movies.length} titles</span>
        }
      />
      <div className="p-6">
        <MovieGrid movies={sorted} />
      </div>
    </>
  );
}
