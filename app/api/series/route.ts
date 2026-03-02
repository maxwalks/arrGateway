import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSeries } from "@/lib/api/sonarr";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const series = await getSeries();
    return NextResponse.json(series);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch series" },
      { status: 502 }
    );
  }
}
