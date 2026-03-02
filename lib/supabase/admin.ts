import { createClient } from "@supabase/supabase-js";

// No Database generic — @supabase/supabase-js v2.98 has stricter constraints
// that conflict with hand-written Database types. Use explicit type casts at call sites.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
