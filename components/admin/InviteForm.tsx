"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import * as Switch from "@radix-ui/react-switch";
import Button from "@/components/ui/Button";
import { PERMISSION_KEYS, DEFAULT_PERMISSIONS } from "@/lib/permissions";
import type { Permissions } from "@/types/supabase";

const PERMISSION_LABELS: Record<keyof Permissions, string> = {
  view_movies: "View Movies",
  delete_movies: "Delete Movies",
  view_series: "View Series",
  delete_series: "Delete Series",
  view_downloads: "View Downloads",
  view_storage: "View Storage",
};

export default function InviteForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [permissions, setPermissions] = useState<Permissions>({
    ...DEFAULT_PERMISSIONS,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggle(key: keyof Permissions) {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, display_name: displayName, permissions }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Failed to create account");
      setLoading(false);
      return;
    }

    router.push("/admin/users");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
      {/* Fields */}
      <div className="space-y-4">
        {[
          { id: "name", label: "Display name", value: displayName, setter: setDisplayName, type: "text", placeholder: "Jane" },
          { id: "email", label: "Email", value: email, setter: setEmail, type: "email", placeholder: "jane@family.com" },
          { id: "password", label: "Password", value: password, setter: setPassword, type: "password", placeholder: "••••••••" },
        ].map(({ id, label, value, setter, type, placeholder }) => (
          <div key={id}>
            <label
              htmlFor={id}
              className="block text-xs font-medium text-text-muted uppercase tracking-wider mb-1.5"
            >
              {label}
            </label>
            <input
              id={id}
              type={type}
              required
              value={value}
              onChange={(e) => setter(e.target.value)}
              placeholder={placeholder}
              className="w-full bg-surface border border-border-muted rounded-lg px-3 py-2.5 text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-accent-purple transition-colors"
            />
          </div>
        ))}
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
              className="flex items-center justify-between px-4 py-3 rounded-lg bg-surface border border-border-muted"
            >
              <span className="text-sm text-text-primary">
                {PERMISSION_LABELS[key]}
              </span>
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

      <Button type="submit" disabled={loading}>
        {loading ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}
