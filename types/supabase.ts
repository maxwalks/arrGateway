export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Permissions {
  view_movies: boolean;
  delete_movies: boolean;
  view_series: boolean;
  delete_series: boolean;
  view_downloads: boolean;
  view_storage: boolean;
}

export interface Profile {
  id: string;
  email: string;
  display_name: string;
  is_admin: boolean;
  permissions: Permissions;
  created_at: string;
  created_by: string | null;
}

// Must match Supabase client's expected Database shape exactly.
// Use Record<never, never> (not Record<string, never>) for empty collections —
// Record<string, never> would intersect with Tables and collapse all rows to never.
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at"> & { created_at?: string };
        Update: Partial<Omit<Profile, "id">>;
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: Record<never, never>;
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
};
