"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import * as Switch from "@radix-ui/react-switch";
import Button from "@/components/ui/Button";
import { PERMISSION_KEYS } from "@/lib/permissions";
import type { Permissions, Profile } from "@/types/supabase";

const PERMISSION_LABELS: Record<keyof Permissions, string> = {
  view_movies: "View Movies",
  delete_movies: "Delete Movies",
  view_series: "View Series",
  delete_series: "Delete Series",
  view_downloads: "View Downloads",
  view_storage: "View Storage",
};

const PERMISSION_DESCRIPTIONS: Record<keyof Permissions, string> = {
  view_movies: "Browse the movie library",
  delete_movies: "Remove movies and files from disk",
  view_series: "Browse the series library",
  delete_series: "Remove series and files from disk",
  view_downloads: "See active qBittorrent downloads",
  view_storage: "See disk usage on the dashboard",
};

interface UserPermissionsFormProps {
  user: Profile;
}

export default function UserPermissionsForm({ user }: UserPermissionsFormProps) {
  const router = useRouter();
  const [permissions, setPermissions] = useState<Permissions>({
    ...user.permissions,
  });
  const [displayName, setDisplayName] = useState(user.display_name);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function toggle(key: keyof Permissions) {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);

    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ display_name: displayName, permissions }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Save failed");
      setSaving(false);
      return;
    }

    setSaved(true);
    setSaving(false);
    router.refresh();
  }

  return (
    <div className="space-y-6 max-w-lg">
      {/* Display name */}
      <div>
        <label className="block text-xs font-medium text-text-muted uppercase tracking-wider mb-1.5">
          Display name
        </label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => { setDisplayName(e.target.value); setSaved(false); }}
          className="w-full bg-surface border border-border-muted rounded-lg px-3 py-2.5 text-text-primary text-sm focus:outline-none focus:border-accent-purple transition-colors"
        />
      </div>

      {/* Permissions */}
      <div>
        <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-3">
          Permissions
        </p>
        <div className="space-y-1">
          {PERMISSION_KEYS.map((key) => (
            <div
              key={key}
              className="flex items-center justify-between px-4 py-3 rounded-lg bg-surface border border-border-muted hover:border-accent-purple/30 transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-text-primary">
                  {PERMISSION_LABELS[key]}
                </p>
                <p className="text-xs text-text-muted mt-0.5">
                  {PERMISSION_DESCRIPTIONS[key]}
                </p>
              </div>
              <Switch.Root
                checked={permissions[key]}
                onCheckedChange={() => toggle(key)}
                className="relative w-10 h-5 rounded-full transition-colors outline-none cursor-pointer data-[state=checked]:bg-accent-lime data-[state=unchecked]:bg-border-muted"
              >
                <Switch.Thumb className="block w-4 h-4 bg-white rounded-full transition-transform will-change-transform data-[state=checked]:translate-x-[22px] data-[state=unchecked]:translate-x-[2px] shadow-sm" />
              </Switch.Root>
            </div>
          ))}
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}
      {saved && <p className="text-accent-lime text-sm">Saved.</p>}

      <Button onClick={handleSave} disabled={saving}>
        {saving ? "Saving…" : "Save changes"}
      </Button>
    </div>
  );
}
