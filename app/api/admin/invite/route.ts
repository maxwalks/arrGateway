import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { DEFAULT_PERMISSIONS } from "@/lib/permissions";
import type { Permissions, Profile } from "@/types/supabase";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: caller } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single() as { data: Profile | null; error: unknown };

  if (!caller?.is_admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json() as {
    email: string;
    password: string;
    display_name: string;
    permissions?: Partial<Permissions>;
  };

  const { email, password, display_name, permissions } = body;

  if (!email || !password || !display_name) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const admin = createAdminClient();

  // Create auth user
  const { data: created, error: authError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 });
  }

  const mergedPermissions: Permissions = {
    ...DEFAULT_PERMISSIONS,
    ...permissions,
  };

  // Create profile (cast needed: admin client is untyped)
  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .insert({
      id: created.user.id,
      email,
      display_name,
      is_admin: false,
      permissions: mergedPermissions as unknown as Record<string, unknown>,
      created_by: user.id,
    })
    .select()
    .single() as { data: import("@/types/supabase").Profile | null; error: { message: string } | null };

  if (profileError) {
    await admin.auth.admin.deleteUser(created.user.id);
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  return NextResponse.json(profile, { status: 201 });
}
