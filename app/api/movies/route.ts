import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getMovies } from "@/lib/api/radarr";
import { hasPermission } from "@/lib/permissions";
import type { Profile } from "@/types/supabase";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single() as { data: Profile | null; error: unknown };

  if (!profile || !hasPermission(profile, "view_movies")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const movies = await getMovies();
    return NextResponse.json(movies);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch movies" },
      { status: 502 }
    );
  }
}
