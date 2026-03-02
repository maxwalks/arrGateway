"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Calendar, HardDrive, Star, Trash2, Tv2 } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import type { SonarrSeries } from "@/types/sonarr";

function formatSize(bytes: number) {
  if (bytes === 0) return "—";
  const gb = bytes / 1024 ** 3;
  return `${gb.toFixed(2)} GB`;
}

interface SeriesDetailProps {
  series: SonarrSeries;
  canDelete: boolean;
}

export default function SeriesDetail({ series, canDelete }: SeriesDetailProps) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const poster =
    series.remotePoster ??
    series.images.find((i) => i.coverType === "poster")?.remoteUrl;

  const fanart = series.images.find((i) => i.coverType === "fanart")?.remoteUrl;

  const pct = series.statistics.percentOfEpisodes;

  async function handleDelete() {
    setDeleting(true);
    setError(null);
    const res = await fetch(`/api/series/${series.id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Delete failed");
      setDeleting(false);
      return;
    }
    setConfirmOpen(false);
    router.push("/series");
    router.refresh();
  }

  return (
    <>
      {fanart && (
        <div className="relative h-48 overflow-hidden">
          <Image
            src={fanart}
            alt=""
            fill
            className="object-cover opacity-20"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
      )}

      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex gap-6">
          {poster && (
            <div className="flex-shrink-0 w-36 relative rounded-xl overflow-hidden border border-border-muted" style={{ height: 216 }}>
              <Image
                src={poster}
                alt={series.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl font-bold text-text-primary">
                {series.title}
              </h1>
              {pct === 100 ? (
                <Badge variant="lime">Complete</Badge>
              ) : pct > 0 ? (
                <Badge variant="amber">{Math.round(pct)}% downloaded</Badge>
              ) : (
                <Badge variant="muted">
                  {series.monitored ? "Monitored" : "Unmonitored"}
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap gap-4 mt-4 text-sm text-text-muted">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                {series.year}
              </span>
              <span className="flex items-center gap-1.5">
                <Tv2 size={14} />
                {series.statistics.seasonCount} seasons ·{" "}
                {series.statistics.episodeFileCount}/
                {series.statistics.episodeCount} eps
              </span>
              {series.statistics.sizeOnDisk > 0 && (
                <span className="flex items-center gap-1.5">
                  <HardDrive size={14} />
                  {formatSize(series.statistics.sizeOnDisk)}
                </span>
              )}
              {series.ratings.imdb && (
                <span className="flex items-center gap-1.5">
                  <Star size={14} />
                  {series.ratings.imdb.value.toFixed(1)} IMDb
                </span>
              )}
            </div>

            {series.genres.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {series.genres.map((g) => (
                  <Badge key={g} variant="muted">
                    {g}
                  </Badge>
                ))}
              </div>
            )}

            {series.overview && (
              <p className="mt-4 text-sm text-text-muted leading-relaxed">
                {series.overview}
              </p>
            )}

            {/* Seasons breakdown */}
            <div className="mt-4 space-y-1.5">
              {series.seasons
                .filter((s) => s.seasonNumber > 0)
                .map((season) => (
                  <div
                    key={season.seasonNumber}
                    className="flex items-center justify-between text-xs text-text-muted bg-surface border border-border-muted rounded-lg px-3 py-2"
                  >
                    <span>Season {season.seasonNumber}</span>
                    <span>
                      {season.statistics.episodeFileCount}/
                      {season.statistics.episodeCount} eps
                      {season.statistics.sizeOnDisk > 0 &&
                        ` · ${formatSize(season.statistics.sizeOnDisk)}`}
                    </span>
                  </div>
                ))}
            </div>

            {canDelete && (
              <div className="mt-6">
                <Button variant="danger" onClick={() => setConfirmOpen(true)}>
                  <Trash2 size={14} />
                  Delete series
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete series"
      >
        <p className="text-sm text-text-muted">
          Are you sure you want to delete{" "}
          <span className="text-text-primary font-medium">{series.title}</span>?
          This will remove all seasons, episodes, and files from disk.
        </p>
        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
        <div className="flex gap-3 mt-6 justify-end">
          <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
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
