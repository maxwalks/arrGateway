import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getTorrents } from "@/lib/api/qbittorrent";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
