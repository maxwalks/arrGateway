import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { cn } from "@/lib/cn";
import type { ServiceHealth } from "@/lib/api/uptimekuma";

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ago`;
}

function uptimeColor(pct: number): string {
  if (pct >= 99) return "text-accent-cyan";
  if (pct >= 95) return "text-accent-amber";
  return "text-red-400";
}

interface HealthCardProps {
  service: ServiceHealth;
}

export default function HealthCard({ service }: HealthCardProps) {
  const { name, status, ping, uptime24h, uptime30d, lastChecked, heartbeats } = service;

  return (
    <Card accent="cyan" className="p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={cn("shrink-0 w-2 h-2 rounded-full", {
              "bg-accent-cyan shadow-[0_0_6px_var(--accent-cyan)]": status === "up",
              "bg-red-400": status === "down",
              "bg-text-muted": status === "unknown",
            })}
          />
          <span className="text-sm font-semibold text-text-primary truncate">{name}</span>
        </div>
        {status === "up" && <Badge variant="cyan">UP</Badge>}
        {status === "down" && <Badge variant="red">DOWN</Badge>}
        {status === "unknown" && <Badge variant="muted">—</Badge>}
      </div>

      {/* Heartbeat bars */}
      <div className="space-y-1">
        <div className="flex gap-px h-7 items-stretch">
          {heartbeats.length === 0 ? (
            <div className="flex-1 rounded-sm bg-border-muted" />
          ) : (
            heartbeats.map((hb, i) => (
              <div
                key={i}
                title={hb.ping != null ? `${hb.ping}ms` : hb.status === 1 ? "Up" : "Down"}
                className={cn("flex-1 rounded-sm transition-opacity hover:opacity-70", {
                  "bg-accent-cyan": hb.status === 1,
                  "bg-red-400": hb.status === 0,
                })}
              />
            ))
          )}
        </div>
        <div className="flex justify-between text-[10px] text-text-muted">
          <span>{heartbeats.length} checks</span>
          <span>now</span>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3 text-xs text-text-muted pt-0.5 border-t border-border-muted">
        <span className="font-mono text-text-primary">
          {ping != null ? `${ping}ms` : "—"}
        </span>
        <span>·</span>
        <span className={cn(uptime24h != null ? uptimeColor(uptime24h) : "")}>
          {uptime24h != null ? `${uptime24h.toFixed(1)}%` : "—"}{" "}
          <span className="text-text-muted font-normal">24h</span>
        </span>
        <span>·</span>
        <span className={cn(uptime30d != null ? uptimeColor(uptime30d) : "")}>
          {uptime30d != null ? `${uptime30d.toFixed(1)}%` : "—"}{" "}
          <span className="text-text-muted font-normal">30d</span>
        </span>
        {lastChecked && (
          <>
            <span className="ml-auto">{relativeTime(lastChecked)}</span>
          </>
        )}
      </div>
    </Card>
  );
}
