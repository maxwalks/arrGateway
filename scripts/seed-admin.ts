/**
 * One-time script to create the first admin user.
 * Usage: npx tsx scripts/seed-admin.ts
 *
 * Requires env vars: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const EMAIL = process.env.ADMIN_EMAIL;
const PASSWORD = process.env.ADMIN_PASSWORD;
const DISPLAY_NAME = process.env.ADMIN_NAME ?? "Admin";

if (!EMAIL || !PASSWORD) {
  console.error("Missing ADMIN_EMAIL or ADMIN_PASSWORD env vars");
  process.exit(1);
}

async function main() {
  const { data, error } = await supabase.auth.admin.createUser({
    email: EMAIL,
    password: PASSWORD,
    email_confirm: true,
  });

  if (error) {
    console.error("Failed to create auth user:", error.message);
    process.exit(1);
  }

  const userId = data.user.id;

  const { error: profileError } = await supabase.from("profiles").insert({
    id: userId,
    email: EMAIL,
    display_name: DISPLAY_NAME,
    is_admin: true,
    permissions: {
      view_movies: true,
      delete_movies: true,
      view_series: true,
      delete_series: true,
      view_downloads: true,
      view_storage: true,
    },
  });

  if (profileError) {
    console.error("Failed to create profile:", profileError.message);
    process.exit(1);
  }

  console.log(`Admin created: ${EMAIL} (id: ${userId})`);
}

main();
