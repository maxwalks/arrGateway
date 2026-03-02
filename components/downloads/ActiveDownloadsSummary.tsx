"use client";

import useSWR from "swr";
import Link from "next/link";
import { Download } from "lucide-react";
import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";
import Spinner from "@/components/ui/Spinner";
import type { QbTorrent } from "@/types/qbittorrent";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function formatSpeed(bps: number) {
  if (bps < 1024 ** 2) return `${(bps / 1024).toFixed(0)} KB/s`;
  return `${(bps / 1024 ** 2).toFixed(1)} MB/s`;
}

export default function ActiveDownloadsSummary() {
  const { data, isLoading } = useSWR<QbTorrent[]>("/api/downloads", fetcher, {
    refreshInterval: 5000,
  });

  const active = data?.filter(
    (t) => t.state === "downloading" || t.state === "metaDL"
  ) ?? [];

  const totalSpeed = active.reduce((sum, t) => sum + t.dlspeed, 0);

  return (
    <Card accent="amber" className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Download size={16} className="text-accent-amber" />
          <span className="text-sm font-semibold text-text-primary">Downloads</span>
        </div>
        <Link
          href="/downloads"
          className="text-xs text-text-muted hover:text-text-primary transition-colors"
        >
          View all →
        </Link>
      </div>

      {isLoading && <Spinner />}

      {!isLoading && active.length === 0 && (
        <p className="text-xs text-text-muted">No active downloads.</p>
      )}

      {!isLoading && active.length > 0 && (
        <>
          <p className="text-xs text-text-muted mb-3">
            {active.length} active · ↓ {formatSpeed(totalSpeed)}
          </p>
          <div className="space-y-3">
            {active.slice(0, 4).map((t) => (
              <div key={t.hash}>
                <div className="flex justify-between text-xs text-text-muted mb-1">
                  <span className="truncate flex-1 min-w-0 mr-2">{t.name}</span>
                  <span className="flex-shrink-0">
                    {Math.round(t.progress * 100)}%
                  </span>
                </div>
                <ProgressBar value={t.progress * 100} color="amber" />
              </div>
            ))}
            {active.length > 4 && (
              <p className="text-xs text-text-muted">
                +{active.length - 4} more…
              </p>
            )}
          </div>
        </>
      )}
    </Card>
  );
}
