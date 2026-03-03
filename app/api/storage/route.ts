import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getDiskSpace } from "@/lib/api/radarr";
import { hasPermission } from "@/lib/permissions";
import type { Profile } from "@/types/supabase";

export interface StorageInfo {
  path: string;
  freeSpace: number;
  totalSpace: number;
  usedSpace: number;
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single() as { data: Profile | null; error: unknown };

  if (!profile || !hasPermission(profile, "view_storage")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const disks = await getDiskSpace();

    // Prefer the disk containing /data; fall back to the largest disk
    const disk =
      disks.find((d) => d.path.startsWith("/data")) ??
      disks.sort((a, b) => b.totalSpace - a.totalSpace)[0];

    if (!disk) {
      return NextResponse.json({ error: "No disk info available" }, { status: 502 });
    }

    const result: StorageInfo = {
      path: disk.path,
      freeSpace: disk.freeSpace,
      totalSpace: disk.totalSpace,
      usedSpace: disk.totalSpace - disk.freeSpace,
    };

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch storage" },
      { status: 502 }
    );
  }
}
