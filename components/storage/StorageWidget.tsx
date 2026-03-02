"use client";

import useSWR from "swr";
import { HardDrive } from "lucide-react";
import Card from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";
import type { StorageInfo } from "@/app/api/storage/route";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function formatBytes(bytes: number) {
  const tb = bytes / 1024 ** 4;
  if (tb >= 1) return `${tb.toFixed(2)} TB`;
  const gb = bytes / 1024 ** 3;
  return `${gb.toFixed(1)} GB`;
}

export default function StorageWidget() {
  const { data, error, isLoading } = useSWR<StorageInfo>(
    "/api/storage",
    fetcher,
    { refreshInterval: 60_000 }
  );

  return (
    <Card accent="purple" className="p-5">
      <div className="flex items-center gap-2 mb-4">
        <HardDrive size={16} className="text-accent-purple" />
        <span className="text-sm font-semibold text-text-primary">Storage</span>
      </div>

      {isLoading && <Spinner />}

      {error && (
        <p className="text-xs text-red-400">Failed to load storage info.</p>
      )}

      {data && !error && (
        <>
          {/* Bar */}
          <div className="h-2 w-full bg-border-muted rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-accent-purple rounded-full transition-all"
              style={{
                width: `${Math.min(100, (data.usedSpace / data.totalSpace) * 100)}%`,
              }}
            />
          </div>

          {/* Labels */}
          <div className="flex justify-between text-xs text-text-muted">
            <span>
              <span className="text-text-primary font-medium">
                {formatBytes(data.usedSpace)}
              </span>{" "}
              used
            </span>
            <span>{formatBytes(data.freeSpace)} free</span>
          </div>

          <p className="text-xs text-text-muted mt-1">
            {formatBytes(data.totalSpace)} total · {data.path}
          </p>
        </>
      )}
    </Card>
  );
}
