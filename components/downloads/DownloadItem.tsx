import ProgressBar from "@/components/ui/ProgressBar";
import Badge from "@/components/ui/Badge";
import type { QbTorrent } from "@/types/qbittorrent";

function formatSpeed(bytesPerSec: number) {
  if (bytesPerSec < 1024) return `${bytesPerSec} B/s`;
  if (bytesPerSec < 1024 ** 2) return `${(bytesPerSec / 1024).toFixed(1)} KB/s`;
  return `${(bytesPerSec / 1024 ** 2).toFixed(1)} MB/s`;
}

function formatEta(seconds: number) {
  if (seconds >= 8640000 || seconds < 0) return "∞";
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
}

function formatSize(bytes: number) {
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(0)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
}

type BadgeVariant = "lime" | "amber" | "red" | "muted" | "purple";

function stateInfo(state: string): { label: string; variant: BadgeVariant; barColor: "lime" | "amber" | "red" | "muted" | "purple" } {
  switch (state) {
    case "downloading":
    case "metaDL":
      return { label: "Downloading", variant: "lime", barColor: "lime" };
    case "uploading":
    case "forcedUP":
      return { label: "Seeding", variant: "purple", barColor: "purple" };
    case "stalledDL":
      return { label: "Stalled", variant: "amber", barColor: "amber" };
    case "pausedDL":
    case "stoppedDL":
      return { label: "Paused", variant: "muted", barColor: "muted" };
    case "pausedUP":
    case "stoppedUP":
      return { label: "Complete", variant: "lime", barColor: "lime" };
    case "error":
    case "missingFiles":
      return { label: "Error", variant: "red", barColor: "red" };
    case "checkingDL":
    case "checkingUP":
    case "checkingResumeData":
      return { label: "Checking", variant: "amber", barColor: "amber" };
    default:
      return { label: state, variant: "muted", barColor: "muted" };
  }
}

export default function DownloadItem({ torrent }: { torrent: QbTorrent }) {
  const pct = Math.round(torrent.progress * 100);
  const { label, variant, barColor } = stateInfo(torrent.state);
  const isActive = torrent.state === "downloading" || torrent.state === "metaDL";

  return (
    <div className="px-5 py-4 border-b border-border-muted last:border-0 hover:bg-surface/50 transition-colors">
      <div className="flex items-start justify-between gap-4 mb-2">
        <p className="text-sm text-text-primary font-medium leading-snug line-clamp-1 flex-1 min-w-0">
          {torrent.name}
        </p>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Badge variant={variant}>{label}</Badge>
          <span className="text-xs text-text-muted w-8 text-right">{pct}%</span>
        </div>
      </div>

      <ProgressBar value={pct} color={barColor} className="mb-2" />

      <div className="flex items-center gap-4 text-xs text-text-muted">
        <span>{formatSize(torrent.size)}</span>
        {isActive && (
          <>
            <span className="text-accent-lime">↓ {formatSpeed(torrent.dlspeed)}</span>
            <span>ETA {formatEta(torrent.eta)}</span>
          </>
        )}
        {torrent.upspeed > 0 && (
          <span className="text-text-muted">↑ {formatSpeed(torrent.upspeed)}</span>
        )}
        {torrent.category && (
          <span className="ml-auto text-text-muted/60">{torrent.category}</span>
        )}
      </div>
    </div>
  );
}
