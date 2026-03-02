import type { Permissions, Profile } from "@/types/supabase";

export const PERMISSION_KEYS = [
  "view_movies",
  "delete_movies",
  "view_series",
  "delete_series",
  "view_downloads",
  "view_storage",
] as const satisfies (keyof Permissions)[];

export const DEFAULT_PERMISSIONS: Permissions = {
  view_movies: true,
  delete_movies: false,
  view_series: true,
  delete_series: false,
  view_downloads: true,
  view_storage: true,
};

export function hasPermission(
  profile: Profile,
  key: keyof Permissions
): boolean {
  if (profile.is_admin) return true;
  return profile.permissions[key] ?? false;
}
