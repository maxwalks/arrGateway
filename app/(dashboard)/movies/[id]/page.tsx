import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMovie } from "@/lib/api/radarr";
import { hasPermission } from "@/lib/permissions";
import MovieDetail from "@/components/movies/MovieDetail";
import Topbar from "@/components/layout/Topbar";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function MoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [movie, { data: { user } }] = await Promise.all([
    getMovie(Number(id)).catch(() => null),
    supabase.auth.getUser(),
  ]);

  if (!movie || !user) notFound();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const canDelete = profile ? hasPermission(profile, "delete_movies") : false;

  return (
    <>
      <Topbar
        title={movie.title}
        actions={
          <Link
            href="/movies"
            className="flex items-center gap-1 text-sm text-text-muted hover:text-text-primary transition-colors"
          >
            <ChevronLeft size={16} />
            Back
          </Link>
        }
      />
      <MovieDetail movie={movie} canDelete={canDelete} />
    </>
  );
}
