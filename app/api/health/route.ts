import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getServiceHealth } from "@/lib/api/uptimekuma";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const services = await getServiceHealth();
    return NextResponse.json(services);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch health" },
      { status: 502 }
    );
  }
}
