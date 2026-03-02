"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2, ShieldCheck, Pencil } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import type { Profile } from "@/types/supabase";

interface UserTableProps {
  users: Profile[];
  currentUserId: string;
}

export default function UserTable({ users, currentUserId }: UserTableProps) {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<Profile | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    setError(null);

    const res = await fetch(`/api/admin/users/${deleteTarget.id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Delete failed");
      setDeleting(false);
      return;
    }

    setDeleteTarget(null);
    router.refresh();
  }

  return (
    <>
      <div className="border border-border-muted rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-muted bg-surface/50">
              <th className="text-left px-5 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">
                User
              </th>
              <th className="text-left px-5 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">
                Role
              </th>
              <th className="text-left px-5 py-3 text-xs font-medium text-text-muted uppercase tracking-wider hidden md:table-cell">
                Permissions
              </th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const perms = u.permissions;
              const permLabels = [
                perms.view_movies && "Movies",
                perms.delete_movies && "Del Movies",
                perms.view_series && "Series",
                perms.delete_series && "Del Series",
                perms.view_downloads && "Downloads",
                perms.view_storage && "Storage",
              ].filter(Boolean) as string[];

              return (
                <tr
                  key={u.id}
                  className="border-b border-border-muted last:border-0 hover:bg-surface/30 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent-purple/20 border border-accent-purple/30 flex items-center justify-center text-accent-purple text-xs font-bold uppercase flex-shrink-0">
                        {u.display_name[0]}
                      </div>
                      <div>
                        <p className="font-medium text-text-primary">
                          {u.display_name}
                        </p>
                        <p className="text-xs text-text-muted">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    {u.is_admin ? (
                      <Badge variant="purple">
                        <ShieldCheck size={11} className="mr-1" />
                        Admin
                      </Badge>
                    ) : (
                      <Badge variant="muted">Member</Badge>
                    )}
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    {u.is_admin ? (
                      <span className="text-xs text-text-muted">All access</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {permLabels.map((l) => (
                          <Badge key={l} variant="muted">
                            {l}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      {!u.is_admin && (
                        <Link href={`/admin/users/${u.id}`}>
                          <Button variant="ghost" className="px-2 py-1.5">
                            <Pencil size={13} />
                          </Button>
                        </Link>
                      )}
                      {u.id !== currentUserId && (
                        <Button
                          variant="danger"
                          className="px-2 py-1.5"
                          onClick={() => setDeleteTarget(u)}
                        >
                          <Trash2 size={13} />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete user"
      >
        <p className="text-sm text-text-muted">
          Delete{" "}
          <span className="text-text-primary font-medium">
            {deleteTarget?.display_name}
          </span>
          ? This removes their account permanently.
        </p>
        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
        <div className="flex gap-3 mt-6 justify-end">
          <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={deleting}>
            <Trash2 size={14} />
            {deleting ? "Deleting…" : "Delete"}
          </Button>
        </div>
      </Modal>
    </>
  );
}
