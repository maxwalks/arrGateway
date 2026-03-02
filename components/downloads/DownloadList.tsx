"use client";

import useSWR from "swr";
import DownloadItem from "./DownloadItem";
import Spinner from "@/components/ui/Spinner";
import type { QbTorrent } from "@/types/qbittorrent";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function DownloadList() {
  const { data, error, isLoading } = useSWR<QbTorrent[]>(
    "/api/downloads",
    fetcher,
    { refreshInterval: 5000 }
  );

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-24 text-red-400 text-sm">
        Failed to connect to qBittorrent.
      </div>
    );
  }

  // Sort: active first, then by name
  const sorted = [...data].sort((a, b) => {
    const aActive = a.state === "downloading" || a.state === "metaDL";
    const bActive = b.state === "downloading" || b.state === "metaDL";
    if (aActive !== bActive) return aActive ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  if (sorted.length === 0) {
    return (
      <div className="text-center py-24 text-text-muted text-sm">
        No torrents in qBittorrent.
      </div>
    );
  }

  const activeCount = data.filter(
    (t) => t.state === "downloading" || t.state === "metaDL"
  ).length;

  return (
    <div>
      {activeCount > 0 && (
        <p className="text-xs text-text-muted mb-3">
          {activeCount} active · {data.length} total · refreshes every 5s
        </p>
      )}
      <div className="border border-border-muted rounded-xl overflow-hidden">
        {sorted.map((t) => (
          <DownloadItem key={t.hash} torrent={t} />
        ))}
      </div>
    </div>
  );
}
