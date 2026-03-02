import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getMovies } from "@/lib/api/radarr";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
