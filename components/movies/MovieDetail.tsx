"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Clock, Calendar, HardDrive, Star, Trash2 } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import type { RadarrMovie } from "@/types/radarr";

function formatSize(bytes: number) {
  if (bytes === 0) return "—";
  const gb = bytes / 1024 ** 3;
  return `${gb.toFixed(2)} GB`;
}

function statusBadge(movie: RadarrMovie) {
  if (movie.hasFile) return <Badge variant="lime">Downloaded</Badge>;
  if (movie.monitored) return <Badge variant="amber">Monitored</Badge>;
  return <Badge variant="muted">Unmonitored</Badge>;
}

interface MovieDetailProps {
  movie: RadarrMovie;
  canDelete: boolean;
}

export default function MovieDetail({ movie, canDelete }: MovieDetailProps) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const poster =
    movie.remotePoster ??
    movie.images.find((i) => i.coverType === "poster")?.remoteUrl;

  const fanart = movie.images.find((i) => i.coverType === "fanart")?.remoteUrl;

  async function handleDelete() {
    setDeleting(true);
    setError(null);
    const res = await fetch(`/api/movies/${movie.id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Delete failed");
      setDeleting(false);
      return;
    }
    setConfirmOpen(false);
    router.push("/movies");
    router.refresh();
  }

  return (
    <>
      {/* Fanart backdrop */}
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
          {/* Poster */}
          {poster && (
            <div className="flex-shrink-0 w-36 h-54 relative rounded-xl overflow-hidden border border-border-muted">
              <Image
                src={poster}
                alt={movie.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-text-primary">
                  {movie.title}
                </h1>
                {movie.originalTitle !== movie.title && (
                  <p className="text-text-muted text-sm mt-0.5">
                    {movie.originalTitle}
                  </p>
                )}
              </div>
              {statusBadge(movie)}
            </div>

            {/* Meta */}
            <div className="flex flex-wrap gap-4 mt-4 text-sm text-text-muted">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                {movie.year}
              </span>
              {movie.runtime > 0 && (
                <span className="flex items-center gap-1.5">
                  <Clock size={14} />
                  {movie.runtime}m
                </span>
              )}
              {movie.sizeOnDisk > 0 && (
                <span className="flex items-center gap-1.5">
                  <HardDrive size={14} />
                  {formatSize(movie.sizeOnDisk)}
                </span>
              )}
              {movie.ratings.imdb && (
                <span className="flex items-center gap-1.5">
                  <Star size={14} />
                  {movie.ratings.imdb.value.toFixed(1)} IMDb
                </span>
              )}
            </div>

            {/* Genres */}
            {movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {movie.genres.map((g) => (
                  <Badge key={g} variant="muted">
                    {g}
                  </Badge>
                ))}
              </div>
            )}

            {/* Overview */}
            {movie.overview && (
              <p className="mt-4 text-sm text-text-muted leading-relaxed">
                {movie.overview}
              </p>
            )}

            {/* File info */}
            {movie.movieFile && (
              <div className="mt-4 p-3 bg-surface border border-border-muted rounded-lg text-xs text-text-muted space-y-1">
                <p>
                  Quality:{" "}
                  <span className="text-text-primary">
                    {movie.movieFile.quality.quality.name}
                  </span>
                </p>
                {movie.movieFile.mediaInfo && (
                  <p>
                    Codec:{" "}
                    <span className="text-text-primary">
                      {movie.movieFile.mediaInfo.videoCodec} /{" "}
                      {movie.movieFile.mediaInfo.audioCodec}
                    </span>
                  </p>
                )}
              </div>
            )}

            {/* Delete */}
            {canDelete && (
              <div className="mt-6">
                <Button
                  variant="danger"
                  onClick={() => setConfirmOpen(true)}
                >
                  <Trash2 size={14} />
                  Delete movie
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirm modal */}
      <Modal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete movie"
      >
        <p className="text-sm text-text-muted">
          Are you sure you want to delete{" "}
          <span className="text-text-primary font-medium">{movie.title}</span>?
          This will remove the movie and all files from disk. This cannot be
          undone.
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
