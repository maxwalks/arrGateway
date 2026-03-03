import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getTorrents } from "@/lib/api/qbittorrent";
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

  if (!profile || !hasPermission(profile, "view_downloads")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const torrents = await getTorrents();
    return NextResponse.json(torrents);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch downloads" },
      { status: 502 }
    );
  }
}
